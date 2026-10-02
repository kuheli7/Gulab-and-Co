# Orders into a Google Sheet (with an email alert)

Optional. Without this, the site works exactly as before: the customer sends the order on WhatsApp. With it, **every order also lands as a row in the shop's Google Sheet and the owner gets an email**. WhatsApp still opens for the customer as their confirmation and as a backup.

Takes about 15 minutes per shop. The sheet and the script belong to the **shop owner's Google account**, not yours.

## What the owner gets

- **Orders** tab: one row per order, **newest on top**, with a `Status` dropdown (New, Confirmed, Packed, Out for delivery, Delivered, Cancelled). New orders are highlighted until the status is changed.
- **Today** tab: a live, read-only view of today's orders. Change statuses in the **Orders** tab.
- An **email** for every new order, with the items, total, address and a link to the sheet.

| Column | Example |
| --- | --- |
| Received | 02-Oct 14:32 |
| Ref | GC-LCAV |
| Name, Phone | Asha, 9876543210 |
| Pickup / Delivery | Delivery |
| Address | 12, 4th Cross, Jayanagar |
| Items | 1× Kaju Katli, 2× Motichoor Laddoo |
| Gift note | Happy Diwali |
| Subtotal, Delivery, Total | ₹1,080, ₹0, ₹1,080 |
| Status | New |
| Notes | blank, or `CHECK TOTAL …` if the maths looks wrong |

## Setup

1. **Create the sheet.** Go to [sheets.new](https://sheets.new) (signed in as the shop owner) and name it, e.g. `Gulab & Co Orders`.
2. **Add the script.** In the sheet: **Extensions → Apps Script**. Delete what's there and paste in all of [`Code.gs`](./Code.gs).
3. **Edit the top of the script (`CONFIG`):**
   - `SECRET_TOKEN`: a long random string (30+ characters). Make one up; you'll paste the same one into the website in step 7.
   - `OWNER_EMAIL`: where new-order emails go.
   - `FREE_DELIVERY_ABOVE`, `DELIVERY_FEE`, `PRICES`: keep them the same as `src/config/shop.js` and `src/data/sweets.js`.
4. **Build the tabs.** In the editor pick the function **`setup`** from the dropdown at the top and click **Run**. Google asks for permission the first time and shows **"Google hasn't verified this app"**. That's normal for a script you wrote yourself and haven't submitted to Google for review. Choose the owner's account → click the small **Advanced** link at the bottom left → **Go to (project name) (unsafe)** → **Allow**. It asks for two things only: to work with **this one spreadsheet** (thanks to the `@OnlyCurrentDoc` line at the top of the script) and to **send email as the owner** (for the new-order alerts). The sheet now has the **Orders** and **Today** tabs.
5. **Deploy it.** Click **Deploy → New deployment** → the gear icon → **Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Click **Deploy** and copy the **Web app URL** (it ends in `/exec`).
6. **Test the script.** Pick **`testOrder`** and click **Run**. A test row should appear at the top of **Orders** and the email should arrive (check spam the first time and mark it "not spam"). Delete the test row afterwards.
7. **Connect the website.** Set two environment variables where the site is hosted (Vercel: Project → Settings → Environment Variables), then **redeploy**:

   ```
   VITE_ORDERS_ENDPOINT = <the Web app URL from step 5>
   VITE_ORDERS_TOKEN    = <the SECRET_TOKEN from step 3>
   ```

   For local testing, copy `.env.example` to `.env` and fill in the same two values.
8. **Place a real test order on the site** and check the sheet and the email.

## Changing the script later

Edit it, then **Deploy → Manage deployments → ✏️ edit → Version: New version → Deploy**. This keeps the same URL. If you choose **New deployment** instead, the URL changes and the website needs the new one.

If you change prices or delivery rules on the website, change them in `CONFIG` too, or the `Notes` column will flag good orders with `CHECK TOTAL`.

## How it is protected (and what it isn't)

| Protection | What it stops |
| --- | --- |
| Secret token | Casual spam. **It is not a lock**: it ships inside the website's code, so a determined person can find it. |
| Hidden trap field | Simple bots. They fill it in, and their order is dropped. |
| Checks on every field | Bad phone numbers, empty names, 1000-box orders, oversized or broken requests are all refused. |
| Maths check | A faked price still saves the order but writes `CHECK TOTAL` in Notes so a person looks. |
| Formula guard | Names or notes starting with `=`, `+`, `-` or `@` are stored as plain text, so nobody can plant a formula in the sheet. |
| Duplicate and rate limits | The same order twice is ignored; one phone number is limited to 5 orders an hour. |
| Write-only link | The link can add rows but never returns any data, so orders can't be read through it. |

The realistic worst case is some junk rows and a few unwanted emails. Nobody can pull customer details out through the link.

**Privacy:** the sheet holds customers' names, phone numbers and addresses. Keep it private (don't share the link publicly), share it only with people who need it, and consider a line at checkout such as "We use your details only to prepare and deliver your order."

## Good to know

- **No success message.** Browsers don't let a website read Apps Script's reply, so the site can't confirm the row was written. That's why WhatsApp stays as the backup, and the order still reaches the shop if the sheet step fails.
- **Email limit.** A normal Gmail account can send about 100 script emails a day. If that runs out, the row is still saved and only the email is skipped. A busy shop should switch the alert to Telegram.
- **Bulk / wedding enquiries** (the Gifting page form) are not sent to the sheet; they go through WhatsApp only.
- **Keep the public demo switched off.** If the demo had a live endpoint, anyone visiting could add rows. Only set the two variables for a real client's deployment. With them unset the site sends nothing anywhere.
