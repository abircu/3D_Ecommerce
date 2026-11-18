import { useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useScroll } from 'framer-motion'
import LazyCanvas from '../three/LazyCanvas'
import LookbookRing from '../three/LookbookRing'
import { SplitWords } from '../ui'
import { ease, unsplash } from '../utils'

export default function Lookbook({ looks }) {
  const section = useRef(null)
  const focus = useRef(null)
  const [front, setFront] = useState(0)
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] })
  const images = useMemo(() => looks.map((l) => unsplash(l.image, 620, 860)), [looks])

  return (
    <section className="lp-lookbook" id="lookbook" ref={section}>
      <div className="lp-lookbook-sticky">
        <header className="lp-lookbook-head">
          <p className="lp-kicker">03 — Lookbook</p>
          <h2>
            <SplitWords text="Winter in" /> <SplitWords text="the round." className="lp-accent-serif" delay={0.15} />
          </h2>
          <p className="lp-muted">Scroll, drag or tap a look to bring it forward.</p>
        </header>

        <LazyCanvas className="lp-ring-canvas" camera={{ position: [0, 0.5, 9.5], fov: 32 }}>
          <fog attach="fog" args={['#0c0c0e', 6.5, 13.5]} />
          <LookbookRing images={images} progress={scrollYProgress} onFront={setFront} focusRef={focus} />
        </LazyCanvas>

        <div className="lp-lookbook-foot">
          <AnimatePresence mode="wait">
            <motion.p
              key={front}
              className="lp-look-label"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.35, ease }}
            >
              {looks[front].label}
            </motion.p>
          </AnimatePresence>
          <div className="lp-look-dots">
            {looks.map((l, i) => (
              <button
                key={l.label}
                type="button"
                aria-label={`Show ${l.label}`}
                className={i === front ? 'is-on' : ''}
                onClick={() => focus.current?.(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
