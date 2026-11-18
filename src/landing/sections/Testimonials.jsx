import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Reveal, SplitWords, Stars } from '../ui'
import { ease, unsplash } from '../utils'

export default function Testimonials({ items }) {
  const [active, setActive] = useState(0)
  const [hold, setHold] = useState(false)
  const N = items.length
  const next = () => setActive((a) => (a + 1) % N)

  useEffect(() => {
    if (hold) return undefined
    const id = setInterval(() => setActive((a) => (a + 1) % N), 4500)
    return () => clearInterval(id)
  }, [hold, N])

  return (
    <section className="lp-reviews">
      <div className="lp-reviews-copy">
        <Reveal as="p" className="lp-kicker">
          05 — Reviews
        </Reveal>
        <h2>
          <SplitWords text="Loved on" /> <SplitWords text="every street." className="lp-accent-serif" delay={0.15} />
        </h2>
        <p className="lp-muted">Swipe the card away, or let it shuffle on its own.</p>
        <div className="lp-review-dots">
          {items.map((t, i) => (
            <button
              key={t.name}
              type="button"
              aria-label={`Review by ${t.name}`}
              className={i === active ? 'is-on' : ''}
              onClick={() => setActive(i)}
            />
          ))}
        </div>
      </div>

      <div className="lp-stack" onPointerEnter={() => setHold(true)} onPointerLeave={() => setHold(false)}>
        {items.map((t, i) => {
          const k = (i - active + N) % N
          const top = k === 0
          return (
            <motion.figure
              key={t.name}
              className="lp-review"
              animate={{
                y: k * 22,
                z: -k * 80,
                rotateX: k * 4,
                rotateZ: k === 0 ? 0 : (k % 2 ? 1 : -1) * k * 2.5,
                scale: 1 - k * 0.05,
                opacity: k > 2 ? 0 : 1,
              }}
              transition={{ duration: 0.7, ease }}
              style={{ zIndex: N - k, transformPerspective: 1200 }}
              drag={top ? 'x' : false}
              dragSnapToOrigin
              dragElastic={0.6}
              onDragEnd={(_, info) => {
                if (Math.abs(info.offset.x) > 90) next()
              }}
              whileDrag={{ rotateZ: 6, scale: 1.02, cursor: 'grabbing' }}
            >
              <Stars value={t.rating} />
              <blockquote>“{t.text}”</blockquote>
              <figcaption>
                <img src={unsplash(t.avatar, 96, 96)} alt="" />
                <span>
                  <b>{t.name}</b>
                  <em>{t.role}</em>
                </span>
              </figcaption>
            </motion.figure>
          )
        })}
      </div>
    </section>
  )
}
