// The one place an order "leaves" the app. Demo mode: a free wa.me link opens WhatsApp with the whole
// order typed out; the guest only presses Send. To connect a real backend later (Google Sheet, Telegram,
// Supabase...), add the call inside submitOrder(). Nothing else needs to change.
import { shop } from '../config/shop'
import { money } from '../utils'

const KEY = 'gc:orders'

const read = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? []
  } catch {
    return []
  }
}

export async function submitOrder(draft) {
  await new Promise((resolve) => setTimeout(resolve, 600)) // stands in for the network round-trip
  const orders = read()
  const order = { ...draft, id: 2001 + orders.length, createdAt: new Date().toISOString() }
  try {
    localStorage.setItem(KEY, JSON.stringify([...orders, order]))
  } catch {
    /* storage can be blocked (private mode): the order still succeeds on screen */
  }
  return order
}

export function whatsappOrderUrl(order) {
  const lines = [
    `*New dabba order #${order.id} · ${shop.name}*`,
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
