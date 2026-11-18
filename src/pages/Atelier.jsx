import { Link } from 'react-router-dom'
import { atelierImage } from '../data/products'

const PILLARS = [
  {
    n: '01',
    title: 'Material',
    copy: 'Metal, hide, glass, waxed cloth. Each object is chosen because it has a weight in the hand.',
  },
  {
    n: '02',
    title: 'Measure',
    copy: 'Small runs. Numbered where it matters. Nothing in the orbit is a placeholder colorway.',
  },
  {
    n: '03',
    title: 'Motion',
    copy: 'The homepage is the showroom. Glide, and the ring brings the next object to the front.',
  },
]

export default function Atelier() {
  return (
    <>
      <header className="page-head wrap atelier-hero">
        <p className="kicker">The house</p>
        <h1>Objects, held in orbit.</h1>
        <p className="lede">
          AETHER is a fictional house. Eight pieces, one ring, no warehouse behind the curtain. The
          site is the object: a storefront you move with the cursor.
        </p>
      </header>

      <div className="pillars wrap">
        {PILLARS.map((item) => (
          <article key={item.n} className="pillar">
            <span>{item.n}</span>
            <h2>{item.title}</h2>
            <p>{item.copy}</p>
          </article>
        ))}
      </div>

      <figure className="atelier-figure">
        <img src={atelierImage} alt="A quiet retail floor used as the house portrait" />
        <figcaption>The floor is a set. The inventory is the orbit.</figcaption>
      </figure>

      <section className="section wrap atelier-close">
        <h2>Take something out of the ring.</h2>
        <Link to="/shop" className="btn btn-acid" data-cursor="enter">
          Open the shop
        </Link>
      </section>
    </>
  )
}
