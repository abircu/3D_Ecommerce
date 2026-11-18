import data from '../data/clothing.json'
import Nav from './sections/Nav'
import Hero from './sections/Hero'
import Collections from './sections/Collections'
import Products from './sections/Products'
import Lookbook from './sections/Lookbook'
import Story from './sections/Story'
import Testimonials from './sections/Testimonials'
import { Footer, Newsletter } from './sections/Closing'
import './landing.css'

function Bands() {
  const words = ['New drop', 'Organic cotton', 'Free shipping', 'Made to move', 'Winter 26', 'Small batch']
  const row = [...words, ...words]
  return (
    <div className="lp-bands" aria-hidden="true">
      <div className="lp-band lp-band-a">
        <div className="lp-band-track">
          {row.map((w, i) => (
            <span key={i}>
              {w} <i>✦</i>
            </span>
          ))}
        </div>
      </div>
      <div className="lp-band lp-band-b">
        <div className="lp-band-track lp-reverse">
          {row.map((w, i) => (
            <span key={i}>
              {w} <i>✦</i>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Landing() {
  return (
    <div className="lp">
      <Nav brand={data.brand} />
      <main>
        <Hero hero={data.hero} avatars={data.testimonials.map((t) => t.avatar)} />
        <Bands />
        <Collections collections={data.collections} />
        <Products products={data.products} categories={data.categories} />
        <Lookbook looks={data.lookbook} />
        <Story stats={data.stats} features={data.features} />
        <Testimonials items={data.testimonials} />
        <Newsletter />
      </main>
      <Footer brand={data.brand} />
    </div>
  )
}
