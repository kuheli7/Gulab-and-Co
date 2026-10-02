import { MapPin, Phone, Clock, Mail, MessageCircle, Navigation } from 'lucide-react'
import { shop } from '../config/shop'
import { chatUrl } from '../lib/orders'
import { isOpenNow } from '../utils'
import { Cta, SectionHead } from '../components/Bits'

export default function Contact() {
  const open = isOpenNow()
  const rows = [
    [MapPin, 'Visit the counter', shop.address],
    [Phone, 'Call us', shop.phone, `tel:${shop.phone.replace(/\s/g, '')}`],
    [Mail, 'Email', shop.email, `mailto:${shop.email}`],
  ]
  return (
    <section className="mx-auto max-w-6xl px-5 py-10 md:py-16">
      <SectionHead hindi="हमसे मिलिए" title="Visit & contact">Come to the lane, call ahead, or message us. We reply fastest on WhatsApp.</SectionHead>
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-5">
          {rows.map(([Icon, label, value, href]) => (
            <div key={label} className="flex gap-4 rounded-2xl border border-gold/50 bg-sand/60 p-5">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-maroon text-gold"><Icon size={18} /></span>
              <div><p className="text-sm font-bold text-ink/50">{label}</p>{href ? <a href={href} className="font-semibold hover:text-maroon">{value}</a> : <p className="font-semibold">{value}</p>}</div>
            </div>
          ))}
          <div className="rounded-2xl border border-gold/50 bg-sand/60 p-5">
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-2 font-display text-xl"><Clock size={18} className="text-maroon" /> Opening hours</p>
              <span className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${open ? 'bg-pista/50 text-ink' : 'bg-rose/20 text-maroon'}`}><span className={`size-2 rounded-full ${open ? 'bg-green-700' : 'bg-rose'}`} />{open ? 'Open now' : 'Closed now'}</span>
            </div>
            <dl className="mt-3 space-y-1.5 text-sm">
              {shop.hours.map((h) => <div key={h.days} className="flex justify-between gap-4"><dt className="font-semibold">{h.days}</dt><dd className="text-right text-ink/65">{h.time}</dd></div>)}
            </dl>
          </div>
          <div className="flex flex-wrap gap-3">
            <Cta variant="primary" href={chatUrl()} target="_blank" rel="noreferrer"><MessageCircle size={18} /> WhatsApp</Cta>
            <Cta variant="ghost" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shop.mapQuery)}`} target="_blank" rel="noreferrer"><Navigation size={17} /> Directions</Cta>
          </div>
        </div>
        <div className="overflow-hidden rounded-3xl border-2 border-gold p-1.5 lg:col-span-7">
          <iframe title="Map to Gulab & Co." src={shop.mapEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="h-[22rem] w-full rounded-[1.25rem] border-0 lg:h-full lg:min-h-[28rem]" />
        </div>
      </div>
    </section>
  )
}
