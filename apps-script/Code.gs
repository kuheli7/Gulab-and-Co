/**
 * @OnlyCurrentDoc
 * (The line above limits the permission Google asks for to THIS one spreadsheet,
 *  instead of every spreadsheet in the owner's Google account. Keep it.)
 *
 * Gulab & Co. order intake: Google Sheet + email alert.
 *
 * What it does when the website posts an order:
 *   1. checks the secret token, the hidden trap field and every field of the order
 *   2. adds ONE ROW to the "Orders" tab (newest order goes on top, Status = New)
 *   3. emails the owner
 * The "Today" tab is a live view of today's orders. It is built by setup().
 *
 * It only ever ADDS rows and never sends data back, so nobody can read orders through the link.
 * Setup steps are in SETUP.md. Run setup() once, then deploy as a web app.
 */

// ---- EDIT THESE ------------------------------------------------------------------------------
const CONFIG = {
  SECRET_TOKEN: 'change-this-to-a-long-random-string', // must match VITE_ORDERS_TOKEN on the website
  OWNER_EMAIL: 'owner@example.com', // new-order emails go here
  SHOP_NAME: 'Gulab & Co.',
  TIMEZONE: 'Asia/Kolkata',
  FREE_DELIVERY_ABOVE: 799, // keep in sync with shop.js
  DELIVERY_FEE: 60, //          keep in sync with shop.js
  MAX_ORDERS_PER_PHONE_PER_HOUR: 5,
  // Prices per 500 g box. Used only to double-check the total the website sent.
  // A mismatch still saves the order (so nothing is lost) but writes CHECK TOTAL in Notes.
  // Keep in sync with src/data/sweets.js. Set to {} to skip the check.
  PRICES: {
    'kaju-katli': 560,
    'pista-barfi': 520,
    motichoor: 260,
    'besan-laddoo': 240,
    'gulab-jamun': 210,
    jalebi: 190,
    kulfi: 280,
    rabri: 320,
  },
};
// ---------------------------------------------------------------------------------------------

const ORDERS_TAB = 'Orders';
const TODAY_TAB = 'Today';
const HEADERS = [
  'Received', 'Ref', 'Name', 'Phone', 'Pickup / Delivery', 'Address',
  'Items', 'Gift note', 'Subtotal', 'Delivery', 'Total', 'Status', 'Notes',
];
const COL = { RECEIVED: 1, PHONE: 4, SUBTOTAL: 9, DELIVERY: 10, TOTAL: 11, STATUS: 12 };
const STATUSES = ['New', 'Confirmed', 'Packed', 'Out for delivery', 'Delivered', 'Cancelled'];

/** Receives an order from the website. */
function doPost(e) {
  try {
    const raw = e && e.postData && e.postData.contents;
    if (!raw || raw.length > 10000) return reply_('bad request');

    let data;
    try {
      data = JSON.parse(raw);
    } catch (err) {
      return reply_('bad request');
    }

    // Hidden trap field: real customers never fill it. Pretend success so bots don't retry.
    if (data.website) return reply_('ok');

    if (!data.token || data.token !== CONFIG.SECRET_TOKEN) return reply_('forbidden');

    const checked = validate_(data);
    if (!checked.ok) return reply_('invalid: ' + checked.error);
    const order = checked.order;

    const lock = LockService.getScriptLock();
    lock.waitLock(15000);
    try {
      const cache = CacheService.getScriptCache();

      // Same reference twice (double tap, retry): ignore the repeat.
      if (cache.get('ref:' + order.ref)) return reply_('ok');
      cache.put('ref:' + order.ref, '1', 6 * 60 * 60);

      // Too many orders from one phone number in an hour: probably spam.
      const phoneKey = 'phone:' + order.phone;
      const seen = Number(cache.get(phoneKey) || 0);
      if (seen >= CONFIG.MAX_ORDERS_PER_PHONE_PER_HOUR) return reply_('slow down');
      cache.put(phoneKey, String(seen + 1), 60 * 60);

      addRow_(order);
    } finally {
      lock.releaseLock();
    }

    notifyOwner_(order);
    return reply_('ok');
  } catch (err) {
    console.error(err);
    return reply_('error');
  }
}

/** Opening the link in a browser shows nothing useful (and nothing private). */
function doGet() {
  return ContentService.createTextOutput(CONFIG.SHOP_NAME + ' orders endpoint');
}

function reply_(message) {
  return ContentService.createTextOutput(JSON.stringify({ result: message })).setMimeType(ContentService.MimeType.JSON);
}

// ---- Validation ------------------------------------------------------------------------------

function validate_(d) {
  const text = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

  const name = text(d.name, 60);
  if (!name) return { ok: false, error: 'name' };

  const phone = String(d.phone || '').replace(/\D/g, '').slice(-10);
  if (!/^[6-9]\d{9}$/.test(phone)) return { ok: false, error: 'phone' };

  const mode = d.mode === 'delivery' ? 'delivery' : d.mode === 'pickup' ? 'pickup' : '';
  if (!mode) return { ok: false, error: 'mode' };

  const address = text(d.address, 300);
  if (mode === 'delivery' && address.length < 8) return { ok: false, error: 'address' };

  if (!Array.isArray(d.items) || d.items.length < 1 || d.items.length > 20) return { ok: false, error: 'items' };
  const items = [];
  for (let i = 0; i < d.items.length; i++) {
    const it = d.items[i] || {};
    const qty = Number(it.qty);
    const price = Number(it.price);
    const itemName = text(it.name, 60);
    if (!itemName || !Number.isInteger(qty) || qty < 1 || qty > 50 || !isFinite(price) || price < 0) {
      return { ok: false, error: 'item ' + (i + 1) };
    }
    items.push({ id: text(it.id, 40), name: itemName, qty: qty, price: price });
  }

  const subtotal = items.reduce(function (s, it) { return s + it.qty * it.price; }, 0);
  const delivery = Number(d.delivery) || 0;
  const total = Number(d.total);
  if (!isFinite(total)) return { ok: false, error: 'total' };

  // Double-check the maths against our own price list. Never rejects; just flags for a human.
  const notes = [];
  const known = Object.keys(CONFIG.PRICES).length > 0;
  if (known) {
    let expected = 0;
    let unknownItem = false;
    items.forEach(function (it) {
      const p = CONFIG.PRICES[it.id];
      if (p === undefined) unknownItem = true;
      else expected += p * it.qty;
    });
    if (unknownItem) {
      notes.push('CHECK TOTAL: unknown item id');
    } else {
      const expectedDelivery = mode === 'delivery' && expected < CONFIG.FREE_DELIVERY_ABOVE ? CONFIG.DELIVERY_FEE : 0;
      if (expected + expectedDelivery !== total) {
        notes.push('CHECK TOTAL: site sent ' + total + ', price list says ' + (expected + expectedDelivery));
      }
    }
  }
  if (subtotal + delivery !== total) notes.push('CHECK TOTAL: lines do not add up');

  return {
    ok: true,
    order: {
      ref: text(d.id, 20) || 'GC-' + Date.now().toString(36).slice(-4).toUpperCase(),
      name: name,
      phone: phone,
      mode: mode,
      address: mode === 'delivery' ? address : '',
      items: items,
      giftNote: text(d.giftNote, 140),
      subtotal: subtotal,
      delivery: delivery,
      total: total,
      notes: notes.join('; '),
    },
  };
}

// ---- Sheet -----------------------------------------------------------------------------------

/** Anything that starts with = + - @ would be read by Sheets as a formula. Force it to plain text. */
function safe_(value) {
  const s = String(value);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function addRow_(o) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(ORDERS_TAB);
  if (!sheet) throw new Error('Run setup() first: the Orders tab is missing.');

  const itemsText = o.items.map(function (it) { return it.qty + '× ' + it.name; }).join(', ');
  const row = [
    new Date(), o.ref, safe_(o.name), o.phone,
    o.mode === 'delivery' ? 'Delivery' : 'Pickup',
    safe_(o.address), safe_(itemsText), safe_(o.giftNote),
    o.subtotal, o.delivery, o.total, 'New', safe_(o.notes),
  ];

  sheet.insertRowBefore(2); // newest order goes on top, right under the header
  const range = sheet.getRange(2, 1, 1, HEADERS.length);
  range.clearFormat(); // the new row would otherwise copy the header's look
  range.setValues([row]);
  range.setVerticalAlignment('top').setWrap(true);
  sheet.getRange(2, COL.RECEIVED).setNumberFormat('dd-mmm hh:mm');
  sheet.getRange(2, COL.PHONE).setNumberFormat('@');
  sheet.getRange(2, COL.SUBTOTAL, 1, 3).setNumberFormat('₹#,##0');
  sheet.getRange(2, COL.STATUS).setDataValidation(statusRule_());
}

function statusRule_() {
  return SpreadsheetApp.newDataValidation().requireValueInList(STATUSES, true).setAllowInvalid(false).build();
}

// ---- Email -----------------------------------------------------------------------------------

function notifyOwner_(o) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const lines = o.items.map(function (it) { return '  ' + it.qty + ' × ' + it.name + ' (500 g)'; });
    const body = [
      'New order ' + o.ref + ' · ' + o.mode.toUpperCase(),
      '',
      o.name + ' · ' + o.phone,
      o.mode === 'delivery' ? 'Deliver to: ' + o.address : 'Pickup from the counter',
      '',
      lines.join('\n'),
      '',
      o.giftNote ? 'Gift note: ' + o.giftNote : '',
      'Delivery: ' + (o.delivery ? '₹' + o.delivery : 'Free'),
      'TOTAL: ₹' + o.total + ' (pay on ' + (o.mode === 'delivery' ? 'delivery' : 'pickup') + ')',
      o.notes ? '\n⚠ ' + o.notes : '',
      '',
      'Open the sheet: ' + ss.getUrl(),
      'Confirm with the customer on WhatsApp, then set Status in the Orders tab.',
    ].filter(function (l, i, a) { return !(l === '' && a[i - 1] === ''); }).join('\n');

    MailApp.sendEmail({
      to: CONFIG.OWNER_EMAIL,
      subject: 'New order ' + o.ref + ' · ₹' + o.total + ' · ' + (o.mode === 'delivery' ? 'Delivery' : 'Pickup') + ' · ' + o.name,
      body: body,
      name: CONFIG.SHOP_NAME + ' orders',
    });
  } catch (err) {
    // Email quota used up, or similar. The row is already saved, so the order is not lost.
    console.error('Email failed: ' + err);
  }
}

// ---- One-time setup --------------------------------------------------------------------------

/** Run this ONCE from the editor. Builds the Orders and Today tabs. Safe to run again. */
function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.setSpreadsheetTimeZone(CONFIG.TIMEZONE);

  // Orders tab
  let orders = ss.getSheetByName(ORDERS_TAB);
  if (!orders) {
    const first = ss.getSheets()[0];
    orders = first.getLastRow() === 0 && first.getName().indexOf('Sheet') === 0 ? first.setName(ORDERS_TAB) : ss.insertSheet(ORDERS_TAB);
  }
  orders.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS])
    .setFontWeight('bold').setBackground('#5b1a1a').setFontColor('#e6c25a').setVerticalAlignment('middle');
  orders.setFrozenRows(1);
  const widths = [110, 80, 140, 110, 110, 240, 280, 180, 90, 80, 90, 130, 220];
  widths.forEach(function (w, i) { orders.setColumnWidth(i + 1, w); });

  // Highlight orders nobody has dealt with yet, grey out finished ones
  const rules = [
    SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=$L2="New"').setBackground('#fbf0c9').setBold(true)
      .setRanges([orders.getRange('A2:M')]).build(),
    SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=OR($L2="Delivered",$L2="Cancelled")').setFontColor('#999999')
      .setRanges([orders.getRange('A2:M')]).build(),
  ];
  orders.setConditionalFormatRules(rules);
  orders.getRange(2, COL.STATUS, orders.getMaxRows() - 1, 1).setDataValidation(statusRule_());

  // Today tab: a live, read-only view of today's orders
  let today = ss.getSheetByName(TODAY_TAB);
  if (!today) today = ss.insertSheet(TODAY_TAB);
  today.clear();
  today.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS])
    .setFontWeight('bold').setBackground('#5b1a1a').setFontColor('#e6c25a');
  today.getRange('A2').setFormula(
    '=IFERROR(FILTER(Orders!A2:M, INT(Orders!A2:A)=TODAY()), "No orders yet today")'
  );
  today.getRange('O1').setValue('Read-only view of today. Change Status in the Orders tab.').setFontStyle('italic').setFontColor('#777777');
  today.setFrozenRows(1);
  widths.forEach(function (w, i) { today.setColumnWidth(i + 1, w); });
  today.getRange('A2:A').setNumberFormat('dd-mmm hh:mm');
  today.getRange(2, COL.SUBTOTAL, today.getMaxRows() - 1, 3).setNumberFormat('₹#,##0');

  ss.setActiveSheet(today);
  SpreadsheetApp.flush();
  console.log('Setup done. Now deploy as a web app (see SETUP.md).');
}

/** Optional: run this from the editor to add a fake order and test the email. Delete the row afterwards. */
function testOrder() {
  const fake = {
    token: CONFIG.SECRET_TOKEN,
    id: 'GC-T' + Date.now().toString(36).slice(-3).toUpperCase(), // unique, or the duplicate check would skip a second test
    name: 'Test Customer',
    phone: '9876543210',
    mode: 'pickup',
    items: [{ id: 'kaju-katli', name: 'Kaju Katli', qty: 1, price: CONFIG.PRICES['kaju-katli'] || 560 }],
    delivery: 0,
    total: CONFIG.PRICES['kaju-katli'] || 560,
    giftNote: 'Test',
  };
  const result = doPost({ postData: { contents: JSON.stringify(fake) } });
  console.log(result.getContent());
}
