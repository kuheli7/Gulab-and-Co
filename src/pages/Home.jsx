import { Star, MapPin, Clock, Sparkles, ArrowRight, Flame, Truck, Gift } from 'lucide-react'
import { shop } from '../config/shop'
import { sweets, hampers, bySweetId } from '../data/sweets'
import { Link } from '../components/Layout'
import { Cta, Marquee, Reveal, SectionHead, Seal, SweetCard } from '../components/Bits'
import { useCart } from '../state/CartContext'
import { navigate } from '../lib/router'
import { money } from '../utils'

const marqueeWords = ['शुद्ध देसी घी', 'Fresh every morning', `Since ${shop.since}`, 'Gandhi Bazaar · Bengaluru', 'Festive & wedding dabbas', 'No palm oil, ever']

const reviews = [
  { name: 'Anjali M.', place: 'Jayanagar', text: 'The kaju katli is the only one my dadi approves of. We have ordered every Diwali for six years.' },
  { name: 'Rahul S.', place: 'Indiranagar', text: 'Ordered 40 dabbas for our wedding. Packed beautifully, arrived warm, not one broken piece.' },
  { name: 'Meera K.', place: 'Whitefield', text: 'That motichoor laddoo. I do not have words. Just order it.' },
]

export default function Home() {
  const featured = sweets.filter((s) => s.tag).slice(0, 4)
  const { addMany } = useCart()

  return (
    <>
      <section className="mx-auto grid max-w-6xl items-center gap-6 px-5 pb-12 pt-5 md:grid-cols-12 md:gap-10 md:pb-14 md:pt-20">
        <div className="rise order-2 text-center md:order-1 md:col-span-6 md:text-left">
          <span className="inline-block rounded-full border border-gold bg-gold-soft/60 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-maroon">Est. {shop.since} · Gandhi Bazaar, Bengaluru</span>
          <h1 className="mt-4 font-display text-[clamp(2.4rem,8vw,5.5rem)] leading-[1.02] tracking-tight md:mt-5">
            <span className="font-hindi text-maroon">मिठास,</span> the way Bengaluru remembers it.
          </h1>
          <p className="mt-3 text-[15px] text-ink/70 md:mt-5 md:max-w-md md:text-lg"><span className="md:hidden">Hand-churned in pure desi ghee, fresh every morning.</span><span className="hidden md:inline">Hand-churned, slow-cooked and fried in pure desi ghee every single morning. Four generations of halwais, one narrow lane, zero shortcuts.</span></p>
          <div className="mt-5 flex justify-center gap-3 md:mt-7 md:justify-start">
            <Cta to="/sweets" variant="primary" className="!px-6" onClick={() => navigate('/sweets')}>See the counter <Sparkles size={17} /></Cta>
            <Cta variant="ghost" className="!px-6" onClick={() => navigate('/gifting')}>Gifting</Cta>
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-[13px] font-semibold text-ink/60 md:mt-8 md:justify-start md:gap-x-6 md:text-sm">
            <span className="flex items-center gap-1.5"><Star size={15} className="fill-gold text-gold" /> 4.9 from 12,000+ families</span>
            <span className="hidden items-center gap-1.5 sm:flex"><MapPin size={15} /> Gandhi Bazaar</span>
            <span className="flex items-center gap-1.5"><Clock size={15} /> 8 am – 10 pm</span>
          </div>
        </div>
        <div className="relative order-1 md:order-2 md:col-span-6">
          <div className="mx-auto max-w-md rounded-t-[12rem] border-2 border-gold p-1.5 md:p-2">
            <img src="/images/mithai-hero.jpg" alt="Assorted Indian mithai (kaju katli, laddoo, pista barfi and gulab jamun) on brass plates" width={1024} height={1024} fetchPriority="high" className="aspect-[5/4] w-full rounded-t-[11rem] object-cover md:aspect-[4/5]" />
          </div>
          <Seal className="absolute -bottom-3 right-3 size-20 rotate-6 sm:right-0 md:-left-4 md:bottom-auto md:right-auto md:top-8 md:size-28 md:-rotate-6" />
        </div>
      </section>

      <Marquee words={marqueeWords} />

      <section className="mx-auto max-w-6xl px-5 py-14 md:py-20">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHead hindi="आज का काउंटर" title="Fresh from the counter">Made in small batches every morning. Prices per 500 g.</SectionHead>
            <Link to="/sweets" className="mb-8 inline-flex items-center gap-1.5 font-bold text-maroon hover:underline">See all {sweets.length} sweets <ArrowRight size={16} /></Link>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {featured.map((s, i) => (
            <Reveal key={s.id} delay={i * 80}><SweetCard sweet={s} /></Reveal>
          ))}
        </div>
      </section>

      <section className="jaali bg-maroon-deep py-14 text-cream md:py-20">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal><SectionHead hindi="त्योहारों का तोहफ़ा" title="Ready-to-gift dabbas" light>Pick a box, add it in one tap, and we tie it with red thread and a hand-written note.</SectionHead></Reveal>
          <div className="grid gap-5 md:grid-cols-3">
            {hampers.map((h, i) => {
              const total = Object.entries(h.items).reduce((s, [id, n]) => s + bySweetId[id].price * n, 0)
              return (
                <Reveal key={h.id} delay={i * 100}>
                  <div className="flex h-full flex-col rounded-3xl border border-gold/40 bg-maroon p-6">
                    <div className="flex -space-x-3">
                      {Object.keys(h.items).map((id) => <img key={id} src={bySweetId[id].image} alt="" className="size-14 rounded-full border-2 border-gold object-cover" />)}
                    </div>
                    <p className="mt-5 font-hindi text-gold">{h.hindi}</p>
                    <h3 className="font-display text-2xl">{h.name}</h3>
                    <p className="mt-2 flex-1 text-sm text-cream/70">{h.blurb}</p>
                    <div className="mt-5 flex items-center justify-between">
                      <span className="font-display text-2xl text-gold">{money(total)}</span>
                      <button onClick={() => { addMany(h.items); navigate('/dabba') }} className="inline-flex h-11 items-center gap-2 rounded-full bg-gold px-5 text-sm font-bold text-maroon-deep">Add this dabba <Gift size={15} /></button>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-5 px-5 py-14 sm:grid-cols-3 md:py-20">
        {[
          [Flame, 'Fried in pure desi ghee', 'No palm oil. No shortcuts. The kadhai has not changed since 1974.'],
          [Sparkles, 'Made fresh every morning', 'Nothing sits past sunset. If it is on the counter, it was made today.'],
          [Truck, 'Delivered across Bengaluru', `Free above ${money(shop.freeDeliveryAbove)}. Same-day if you order before ${shop.sameDayCutoff}.`],
        ].map(([Icon, title, text], i) => (
          <Reveal key={title} delay={i * 100}>
            <div className="h-full rounded-2xl border border-gold/50 bg-sand/60 p-6">
              <Icon className="text-maroon" size={26} />
              <h3 className="mt-3 font-display text-xl">{title}</h3>
              <p className="mt-1.5 text-sm text-ink/60">{text}</p>
            </div>
          </Reveal>
        ))}
      </section>

      <section className="bg-sand/60 py-14 md:py-20">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal><SectionHead hindi="परिवारों की पसंद" title="Loved by Bengaluru, and beyond" center /></Reveal>
          <div className="grid gap-5 md:grid-cols-3">
            {reviews.map((r, i) => (
              <Reveal key={r.name} delay={i * 100}>
                <figure className="h-full rounded-3xl bg-white p-6 glow">
                  <div className="flex gap-0.5">{[0, 1, 2, 3, 4].map((n) => <Star key={n} size={15} className="fill-gold text-gold" />)}</div>
                  <blockquote className="mt-3 text-[15px] text-ink/75">“{r.text}”</blockquote>
                  <figcaption className="mt-4 text-sm font-bold">{r.name} <span className="font-normal text-ink/50">· {r.place}</span></figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
          {shop.demoMode && <p className="mt-5 text-center text-xs text-ink/40">Sample reviews for the design preview.</p>}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14 md:py-20">
        <div className="grid items-center gap-8 overflow-hidden rounded-[2rem] bg-maroon p-6 text-cream sm:p-10 md:grid-cols-2">
          <div>
            <p className="font-hindi text-lg text-gold">शादी, त्योहार, हर मौका</p>
            <h2 className="mt-1 font-display text-4xl leading-tight">Planning a wedding or a big festival?</h2>
            <p className="mt-3 text-cream/70">Bulk dabbas ready in 48 hours, with custom boxes and your family's name on the thread.</p>
            <Cta variant="gold" className="mt-6" onClick={() => navigate('/gifting')}>Plan bulk orders <ArrowRight size={17} /></Cta>
          </div>
          <img src="/images/dabba.jpg" alt="Golden gift dabba filled with assorted mithai" loading="lazy" width={1024} height={1024} className="aspect-[16/10] w-full rounded-2xl object-cover" />
        </div>
      </section>
    </>
  )
}
