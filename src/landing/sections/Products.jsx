import { useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion'
import { useCart } from '../../context/cart-context'
import { Icon, Reveal, SplitWords, Stars } from '../ui'
import { ease, money, unsplash } from '../utils'

function ProductCard({ p, index }) {
  const { add } = useCart()
  const card = useRef(null)
  const rx = useSpring(0, { stiffness: 180, damping: 16 })
  const ry = useSpring(0, { stiffness: 180, damping: 16 })
  const gx = useMotionValue(50)
  const gy = useMotionValue(50)
  const glare = useMotionTemplate`radial-gradient(420px circle at ${gx}% ${gy}%, rgba(255,255,255,.35), transparent 45%)`
  const [size, setSize] = useState(p.sizes[1] ?? p.sizes[0])
  const [color, setColor] = useState(0)
  const [added, setAdded] = useState(false)
  const [liked, setLiked] = useState(false)
  const images = useMemo(() => p.images.map((id) => unsplash(id, 700, 900)), [p.images])

  const onMove = (e) => {
    if (e.pointerType !== 'mouse') return
    const r = card.current.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width
    const y = (e.clientY - r.top) / r.height
    ry.set((x - 0.5) * 18)
    rx.set(-(y - 0.5) * 14)
    gx.set(x * 100)
    gy.set(y * 100)
  }
  const onLeave = () => {
    rx.set(0)
    ry.set(0)
  }

  const onAdd = () => {
    add({ id: p.id, name: p.name, price: p.price, images }, size)
    setAdded(true)
    setTimeout(() => setAdded(false), 1600)
  }

  return (
    <motion.article
      layout
      className="pc"
      initial={{ opacity: 0, y: 60, rotateX: -20 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      exit={{ opacity: 0, scale: 0.85, rotateY: 30 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.8, delay: (index % 4) * 0.08, ease }}
      style={{ transformPerspective: 1200 }}
    >
      <motion.div
        ref={card}
        className="pc-card"
        style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
      >
        <div className="pc-media">
          <img src={images[0]} alt={p.name} loading="lazy" className="pc-img pc-img-a" />
          <img src={images[1]} alt="" loading="lazy" className="pc-img pc-img-b" />
          <motion.div className="pc-glare" style={{ background: glare }} />
        </div>
        <span className={`pc-tag pc-tag-${p.tag.toLowerCase()}`}>{p.tag}</span>
        <motion.button
          type="button"
          className={`pc-like ${liked ? 'is-on' : ''}`}
          aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={liked}
          onClick={() => setLiked((l) => !l)}
          whileTap={{ scale: 0.7 }}
        >
          <motion.span
            key={String(liked)}
            initial={{ scale: liked ? 0.2 : 1 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 600, damping: 12 }}
          >
            <Icon name="heart" size={18} filled={liked} />
          </motion.span>
        </motion.button>

        <div className="pc-quick">
          <div className="pc-sizes" role="radiogroup" aria-label="Size">
            {p.sizes.map((s) => (
              <button
                key={s}
                type="button"
                role="radio"
                aria-checked={s === size}
                className={s === size ? 'is-on' : ''}
                onClick={() => setSize(s)}
              >
                {s}
              </button>
            ))}
          </div>
          <button type="button" className={`pc-add ${added ? 'is-added' : ''}`} onClick={onAdd}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={added ? 'ok' : 'add'}
                initial={{ y: 18, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -18, opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                {added ? (
                  <>
                    <Icon name="check" size={16} /> Added
                  </>
                ) : (
                  <>
                    <Icon name="plus" size={16} /> Add to cart
                  </>
                )}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </motion.div>

      <div className="pc-info">
        <div className="pc-row">
          <h3>{p.name}</h3>
          <p className="pc-price">
            {p.oldPrice && <s>{money(p.oldPrice)}</s>}
            <b>{money(p.price)}</b>
          </p>
        </div>
        <div className="pc-row">
          <div className="pc-colors">
            {p.colors.map((c, i) => (
              <button
                key={c}
                type="button"
                aria-label={`Color ${i + 1}`}
                className={i === color ? 'is-on' : ''}
                style={{ '--c': c }}
                onClick={() => setColor(i)}
              />
            ))}
          </div>
          <span className="pc-rating">
            <Stars value={p.rating} /> {p.rating} <em>({p.reviews})</em>
          </span>
        </div>
      </div>
    </motion.article>
  )
}

export default function Products({ products, categories }) {
  const [cat, setCat] = useState('All')
  const list = useMemo(() => (cat === 'All' ? products : products.filter((p) => p.category === cat)), [cat, products])

  return (
    <section className="lp-products" id="shop">
      <header className="lp-section-head lp-products-head">
        <div>
          <Reveal as="p" className="lp-kicker">
            02 — New arrivals
          </Reveal>
          <h2>
            <SplitWords text="Pieces you'll" /> <SplitWords text="live in." className="lp-accent-serif" delay={0.15} />
          </h2>
        </div>
        <div className="lp-filter" role="tablist" aria-label="Filter by category">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              role="tab"
              aria-selected={c === cat}
              className={c === cat ? 'is-on' : ''}
              onClick={() => setCat(c)}
            >
              {c === cat && (
                <motion.span
                  layoutId="filter-pill"
                  className="lp-filter-pill"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className="lp-filter-label">{c}</span>
            </button>
          ))}
        </div>
      </header>

      <motion.div layout className="lp-grid">
        <AnimatePresence mode="popLayout">
          {list.map((p, i) => (
            <ProductCard key={p.id} p={p} index={i} />
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  )
}
