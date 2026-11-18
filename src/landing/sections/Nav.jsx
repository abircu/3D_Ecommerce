import { useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from 'framer-motion'
import { useCart } from '../../context/cart-context'
import { Icon } from '../ui'
import { ease } from '../utils'

const links = [
  { href: '#collections', label: 'Collections' },
  { href: '#shop', label: 'Shop' },
  { href: '#lookbook', label: 'Lookbook' },
  { href: '#story', label: 'Story' },
]

export default function Nav({ brand }) {
  const { count, setOpen } = useCart()
  const { scrollY, scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24 })
  const [hidden, setHidden] = useState(false)
  const [solid, setSolid] = useState(false)
  const [menu, setMenu] = useState(false)

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setHidden(y > prev && y > 240 && !menu)
    setSolid(y > 40)
  })

  return (
    <>
      <div className="lp-announce">
        <div className="lp-announce-track">
          {[0, 1].map((k) => (
            <span key={k}>{brand.announcement} ✦ </span>
          ))}
        </div>
      </div>
      <motion.header
        className={`lp-nav ${solid ? 'is-solid' : ''}`}
        animate={{ y: hidden ? '-120%' : '0%' }}
        transition={{ duration: 0.45, ease }}
      >
        <a href="#top" className="lp-logo" aria-label={brand.name}>
          <span className="lp-logo-mark">V</span>
          {brand.name}
        </a>
        <nav className="lp-links" aria-label="Main">
          {links.map((l) => (
            <a key={l.href} href={l.href}>
              <span data-text={l.label}>{l.label}</span>
            </a>
          ))}
        </nav>
        <div className="lp-nav-actions">
          <button type="button" className="lp-icon-btn" aria-label="Search">
            <Icon name="search" />
          </button>
          <button type="button" className="lp-icon-btn lp-cart-btn" aria-label="Open cart" onClick={() => setOpen(true)}>
            <Icon name="bag" />
            <AnimatePresence>
              {count > 0 && (
                <motion.b
                  key={count}
                  initial={{ scale: 0, rotate: -40 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 18 }}
                >
                  {count}
                </motion.b>
              )}
            </AnimatePresence>
          </button>
          <button
            type="button"
            className="lp-icon-btn lp-menu-btn"
            aria-label="Menu"
            aria-expanded={menu}
            onClick={() => setMenu((m) => !m)}
          >
            <Icon name={menu ? 'close' : 'menu'} />
          </button>
        </div>
        <motion.div className="lp-progress" style={{ scaleX: progress }} />
      </motion.header>

      <AnimatePresence>
        {menu && (
          <motion.nav
            className="lp-mobile-menu"
            initial={{ clipPath: 'circle(0% at 92% 4%)' }}
            animate={{ clipPath: 'circle(150% at 92% 4%)' }}
            exit={{ clipPath: 'circle(0% at 92% 4%)' }}
            transition={{ duration: 0.7, ease }}
          >
            {links.map((l, i) => (
              <motion.a
                key={l.href}
                href={l.href}
                onClick={() => setMenu(false)}
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15 + i * 0.07, duration: 0.6, ease }}
              >
                {l.label}
              </motion.a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  )
}
