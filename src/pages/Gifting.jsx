import { useState } from 'react'
import { ChevronDown, Gift, PackageCheck, Palette, Clock, Send } from 'lucide-react'
import { shop } from '../config/shop'
import { hampers, bySweetId } from '../data/sweets'
import { useCart } from '../state/CartContext'
import { chatUrl } from '../lib/orders'
import { navigate } from '../lib/router'
import { money } from '../utils'
import { Reveal, SectionHead, Cta } from '../components/Bits'

const occasions = ['Wedding', 'Diwali / festival', 'Corporate gifting', 'Birthday / puja', 'Other']
const field = 'h-12 w-full rounded-xl border border-ink/20 bg-white px-4 outline-none focus:border-maroon'

export default function Gifting() {
  const { addMany } = useCart()
  const [f, setF] = useState({ name: '', phone: '', occasion: '', qty: '', date: '', note: '' })
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  const send = (e) => {
    e.preventDefault()
    const text = [
      `*Bulk / gifting enquiry · ${shop.name}*`,
      `Name: ${f.name} (${f.phone})`,
      `Occasion: ${f.occasion}`,
      `Approx. dabbas: ${f.qty}`,
      f.date && `Needed by: ${f.date}`,
      f.note && `Notes: ${f.note}`,
    ].filter(Boolean).join('\n')
    window.open(chatUrl(text), '_blank', 'noopener')
  }

  return (
    <>
      <section className="mx-auto max-w-6xl px-5 py-10 md:py-16">
        <Reveal><SectionHead hindi="त्योहारों का तोहफ़ा" title="Festive & wedding gifting">Gold dabbas tied with red thread and a hand-written note, ready in 48 hours for bulk orders.</SectionHead></Reveal>
        <div className="grid gap-5 md:grid-cols-3">
          {hampers.map((h, i) => {
            const total = Object.entries(h.items).reduce((s, [id, n]) => s + bySweetId[id].price * n, 0)
            return (
              <Reveal key={h.id} delay={i * 100}>
                <article className="glow flex h-full flex-col rounded-3xl bg-white p-4">
                  <div className="grid grid-cols-2 gap-1.5 overflow-hidden rounded-2xl">
                    {[...Object.keys(h.items).map((id) => bySweetId[id]), { name: 'Gold gift dabba', image: '/images/dabba.jpg' }].slice(0, 4).map((s) => <img key={s.name} src={s.image} alt={s.name} loading="lazy" className="aspect-square w-full object-cover" />)}
                  </div>
                  <p className="mt-4 font-hindi text-maroon">{h.hindi}</p>
                  <h3 className="font-display text-2xl">{h.name}</h3>
                  <p className="mt-1.5 text-sm text-ink/60">{h.blurb}</p>
                  <ul className="mt-3 flex-1 space-y-0.5 text-sm text-ink/70">
                    {Object.entries(h.items).map(([id, n]) => <li key={id}>{n} × {bySweetId[id].name}</li>)}
                  </ul>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-display text-2xl text-maroon">{money(total)}</span>
                    <button onClick={() => { addMany(h.items); navigate('/dabba') }} className="inline-flex h-11 items-center gap-2 rounded-full bg-maroon px-5 text-sm font-bold text-gold">Add to dabba <Gift size={15} /></button>
                  </div>
                </article>
              </Reveal>
            )
          })}
        </div>
      </section>

      <section className="jaali bg-maroon-deep py-14 text-cream md:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHead hindi="थोक ऑर्डर" title="Bulk & wedding orders" light>Tell us the occasion and the count. We reply on WhatsApp with a quote within a few hours.</SectionHead>
            <ul className="space-y-4">
              {[[Clock, 'Ready in 48 hours', 'For 25 dabbas or more. Rush orders by request.'], [Palette, 'Custom boxes & thread', 'Your family name, wedding date or company logo on the box.'], [PackageCheck, 'Delivery, packed safe', 'Hand-packed and delivered across Bengaluru.']].map(([Icon, t, d]) => (
                <li key={t} className="flex gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-full bg-gold text-maroon-deep"><Icon size={18} /></span><div><p className="font-bold">{t}</p><p className="text-sm text-cream/60">{d}</p></div></li>
              ))}
            </ul>
          </div>
          <form onSubmit={send} className="rounded-3xl bg-cream p-5 text-ink sm:p-8 lg:col-span-7">
            <h3 className="font-display text-2xl">Request a quote</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <input required value={f.name} onChange={set('name')} placeholder="Your name" aria-label="Your name" autoComplete="name" className={field} />
              <input required type="tel" inputMode="numeric" value={f.phone} onChange={set('phone')} placeholder="Mobile number" aria-label="Mobile number" autoComplete="tel" className={field} />
              <div className="relative">
                <ChevronDown size={16} aria-hidden className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink/60" />
                <select required value={f.occasion} onChange={set('occasion')} aria-label="Occasion" className={`${field} appearance-none pr-10 ${f.occasion ? '' : 'text-ink/40'}`}>
                  <option value="" disabled>Select occasion</option>
                  {occasions.map((o) => <option key={o} className="text-ink">{o}</option>)}
                </select>
              </div>
              <input required type="number" inputMode="numeric" min="10" value={f.qty} onChange={set('qty')} aria-label="Approximate number of dabbas" placeholder="Number of dabbas (min. 10)" className={field} />
              <label className="sm:col-span-2 text-sm font-semibold text-ink/70">Needed by <input type="date" value={f.date} onChange={set('date')} className={`${field} mt-1`} /></label>
              <textarea rows={3} value={f.note} onChange={set('note')} placeholder="Anything we should know? Favourite sweets, custom note, budget…" aria-label="Notes" className={`${field} h-auto py-3 sm:col-span-2`} />
            </div>
            <Cta variant="primary" className="mt-5 w-full" type="submit"><Send size={17} /> Send enquiry on WhatsApp</Cta>
            <p className="mt-2.5 text-center text-xs text-ink/50">Opens WhatsApp with your details filled in. Nothing is sent until you press Send.</p>
          </form>
        </div>
      </section>
    </>
  )
}
