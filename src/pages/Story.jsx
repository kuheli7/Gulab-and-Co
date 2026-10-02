import { Reveal, SectionHead, Cta, Seal } from '../components/Bits'
import { navigate } from '../lib/router'
import { shop } from '../config/shop'

const timeline = [
  ['1974', 'The first counter', 'Shri Ram Nath sets up a six-foot counter in Gandhi Bazaar with one kadhai and a recipe from his mother.'],
  ['1989', 'The motichoor craze', 'A Diwali rush sells out the shop by noon. The queue still becomes a family tradition.'],
  ['2004', 'Third generation', 'The grandchildren join, learning the milk, the ghee and the patience first.'],
  ['2024', 'Fifty years', 'Three shops across Bengaluru, one unchanged recipe book. Still stirred by hand.'],
]

export default function Story() {
  return (
    <>
      <section className="mx-auto grid max-w-6xl gap-x-10 gap-y-6 px-5 py-10 md:grid-cols-12 md:items-center md:py-20">
        <div className="md:col-span-7 md:col-start-6 md:row-start-1 md:self-end md:pl-6">
          <p className="font-hindi text-lg text-maroon">चार पीढ़ियों की मिठास</p>
          <h1 className="mt-1 font-display text-[clamp(2.2rem,5vw,3.5rem)] leading-tight">Four generations, one copper kadhai</h1>
        </div>
        <div className="relative md:col-span-5 md:col-start-1 md:row-span-2 md:row-start-1">
          <img src="/images/rabri.jpg" alt="Malai rabri being layered with pistachio" width={1024} height={1024} className="glow aspect-[5/4] w-full rounded-t-[10rem] rounded-b-3xl border-2 border-gold object-cover p-2 md:aspect-[4/5]" />
          <Seal className="absolute right-2 bottom-8 size-24 rotate-6 sm:-right-5" />
        </div>
        <div className="md:col-span-7 md:col-start-6 md:row-start-2 md:self-start md:pl-6">
          <p className="max-w-xl text-ink/70">In {shop.since}, Shri Ram Nath set up a six-foot counter in Gandhi Bazaar with one kadhai and a recipe from his mother. Fifty years later, his grandchildren still stir every batch by hand. The milk simmers for hours, the ghee is desi, and nothing sits past sunset.</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[[String(shop.since), 'The first counter'], ['120+', 'Sweets & savouries'], ['3', 'Shops in Bengaluru']].map(([n, l]) => (
              <div key={l} className="rounded-2xl border border-gold/50 bg-sand/60 p-5"><p className="font-display text-3xl text-maroon">{n}</p><p className="mt-1 text-sm font-semibold text-ink/60">{l}</p></div>
            ))}
          </div>
          {shop.demoMode && <p className="mt-4 text-xs text-ink/40">Story is fictional placeholder copy for the design preview.</p>}
        </div>
      </section>

      <section className="jaali bg-maroon-deep py-14 text-cream md:py-20">
        <div className="mx-auto max-w-3xl px-5">
          <SectionHead hindi="हमारा सफ़र" title="Fifty years, in a few lines" light center />
          <ol className="relative space-y-8 border-l-2 border-gold/40 pl-7">
            {timeline.map(([year, title, text], i) => (
              <Reveal key={year} delay={i * 80}>
                <li className="relative">
                  <span className="absolute -left-[2.2rem] top-1 size-4 rounded-full border-2 border-gold bg-maroon-deep" />
                  <p className="font-display text-3xl text-gold">{year}</p>
                  <h3 className="font-bold">{title}</h3>
                  <p className="mt-1 text-sm text-cream/65">{text}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14 md:py-20">
        <SectionHead hindi="हमारे वादे" title="What we never compromise on" center />
        <div className="grid gap-5 sm:grid-cols-3">
          {[['शुद्ध देसी घी', 'Pure desi ghee', 'Every sweet is made and fried in it. No palm oil, ever.'], ['रोज़ ताज़ा', 'Made fresh daily', 'Small batches each morning, and nothing sits past sunset.'], ['हाथ से बना', 'Made by hand', 'Stirred, shaped and silver-leafed by our halwais.']].map(([h, t, d], i) => (
            <Reveal key={t} delay={i * 100}>
              <div className="h-full rounded-3xl border border-gold/50 bg-white p-6 text-center glow">
                <p className="font-hindi text-2xl text-maroon">{h}</p>
                <h3 className="mt-2 font-display text-xl">{t}</h3>
                <p className="mt-1.5 text-sm text-ink/60">{d}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-10 text-center"><Cta onClick={() => navigate('/sweets')}>Taste the difference</Cta></div>
      </section>
    </>
  )
}
