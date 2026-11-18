import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import Tilt from '../components/Tilt'
import { getProduct, money, products } from '../data/products'
import { useCart } from '../context/cart-context'

export default function Product() {
  const { id } = useParams()
  const product = getProduct(id)
  const { add } = useCart()
  const [choice, setChoice] = useState(null)
  const [addedId, setAddedId] = useState(null)
  const selected =
    product && choice?.id === product.id ? choice.size : (product?.sizes[0] ?? 'OS')
  const added = addedId === product?.id

  useEffect(() => {
    if (!product) return undefined
    document.title = `${product.name} — AETHER`
    return () => {
      document.title = 'AETHER — Objects in Orbit'
    }
  }, [product])

  if (!product) {
    return (
      <>
        <header className="page-head wrap">
          <p className="kicker">Missing</p>
          <h1>That object left orbit.</h1>
          <Link className="btn btn-acid" to="/shop">
            Back to shop
          </Link>
        </header>
      </>
    )
  }

  const related = products.filter((item) => item.id !== product.id).slice(0, 3)

  return (
    <>
      <article className="pdp wrap">
        <div className="pdp-visual">
          {product.images.map((src) => (
            <Tilt key={src} max={8}>
              <img src={src} alt={product.name} />
            </Tilt>
          ))}
        </div>
        <div className="pdp-info">
          <p className="kicker">
            {product.category} · {product.tag}
          </p>
          <h1>{product.name}</h1>
          <p className="pdp-price">{money(product.price)}</p>
          <p className="lede">{product.blurb}</p>
          <div className="meters">
            {[
              ['Rarity', 42 + (product.price % 48)],
              ['Mass', 28 + ((product.name.length * 9) % 55)],
              ['Signal', 36 + (product.edition.length * 7) % 50],
            ].map(([label, value]) => (
              <div key={label}>
                <span>{label}</span>
                <i><b style={{ '--fill': `${value}%` }} /></i>
                <em>{value}</em>
              </div>
            ))}
          </div>
          <dl className="specs">
            <div>
              <dt>Edition</dt>
              <dd>{product.edition}</dd>
            </div>
            <div>
              <dt>Material</dt>
              <dd>{product.materials}</dd>
            </div>
          </dl>
          <p className="kicker">Size</p>
          <div className="sizes">
            {product.sizes.map((option) => (
              <button
                key={option}
                type="button"
                className={option === selected ? 'is-on' : ''}
                onClick={() => setChoice({ id: product.id, size: option })}
              >
                {option}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="btn btn-acid btn-block"
            data-cursor="add"
            onClick={() => {
              add(product, selected)
              setAddedId(product.id)
              window.setTimeout(() => {
                setAddedId((current) => (current === product.id ? null : current))
              }, 1400)
            }}
          >
            {added ? 'Added to bag' : 'Add to bag'}
          </button>
          <Link to="/shop" className="text-link">
            All objects
          </Link>
        </div>
      </article>
      <section className="section wrap">
        <div className="section-head">
          <p className="kicker">Also turning</p>
          <h2>Stay in the ring.</h2>
        </div>
        <div className="related">
          {related.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>
    </>
  )
}
