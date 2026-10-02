import { useEffect, useRef, useState } from 'react'
import { Home, Candy, Gift, ShoppingBag, Phone, MapPin, Clock, MessageCircle, Menu, X } from 'lucide-react'
import { shop } from '../config/shop'
import { navigate } from '../lib/router'
import { chatUrl } from '../lib/orders'
import { isOpenNow } from '../utils'
import { useCart } from '../state/CartContext'

export const links = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/sweets', label: 'Sweets', icon: Candy },
  { to: '/gifting', label: 'Gifting', icon: Gift },
  { to: '/story', label: 'Our story' },
  { to: '/contact', label: 'Contact', icon: Phone },
]

// Client-side link that keeps normal anchor behaviour (right click, open in new tab, etc.)
export function Link({ to, children, className, onClick, ...rest }) {
  return (
    <a
      href={to}
      className={className}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
        e.preventDefault()
        navigate(to)
        onClick?.()
      }}
      {...rest}
    >
      {children}
    </a>
  )
}

export function Logo({ light = false }) {
  return (
    <Link to="/" className="flex items-baseline gap-2 whitespace-nowrap" aria-label={`${shop.name} home`}>
      <span className={`font-display text-2xl tracking-tight sm:text-3xl ${light ? 'text-gold' : ''}`}>{shop.name}</span>
      <span className={`font-hindi text-sm ${light ? 'text-cream/60' : 'text-maroon'}`}>{shop.nameHindi}</span>
    </Link>
  )
}

export function Header({ path }) {
  const { count } = useCart()
  const [open, setOpen] = useState(false)
  const headerRef = useRef(null)
  useEffect(() => setOpen(false), [path])

  // Close the mobile menu when the visitor scrolls, or taps/clicks anywhere outside the header
  useEffect(() => {
    if (!open) return
    const close = () => setOpen(false)
    const outside = (e) => !headerRef.current?.contains(e.target) && close()
    // Phones fire tiny scroll events when the menu opens (header grows, address bar moves),
    // so only a deliberate scroll of 60px+ closes the menu.
    const startY = window.scrollY
    const onScroll = () => Math.abs(window.scrollY - startY) > 60 && close()
    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('pointerdown', outside)
    return () => {
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('pointerdown', outside)
    }
  }, [open])

  return (
    <>
      <div className="bg-maroon-deep px-4 py-2 text-center text-[12px] font-semibold tracking-wide text-gold sm:text-[13px]">{shop.announcement}</div>
      <header ref={headerRef} className="sticky top-0 z-40 border-b border-gold/40 bg-cream/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-3">
          <Logo />
          <nav aria-label="Main navigation" className="hidden items-center gap-8 text-[15px] font-bold md:flex">
            {links.map((l) => (
              <Link key={l.to} to={l.to} className={`transition-colors hover:text-maroon ${path === l.to ? 'text-maroon underline decoration-gold decoration-2 underline-offset-8' : ''}`}>
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/dabba" aria-label={`Your dabba, ${count} boxes`} className="flex h-10 items-center gap-2 rounded-full bg-maroon px-4 text-sm font-bold text-gold transition-transform hover:-translate-y-0.5">
              <ShoppingBag size={16} /> <span className="hidden sm:inline">Dabba</span>
              <span key={count} className="pop grid size-5 place-items-center rounded-full bg-gold text-xs font-bold text-maroon-deep">{count}</span>
            </Link>
            <button className="grid size-10 place-items-center rounded-full border border-ink/20 md:hidden" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)}>
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
        {open && (
          <nav aria-label="Mobile menu" className="rise border-t border-gold/30 bg-cream px-5 pb-4 md:hidden">
            {[...links, { to: '/dabba', label: 'Your dabba' }].map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="block border-b border-ink/10 py-3.5 font-bold last:border-0">{l.label}</Link>
            ))}
          </nav>
        )}
      </header>
    </>
  )
}

// Mobile-first: thumb-reachable bottom tab bar, hidden on desktop.
export function BottomBar({ path }) {
  const { count } = useCart()
  const tabs = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/sweets', label: 'Sweets', icon: Candy },
    { to: '/gifting', label: 'Gifting', icon: Gift },
    { to: '/dabba', label: 'Dabba', icon: ShoppingBag, badge: count },
    { to: '/contact', label: 'Contact', icon: Phone },
  ]
  return (
    <nav aria-label="Quick navigation" className="fixed inset-x-0 bottom-0 z-40 border-t border-gold/40 bg-maroon-deep pb-[env(safe-area-inset-bottom)] md:hidden">
      <ul className="mx-auto grid max-w-md grid-cols-5">
        {tabs.map(({ to, label, icon: Icon, badge }) => {
          const active = path === to
          return (
            <li key={to}>
              <Link to={to} aria-current={active ? 'page' : undefined} className={`relative flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-bold ${active ? 'text-gold' : 'text-cream/60'}`}>
                <span className="relative">
                  <Icon size={20} />
                  {badge ? <span className="absolute -right-2.5 -top-2 grid size-4 place-items-center rounded-full bg-gold text-[10px] font-extrabold text-maroon-deep">{badge}</span> : null}
                </span>
                {label}
                {active && <span className="absolute top-0 h-0.5 w-8 rounded-full bg-gold" />}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export function WhatsAppFab() {
  return (
    <a href={chatUrl('Namaste! I have a question about your mithai.')} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp" className="fixed bottom-[5.5rem] right-4 z-30 grid size-13 place-items-center rounded-full border-2 border-gold bg-maroon text-gold shadow-lg shadow-maroon-deep/30 transition-transform hover:scale-105 md:bottom-6 md:right-6 md:size-14">
      <MessageCircle size={24} />
    </a>
  )
}

export function Footer() {
  const open = isOpenNow()
  return (
    <footer className="jaali relative bg-maroon-deep text-cream">
      <div className="toran absolute inset-x-0 -top-px rotate-180" aria-hidden />
      <div className="mx-auto grid max-w-6xl gap-10 px-5 pb-10 pt-16 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <Logo light />
          <p className="mt-3 font-hindi text-sm text-cream/60">शुद्ध देसी घी, रोज़ ताज़ा</p>
          <p className="mt-3 text-sm text-cream/60">Handmade mithai from Basavanagudi, Bengaluru since {shop.since}.</p>
        </div>
        <div className="text-sm text-cream/70">
          <p className="font-bold text-gold">Explore</p>
          <ul className="mt-3 space-y-2">
            {[...links, { to: '/dabba', label: 'Your dabba' }].map((l) => (
              <li key={l.to}><Link to={l.to} className="hover:text-gold">{l.label}</Link></li>
            ))}
          </ul>
        </div>
        <div className="text-sm text-cream/70">
          <p className="font-bold text-gold">Visit the counter</p>
          <p className="mt-3 flex gap-2"><MapPin size={16} className="mt-0.5 shrink-0" />{shop.address}</p>
          <p className="mt-2 flex gap-2"><Clock size={16} className="mt-0.5 shrink-0" />{shop.hours[0].time}, every day</p>
          <p className="mt-2 flex items-center gap-2"><span className={`size-2 rounded-full ${open ? 'bg-pista' : 'bg-rose'}`} />{open ? 'Open now' : 'Closed right now'}</p>
        </div>
        <div className="text-sm text-cream/70">
          <p className="font-bold text-gold">Talk to us</p>
          <p className="mt-3">{shop.phone}</p>
          <p className="mt-2">{shop.email}</p>
          <a href={chatUrl()} target="_blank" rel="noreferrer" className="mt-4 inline-flex h-10 items-center gap-2 rounded-full bg-gold px-5 font-bold text-maroon-deep"><MessageCircle size={16} /> WhatsApp us</a>
        </div>
      </div>
      {/* extra bottom padding on phones so the maroon runs behind the fixed tab bar (no cream gap) */}
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 border-t border-cream/15 px-5 pb-[calc(5.5rem+env(safe-area-inset-bottom))] pt-5 text-xs text-cream/50 md:pb-5">
        <p>© {new Date().getFullYear()} {shop.name}</p>
        {shop.demoMode && <p className="pr-16 md:pr-0">Fictional brand · design preview · no real orders or payments</p>}
      </div>
    </footer>
  )
}
