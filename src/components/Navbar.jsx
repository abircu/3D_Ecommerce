import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useCart } from '../context/cart-context'
import { pad } from '../data/products'
import ThemeToggle from './ThemeToggle'

const LINKS = [
  { to: '/', label: 'Orbit', end: true },
  { to: '/shop', label: 'Shop' },
  { to: '/atelier', label: 'Atelier' },
]

export default function Navbar() {
  const { count, setOpen } = useCart()
  const [solid, setSolid] = useState(() => window.scrollY > 12)
  const [hidden, setHidden] = useState(false)
  const [menu, setMenu] = useState(false)
  const location = useLocation()
  const [path, setPath] = useState(location.pathname)
  if (path !== location.pathname) {
    setPath(location.pathname)
    setMenu(false)
  }

  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setSolid(y > 12)
      setHidden(y > last && y > 90)
      last = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`nav ${solid ? 'is-solid' : ''} ${hidden && !menu ? 'is-hidden' : ''}`}>
      <NavLink to="/" className="logo" data-cursor="home" end>
        <i className="logo-mark" />
        AETHER
      </NavLink>

      <nav className="nav-links">
        {LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            data-cursor="go"
            className={({ isActive }) => (isActive ? 'is-active' : '')}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="nav-tools">
        <ThemeToggle />
        <button type="button" className="bag" data-cursor="bag" onClick={() => setOpen(true)}>
          Bag
          <span>{pad(count)}</span>
        </button>
        <button
          type="button"
          className={`burger ${menu ? 'is-open' : ''}`}
          aria-label={menu ? 'Close menu' : 'Open menu'}
          aria-expanded={menu}
          onClick={() => setMenu((value) => !value)}
        >
          <i />
          <i />
        </button>
      </div>

      <AnimatePresence>
        {menu && (
          <motion.nav
            className="mobile-nav"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28 }}
          >
            {LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.end} onClick={() => setMenu(false)}>
                {link.label}
              </NavLink>
            ))}
            <ThemeToggle />
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
