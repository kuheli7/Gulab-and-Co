// How an order reaches the shop.
//
// Demo / free mode: nothing is stored on a server. The site builds the whole order as a WhatsApp message
// and opens WhatsApp to the shop's number (a free wa.me link: no account, API or fees). The order only
// reaches the shop when the customer presses Send in WhatsApp.
//
// To receive orders somewhere automatic later (Google Sheet, Telegram bot, Supabase...), send the order
// from buildOrder()'s caller (see place() in pages/Dabba.jsx) before opening WhatsApp.
import { shop } from '../config/shop'
import { money } from '../utils'

// A short reference the customer and the shop can both quote, e.g. GC-7K2F.
// Time-based so two customers don't share a number.
const reference = () => `GC-${Date.now().toString(36).slice(-4).toUpperCase()}`

export function buildOrder(draft) {
  return { ...draft, id: reference(), createdAt: new Date().toISOString() }
}

export function whatsappOrderUrl(order) {
  const lines = [
    `*New dabba order ${order.id} · ${shop.name}*`,
    order.mode === 'delivery' ? `Delivery to: ${order.address}` : 'Pickup from the counter',
    `Name: ${order.name} (${order.phone})`,
    '',
    ...order.items.map((i) => `${i.qty} × ${i.name} (500 g) — ${money(i.qty * i.price)}`),
    '',
    order.giftNote ? `Gift note: "${order.giftNote}"\n` : '',
    `Subtotal: ${money(order.subtotal)}`,
    `Delivery: ${order.delivery ? money(order.delivery) : 'Free'}`,
    `*Total: ${money(order.total)}*`,
    'Paying on pickup / delivery.',
  ]
  const text = lines.filter((l, i) => l !== '' || lines[i - 1] !== '').join('\n')
  return chatUrl(text)
}

export const chatUrl = (text = 'Namaste! I have a question.') => `https://wa.me/${shop.whatsapp}?text=${encodeURIComponent(text)}`
