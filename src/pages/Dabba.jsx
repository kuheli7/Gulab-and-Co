import { useState } from 'react'
import { Minus, Plus, Sparkles, Trash2, MessageCircle, Truck, Store } from 'lucide-react'
import { shop } from '../config/shop'
import { useCart } from '../state/CartContext'
import { money } from '../utils'
import { submitOrder, whatsappOrderUrl } from '../lib/orders'
import { navigate } from '../lib/router'
import { Cta, Done, SectionHead } from '../components/Bits'

const field = 'h-12 w-full rounded-xl border border-cream/25 bg-maroon-deep/70 px-4 text-cream placeholder:text-cream/40 outline-none focus:border-gold'

export default function Dabba() {
  const { items, count, subtotal, freeDelivery, change, clear } = useCart()
  const [mode, setMode] = useState('pickup')
  const [form, setForm] = useState({ name: '', phone: '', address: '', giftNote: '' })
  const [busy, setBusy] = useState(false)
  const [placed, setPlaced] = useState(null)
  const [error, setError] = useState('')

  const delivery = mode === 'delivery' && !freeDelivery ? shop.deliveryFee : 0
  const total = subtotal + delivery
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  async function place(e) {
    e.preventDefault()
    if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\D/g, '').slice(-10))) return setError('Please enter a valid 10-digit mobile number.')
    if (mode === 'delivery' && form.address.trim().length < 8) return setError('Please add your full delivery address.')
    setError('')
    setBusy(true)
    const order = await submitOrder({
      mode, ...form, subtotal, delivery, total,
      items: items.map((i) => ({ name: i.name, qty: i.qty, price: i.price })),
    })
    setBusy(false)
    setPlaced(order)
    clear()
  }

  return (
    <section className="jaali min-h-[70vh] bg-maroon-deep py-10 text-cream md:py-16">
      <div className="mx-auto max-w-5xl px-5">
        <SectionHead hindi="आपका डिब्बा" title="Your dabba" light>Review your sweets, tell us where it is going, and send the order on WhatsApp.</SectionHead>

        {placed ? (
          <div className="rounded-3xl border border-gold/40 bg-maroon p-6 sm:p-8">
            <Done
              title="Shubh ho!"
              action={
                <div className="mt-6 flex flex-col items-center gap-3">
                  <Cta variant="gold" href={whatsappOrderUrl(placed)} target="_blank" rel="noreferrer"><MessageCircle size={18} /> Send order on WhatsApp</Cta>
                  <button onClick={() => navigate('/sweets')} className="text-sm font-semibold text-gold underline underline-offset-4">Build another dabba</button>
                </div>
              }
            >
              <p>Order #{placed.id} is saved. Tap the button to send it to the shop on WhatsApp; the shop confirms there.</p>
              {shop.demoMode && <p className="mt-2 text-xs text-cream/50">Design preview: no payment was taken.</p>}
            </Done>
          </div>
        ) : !count ? (
          <div className="rounded-3xl border border-dashed border-cream/30 bg-maroon/60 p-10 text-center">
            <p className="font-display text-2xl">Nothing in here yet.</p>
            <p className="mt-2 text-cream/60">Every good dabba starts with one laddoo.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Cta variant="gold" onClick={() => navigate('/sweets')}>Browse the counter</Cta>
              <Cta variant="ghost" className="!border-cream/30 !text-cream" onClick={() => navigate('/gifting')}>Ready-made dabbas</Cta>
            </div>
          </div>
        ) : (
          <form onSubmit={place} className="grid gap-6 lg:grid-cols-12">
            <div className="rounded-3xl border border-gold/40 bg-maroon p-5 sm:p-7 lg:col-span-7">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-2xl">{count} {count > 1 ? 'boxes' : 'box'}</h3>
                <button type="button" onClick={clear} className="inline-flex items-center gap-1.5 text-sm text-cream/60 hover:text-gold"><Trash2 size={14} /> Empty</button>
              </div>
              <div className="mt-4 space-y-3">
                {items.map((s) => (
                  <div key={s.id} className="flex items-center gap-3 rounded-2xl bg-maroon-deep/70 p-3">
                    <img src={s.image} alt="" className="size-14 shrink-0 rounded-xl object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-display text-lg leading-tight">{s.name}</p>
                      <p className="text-xs text-cream/50">500 g · {money(s.price)}</p>
                      <div className="mt-1.5 flex items-center gap-1.5 sm:hidden">
                        <Stepper s={s} change={change} />
                      </div>
                    </div>
                    <div className="hidden items-center gap-1.5 sm:flex"><Stepper s={s} change={change} /></div>
                    <span className="w-20 text-right font-display text-lg text-gold">{money(s.price * s.qty)}</span>
                  </div>
                ))}
              </div>
              <label className="mt-5 block text-sm font-semibold text-cream/80">Hand-written gift note (optional)
                <textarea value={form.giftNote} onChange={set('giftNote')} maxLength={140} rows={2} placeholder="Happy Diwali, with love from all of us" className="mt-1.5 w-full rounded-xl border border-cream/25 bg-maroon-deep/70 p-3 text-cream placeholder:text-cream/40 outline-none focus:border-gold" />
              </label>
            </div>

            <div className="space-y-4 lg:col-span-5">
              <div className="rounded-3xl border border-gold/40 bg-maroon p-5 sm:p-7">
                <div role="radiogroup" aria-label="Pickup or delivery" className="grid grid-cols-2 gap-2">
                  {[['pickup', 'Pickup', Store], ['delivery', 'Delivery', Truck]].map(([v, label, Icon]) => (
                    <button key={v} type="button" role="radio" aria-checked={mode === v} onClick={() => setMode(v)} className={`flex h-12 items-center justify-center gap-2 rounded-full text-sm font-bold ${mode === v ? 'bg-gold text-maroon-deep' : 'border border-cream/25 text-cream/80'}`}><Icon size={16} /> {label}</button>
                  ))}
                </div>
                <div className="mt-4 space-y-3">
                  <input required autoComplete="name" value={form.name} onChange={set('name')} placeholder="Your name" aria-label="Your name" className={field} />
                  <input required type="tel" inputMode="numeric" autoComplete="tel" value={form.phone} onChange={set('phone')} placeholder="Mobile number" aria-label="Mobile number" className={field} />
                  {mode === 'delivery' && <textarea required rows={3} autoComplete="street-address" value={form.address} onChange={set('address')} placeholder="Full delivery address" aria-label="Delivery address" className={`${field} h-auto py-3`} />}
                </div>
                <dl className="mt-5 space-y-2 border-t border-cream/20 pt-4 text-sm">
                  <div className="flex justify-between"><dt className="text-cream/70">Subtotal</dt><dd>{money(subtotal)}</dd></div>
                  <div className="flex justify-between"><dt className="text-cream/70">{mode === 'delivery' ? 'Delivery' : 'Pickup'}</dt><dd>{delivery ? money(delivery) : 'Free'}</dd></div>
                  {mode === 'delivery' && !freeDelivery && <p className="text-xs text-gold">Add {money(shop.freeDeliveryAbove - subtotal)} more for free delivery.</p>}
                  <div className="flex items-baseline justify-between pt-1"><dt className="font-hindi text-lg text-gold">कुल रक़म</dt><dd className="font-display text-3xl">{money(total)}</dd></div>
                </dl>
                {error && <p role="alert" className="mt-3 text-sm font-semibold text-rose-300">{error}</p>}
                <button type="submit" disabled={busy} className="mt-5 inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-gold text-lg font-bold text-maroon-deep transition-transform hover:-translate-y-0.5 disabled:opacity-60">
                  {busy ? 'Placing…' : <>Place order <Sparkles size={18} /></>}
                </button>
                <p className="mt-3 text-center text-xs text-cream/50">You pay on {mode}. {shop.demoMode ? 'Design preview only.' : ''}</p>
              </div>
            </div>
          </form>
        )}
      </div>
    </section>
  )
}

function Stepper({ s, change }) {
  return (
    <>
      <button type="button" aria-label={`Remove one box of ${s.name}`} onClick={() => change(s.id, -1)} className="grid size-8 place-items-center rounded-full border border-cream/25 text-cream/80 hover:border-gold hover:text-gold"><Minus size={14} /></button>
      <span className="w-6 text-center font-bold">{s.qty}</span>
      <button type="button" aria-label={`Add one box of ${s.name}`} onClick={() => change(s.id, 1)} className="grid size-8 place-items-center rounded-full bg-gold text-maroon-deep"><Plus size={14} /></button>
    </>
  )
}
