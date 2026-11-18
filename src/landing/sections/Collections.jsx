import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import LazyCanvas from '../three/LazyCanvas'
import ClothScene from '../three/ClothScene'
import { Icon, Reveal, SplitWords } from '../ui'
import { ease, unsplash } from '../utils'

export default function Collections({ collections }) {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const images = useMemo(() => collections.map((c) => unsplash(c.image, 1600, 1000)), [collections])
  const current = collections[active]

  useEffect(() => {
    if (paused) return undefined
    const id = setInterval(() => setActive((a) => (a + 1) % collections.length), 5200)
    return () => clearInterval(id)
  }, [paused, collections.length])

  return (
    <section className="lp-collections" id="collections">
      <header className="lp-section-head">
        <Reveal as="p" className="lp-kicker">
          01 — Collections
        </Reveal>
        <h2>
          <SplitWords text="Fabric that" /> <SplitWords text="catches the wind." className="lp-accent-serif" delay={0.2} />
        </h2>
      </header>

      <div
        className="lp-cloth"
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
      >
        <LazyCanvas className="lp-cloth-canvas" camera={{ position: [0, 0, 5], fov: 40 }}>
          <ClothScene images={images} active={active} />
        </LazyCanvas>

        <div className="lp-cloth-overlay">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              className="lp-cloth-caption"
              initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
              transition={{ duration: 0.7, ease }}
            >
              <span>{String(active + 1).padStart(2, '0')} / {String(collections.length).padStart(2, '0')}</span>
              <h3>{current.title}</h3>
              <p>{current.subtitle}</p>
              <a href="#shop" className="lp-btn lp-btn-light">
                Shop {current.count} pieces <Icon name="arrow" size={18} />
              </a>
            </motion.div>
          </AnimatePresence>

          <div className="lp-cloth-tabs" role="tablist">
            {collections.map((c, i) => (
              <button
                key={c.id}
                type="button"
                role="tab"
                aria-selected={i === active}
                className={i === active ? 'is-on' : ''}
                onClick={() => setActive(i)}
                onPointerEnter={() => setActive(i)}
              >
                <span className="lp-tab-num">0{i + 1}</span>
                <span className="lp-tab-title">{c.title}</span>
                <span className="lp-tab-bar">
                  {i === active && (
                    <motion.i
                      key={`${active}-${paused}`}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: paused ? 1 : 1 }}
                      transition={{ duration: paused ? 0.3 : 5.2, ease: 'linear' }}
                    />
                  )}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
