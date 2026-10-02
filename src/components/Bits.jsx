import { useEffect, useRef, useState } from 'react'
import { Plus, Minus, Check } from 'lucide-react'
import { money } from '../utils'
import { useCart } from '../state/CartContext'

export function SectionHead({ hindi, title, children, light = false, center = false }) {
  return (
    <div className={`mb-8 ${center ? 'text-center' : ''}`}>
      <p className={`font-hindi text-lg ${light ? 'text-gold' : 'text-maroon'}`}>{hindi}</p>
      <h2 className="mt-1 font-display text-[clamp(2.1rem,4.5vw,3.4rem)] leading-tight">{title}</h2>
      {children && <p className={`mt-3 max-w-lg text-[15px] ${center ? 'mx-auto' : ''} ${light ? 'text-cream/70' : 'text-ink/60'}`}>{children}</p>}
    </div>
  )
}

// Fades children up when they scroll into view
export function Reveal({ children, className = '', delay = 0 }) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) return setShown(true)
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setShown(true), io.disconnect()), { threshold: 0.12 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={ref} style={{ animationDelay: `${delay}ms` }} className={`${shown ? 'rise' : 'opacity-0'} ${className}`}>
      {children}
    </div>
  )
}

export function Marquee({ words }) {
  return (
    <section aria-label="What we promise" className="overflow-hidden bg-maroon py-3.5">
      <div className="marquee-track flex w-max items-center gap-8">
        {[0, 1].map((copy) => (
          <div key={copy} aria-hidden={copy === 1} className="flex items-center gap-8">
            {words.map((w) => (
              <span key={w} className="whitespace-nowrap text-sm font-bold uppercase tracking-[0.18em] text-gold">
                <span>✦ </span>
                <span className="font-hindi normal-case tracking-normal">{/[ऀ-ॿ]/.test(w) ? w : ''}</span>
                {/[ऀ-ॿ]/.test(w) ? '' : w}
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}

export function Seal({ className = '' }) {
  return (
    <div className={`grid place-items-center rounded-full bg-gold text-center font-hindi leading-tight text-maroon-deep shadow-lg ${className}`}>
      <span className="spin-slow absolute inset-1.5 rounded-full border-2 border-dashed border-maroon-deep/40" aria-hidden />
      <span className="relative text-sm">शुद्ध<br />देसी<br />घी</span>
    </div>
  )
}

export function Qty({ id, name, compact = false }) {
  const { qty, change } = useCart()
  const n = qty[id] ?? 0
  if (!n) {
    return (
      <button onClick={() => change(id, 1)} className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-gold text-sm font-bold text-maroon-deep transition-colors hover:bg-gold-soft active:scale-[0.98]">
        Add to dabba <Plus size={15} />
      </button>
    )
  }
  return (
    <div className="mt-3 flex h-11 items-center justify-between rounded-full bg-maroon px-1.5 text-gold">
      <button aria-label={`Remove one box of ${name}`} onClick={() => change(id, -1)} className="grid size-8 place-items-center rounded-full border border-gold/50"><Minus size={14} /></button>
      <span className="text-sm font-bold">{n} {compact ? '' : n > 1 ? 'boxes' : 'box'} in dabba</span>
      <button aria-label={`Add one box of ${name}`} onClick={() => change(id, 1)} className="grid size-8 place-items-center rounded-full bg-gold text-maroon-deep"><Plus size={14} /></button>
    </div>
  )
}

export function SweetCard({ sweet }) {
  return (
    <article className="glow flex flex-col rounded-3xl bg-white p-3 transition-transform hover:-translate-y-1 sm:p-3.5">
      <div className="relative">
        <img src={sweet.image} alt={`${sweet.name}, ${sweet.note}`} loading="lazy" width={1024} height={1024} className="aspect-square w-full rounded-2xl object-cover" />
        {sweet.tag && <span className="absolute left-2.5 top-2.5 rounded-full bg-maroon-deep/90 px-2.5 py-1 text-[11px] font-bold text-gold">{sweet.tag}</span>}
      </div>
      <div className="flex items-start justify-between gap-2 px-1 pt-3.5">
        <div className="min-w-0">
          <h3 className="font-display text-lg leading-tight sm:text-xl">{sweet.name}</h3>
          <p className="font-hindi text-[13px] text-maroon/80">{sweet.hindi}</p>
        </div>
        <span className="whitespace-nowrap font-display text-base text-maroon sm:text-lg">{money(sweet.price)}</span>
      </div>
      <p className="mt-1.5 flex-1 px-1 text-[13px] text-ink/60 sm:text-sm">{sweet.note}</p>
      <p className="px-1 pt-1 text-[11px] font-semibold uppercase tracking-wider text-ink/40">per 500 g</p>
      <Qty id={sweet.id} name={sweet.name} />
    </article>
  )
}

export function Cta({ children, to, href, variant = 'primary', onClick, className = '', ...rest }) {
  const styles = {
    primary: 'bg-maroon text-gold shadow-[0_16px_40px_-16px] shadow-maroon/50',
    gold: 'bg-gold text-maroon-deep',
    ghost: 'border-2 border-ink/20 text-ink hover:border-maroon hover:text-maroon',
    wa: 'bg-wa text-white',
  }[variant]
  const cls = `inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-7 py-3 text-base font-bold transition-transform hover:-translate-y-0.5 active:scale-[0.98] ${styles} ${className}`
  if (href) return <a href={href} className={cls} {...rest}>{children}</a>
  return <button onClick={onClick} className={cls} {...rest}>{children}</button>
}

export function Done({ title, children, action }) {
  return (
    <div role="status" className="py-6 text-center">
      <span className="mx-auto grid size-14 place-items-center rounded-full bg-gold text-maroon-deep"><Check size={26} /></span>
      <h3 className="mt-4 font-display text-3xl">{title}</h3>
      <div className="mx-auto mt-2 max-w-sm text-cream/70">{children}</div>
      {action}
    </div>
  )
}
