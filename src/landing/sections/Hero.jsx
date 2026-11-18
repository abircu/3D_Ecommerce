import { useRef, useState } from 'react'
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import LazyCanvas from '../three/LazyCanvas'
import HeroScene from '../three/HeroScene'
import { Icon, Magnetic, Stars } from '../ui'
import { ease, unsplash } from '../utils'

export default function Hero({ hero, avatars }) {
  const section = useRef(null)
  const [color, setColor] = useState(hero.colors[0])
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end start'] })
  const bigX = useTransform(scrollYProgress, [0, 1], ['0%', '-22%'])
  const stageY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const copyY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <section className="lp-hero" id="top" ref={section} style={{ '--tee': color.hex }}>
      <div className="lp-hero-glow" aria-hidden="true" />
      <motion.div className="lp-hero-bigword" style={{ x: bigX }} aria-hidden="true">
        VELORA VELORA
      </motion.div>

      <motion.div className="lp-hero-copy" style={{ y: copyY, opacity: fade }}>
        <motion.p
          className="lp-chip"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease }}
        >
          <span className="lp-dot" /> {hero.kicker}
        </motion.p>
        <h1 className="lp-hero-title">
          {hero.title.map((line, li) => (
            <span className="lp-line" key={line}>
              {line.split('').map((ch, ci) => (
                <motion.span
                  key={`${ch}-${ci}`}
                  className={li === 2 ? 'lp-char lp-accent-serif' : 'lp-char'}
                  initial={{ y: '115%', rotateX: -80, opacity: 0 }}
                  animate={{ y: '0%', rotateX: 0, opacity: 1 }}
                  transition={{ duration: 1, delay: 0.35 + li * 0.14 + ci * 0.025, ease }}
                >
                  {ch === ' ' ? ' ' : ch}
                </motion.span>
              ))}
            </span>
          ))}
        </h1>
        <motion.p
          className="lp-hero-text"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1, ease }}
        >
          {hero.copy}
        </motion.p>

        <motion.div
          className="lp-hero-ctas"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.15, ease }}
        >
          <Magnetic as="a" href="#shop" className="lp-btn lp-btn-primary">
            Shop the drop <Icon name="arrow" size={18} />
          </Magnetic>
          <Magnetic as="a" href="#lookbook" className="lp-btn lp-btn-ghost">
            View lookbook
          </Magnetic>
        </motion.div>

        <motion.div
          className="lp-hero-proof"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.4 }}
        >
          <div className="lp-avatars">
            {avatars.map((a) => (
              <img key={a} src={unsplash(a, 80, 80)} alt="" />
            ))}
          </div>
          <div>
            <Stars value={5} />
            <p>
              <b>4.9/5</b> from 12,400+ reviews
            </p>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="lp-hero-stage"
        style={{ y: stageY }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, delay: 0.2, ease }}
      >
        <div className="lp-stage-ring" aria-hidden="true" />
        <LazyCanvas className="lp-canvas" camera={{ position: [0, 0.1, 6], fov: 35 }}>
          <HeroScene color={color.hex} />
        </LazyCanvas>

        <motion.div
          className="lp-float-card lp-fc-1"
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span>Heavyweight</span>
          <b>240 GSM</b>
        </motion.div>
        <motion.div
          className="lp-float-card lp-fc-2"
          animate={{ y: [0, 14, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        >
          <span>Essential Tee</span>
          <b>$29</b>
          <AnimatePresence mode="wait">
            <motion.em
              key={color.name}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {color.name}
            </motion.em>
          </AnimatePresence>
        </motion.div>

        <div className="lp-swatches" role="radiogroup" aria-label="Tee color">
          {hero.colors.map((c) => (
            <button
              key={c.name}
              type="button"
              role="radio"
              aria-checked={c.name === color.name}
              aria-label={c.name}
              className={c.name === color.name ? 'is-on' : ''}
              style={{ '--c': c.hex }}
              onClick={() => setColor(c)}
            >
              {c.name === color.name && <motion.i layoutId="swatch-ring" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />}
            </button>
          ))}
        </div>
        <p className="lp-drag-hint">
          <Icon name="arrow" size={14} className="flip" /> Drag to rotate <Icon name="arrow" size={14} />
        </p>
      </motion.div>

      <div className="lp-hero-badges">
        {hero.badges.map((b, i) => (
          <motion.span
            key={b}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 + i * 0.1, duration: 0.7, ease }}
          >
            {b}
          </motion.span>
        ))}
      </div>

      <a href="#collections" className="lp-scroll-cue" aria-label="Scroll down">
        <span />
      </a>
    </section>
  )
}
