import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import RingCarousel from '../components/RingCarousel'
import Marquee from '../components/Marquee'
import ProductCard from '../components/ProductCard'
import { money, pad, products } from '../data/products'
import { useCart } from '../context/cart-context'

export default function Home() {
  const [active, setActive] = useState(0)
  const [held, setHeld] = useState(false)
  const [combo, setCombo] = useState(0)
  const [pop, setPop] = useState(null)
  const streak = useRef({ n: 0, at: 0, id: null })
  const api = useRef(null)
  const word = useRef(null)
  const { add } = useCart()
  const product = products[active]
  const onActive = useCallback((index) => setActive(index), [])
  const onHold = useCallback((value) => setHeld(value), [])
  const onLock = useCallback((index) => {
    const now = Date.now()
    const id = products[index]?.id
    if (!id || id === streak.current.id) return
    streak.current.n = now - streak.current.at < 5000 ? streak.current.n + 1 : 1
    streak.current.at = now
    streak.current.id = id
    setCombo(streak.current.n)
    setPop({ id: now, text: streak.current.n > 1 ? `COMBO x${streak.current.n}` : 'LOCK ON' })
  }, [])

  useEffect(() => {
    const el = word.current
    if (!el) return undefined
    const onMove = (event) => {
      const x = (event.clientX / window.innerWidth - 0.5) * -36
      const y = (event.clientY / window.innerHeight - 0.5) * -22
      el.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  return (
    <>
      <section className="hero">
        <p className="glide">Spin to select</p>
        <div className="hero-word" ref={word} aria-hidden="true">
          ORBIT
        </div>
        <ol className="orbit-index">
          {products.map((item, index) => (
            <li key={item.id}>
              <button
                type="button"
                className={index === active ? 'is-on' : ''}
                onClick={() => api.current?.focus(index)}
                data-cursor="orbit"
              >
                <span>{pad(index + 1)}</span>
                {item.name}
              </button>
            </li>
          ))}
        </ol>
        <div className="hud-chip">
          <span>Combo</span>
          <b>{pad(combo)}</b>
        </div>
        <div className="hero-stage">
          <div className="lock-frame" aria-hidden="true">
            <i /><i /><i /><i />
          </div>
          <RingCarousel
            products={products}
            active={active}
            onActive={onActive}
            onHold={onHold}
            onLock={onLock}
            apiRef={api}
          />
          {pop && <Burst key={pop.id} text={pop.text} />}
        </div>
        <div className="pick-row" aria-label="Select an object">
          {products.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className={index === active ? 'is-on' : ''}
              onClick={() => api.current?.focus(index)}
            >
              <img src={item.images[0]} alt="" />
              <span>{item.name}</span>
            </button>
          ))}
        </div>
        <div className="hero-bottom">
          <div className="hero-copy">
            <p className="kicker">
              {product.category} · {product.edition}
            </p>
            <h1>{product.name}</h1>
            <p className="hero-blurb">{product.blurb}</p>
          </div>
          <div className="hero-buy">
            <strong>{money(product.price)}</strong>
            <div className="hero-actions">
              <Link className="btn btn-acid" to={`/product/${product.id}`} data-cursor="open">
                Select
              </Link>
              <button
                type="button"
                className="btn btn-ghost"
                data-cursor="add"
                onClick={() => {
                  add(product, product.sizes[0])
                  setPop({ id: Date.now(), text: `LOOT +${product.price}` })
                }}
              >
                Add to bag
              </button>
              <button type="button" className="btn btn-ghost" data-cursor="boost" onClick={() => api.current?.boost()}>
                Boost
              </button>
              {held && (
                <button type="button" className="btn btn-ghost" onClick={() => api.current?.spin()}>
                  Spin
                </button>
              )}
            </div>
            <p className="hint hint-desktop">{held ? 'Locked · Space boosts' : 'Drag to spin · click to lock · Space boosts'}</p>
            <p className="hint hint-mobile">{held ? 'Locked · tap Boost to spin' : 'Swipe, tap to lock, Boost to flare'}</p>
          </div>
        </div>
      </section>

      <Marquee />
      <Marquee reverse />

      <section className="section wrap">
        <div className="section-head">
          <p className="kicker">Selected matter</p>
          <h2>Four from the ring.</h2>
        </div>
        <div className="matter-grid">
          {products.slice(0, 4).map((item, index) => (
            <ProductCard key={item.id} product={item} large={index === 0} />
          ))}
        </div>
      </section>

      <section className="statement wrap">
        <p className="kicker">How it moves</p>
        <h2>
          <span>Move the cursor.</span>
          <span>The house turns.</span>
        </h2>
        <div className="stats">
          <div>
            <b>08</b>
            <span>Objects</span>
          </div>
          <div>
            <b>360°</b>
            <span>One orbit</span>
          </div>
          <div>
            <b>01</b>
            <span>In focus</span>
          </div>
        </div>
      </section>

      <section className="section wrap">
        <div className="section-head">
          <p className="kicker">Rooms</p>
          <h2>Enter by material.</h2>
        </div>
        <div className="cats">
          {products.map((item, index) => (
            <Link
              key={item.id}
              to={`/shop?category=${encodeURIComponent(item.category)}`}
              className="cat-row"
              data-cursor="enter"
            >
              <span>{pad(index + 1)}</span>
              <strong>{item.category}</strong>
              <em>{item.name}</em>
              <img src={item.images[0]} alt="" />
            </Link>
          ))}
        </div>
      </section>

      <Link to="/shop" className="enter" data-cursor="enter">
        <span>Enter the floor</span>
        <small>Shop all eight objects</small>
      </Link>
    </>
  )
}

function Burst({ text }) {
  return (
    <div className="burst" aria-hidden="true">
      {Array.from({ length: 12 }, (_, index) => (
        <i key={index} style={{ '--a': index }} />
      ))}
      <strong>{text}</strong>
    </div>
  )
}
