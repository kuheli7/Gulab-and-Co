import { useMemo, useState } from 'react'
import { ChevronDown, Search } from 'lucide-react'
import { categories, sweets } from '../data/sweets'
import { Reveal, SectionHead, SweetCard } from '../components/Bits'

export default function Sweets() {
  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('popular')

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = sweets.filter((s) => (category === 'All' || s.category === category) && (!q || `${s.name} ${s.hindi} ${s.ingredients}`.toLowerCase().includes(q)))
    if (sort === 'low') list = [...list].sort((a, b) => a.price - b.price)
    if (sort === 'high') list = [...list].sort((a, b) => b.price - a.price)
    return list
  }, [category, query, sort])

  return (
    <section className="mx-auto max-w-6xl px-5 py-10 md:py-16">
      <SectionHead hindi="आज का काउंटर" title="From the counter">Made in small batches every morning. Prices per 500 g. Add what you like, then build your dabba.</SectionHead>

      <div className="sticky top-[60px] z-20 -mx-5 mb-6 border-b border-gold/30 bg-cream/95 px-5 py-3 backdrop-blur md:static md:mx-0 md:border-0 md:bg-transparent md:p-0">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div role="group" aria-label="Mithai categories" className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 md:mx-0 md:flex-wrap md:overflow-visible md:px-0 md:pb-0">
            {['All', ...categories].map((c) => (
              <button key={c} aria-pressed={category === c} onClick={() => setCategory(c)} className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-bold transition-colors ${category === c ? 'bg-maroon text-gold' : 'border border-ink/20 bg-white/50 text-ink/70 hover:border-maroon hover:text-maroon'}`}>{c}</button>
            ))}
          </div>
          <div className="flex gap-2">
            <label className="relative flex-1 md:w-56 md:flex-none">
              <span className="sr-only">Search sweets</span>
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search sweets" className="h-11 w-full rounded-full border border-ink/20 bg-white pl-10 pr-4 text-sm outline-none focus:border-maroon" />
            </label>
            <label className="relative">
              <span className="sr-only">Sort by</span>
              <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink/60" aria-hidden />
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="h-11 appearance-none rounded-full border border-ink/20 bg-white pl-4 pr-10 text-sm font-semibold outline-none focus:border-maroon">
                <option value="popular">Popular</option>
                <option value="low">Price: low to high</option>
                <option value="high">Price: high to low</option>
              </select>
            </label>
          </div>
        </div>
      </div>

      {visible.length ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {visible.map((s, i) => <Reveal key={s.id} delay={(i % 4) * 60}><SweetCard sweet={s} /></Reveal>)}
        </div>
      ) : (
        <p className="rounded-2xl border border-dashed border-ink/20 p-10 text-center text-ink/60">No mithai matches “{query}”. Try “kaju” or “laddoo”.</p>
      )}
    </section>
  )
}
