import { useEffect, useRef, useState } from 'react'
import { animate, motion, useInView, useMotionValue, useSpring } from 'framer-motion'
import { ease } from './utils'


/* fade + rise + slight 3D tilt as the element scrolls into view */
export function Reveal({ children, delay = 0, y = 48, className = '', as = 'div' }) {
  const Tag = motion[as]
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y, rotateX: -12 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.9, delay, ease }}
      style={{ transformPerspective: 1000, transformOrigin: '50% 100%' }}
    >
      {children}
    </Tag>
  )
}

/* each word slides up from behind a mask */
export function SplitWords({ text, className = '', delay = 0, stagger = 0.06 }) {
  const words = text.split(' ')
  return (
    <span className={`split ${className}`} aria-label={text}>
      {words.map((w, i) => (
        <span className="split-mask" key={`${w}-${i}`} aria-hidden="true">
          <motion.span
            className="split-word"
            initial={{ y: '110%', rotate: 6 }}
            whileInView={{ y: '0%', rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: delay + i * stagger, ease }}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </span>
  )
}

/* button that leans toward the pointer */
export function Magnetic({ children, className = '', strength = 0.35, as = 'button', ...rest }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 15 })
  const sy = useSpring(y, { stiffness: 220, damping: 15 })
  const Tag = motion[as]
  return (
    <Tag
      ref={ref}
      className={className}
      style={{ x: sx, y: sy }}
      onPointerMove={(e) => {
        const r = ref.current.getBoundingClientRect()
        x.set((e.clientX - r.left - r.width / 2) * strength)
        y.set((e.clientY - r.top - r.height / 2) * strength)
      }}
      onPointerLeave={() => {
        x.set(0)
        y.set(0)
      }}
      whileTap={{ scale: 0.95 }}
      {...rest}
    >
      {children}
    </Tag>
  )
}

export function Counter({ value, suffix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!inView) return undefined
    const c = animate(0, value, { duration: 2.2, ease, onUpdate: (v) => setN(Math.round(v)) })
    return () => c.stop()
  }, [inView, value])
  return (
    <span ref={ref}>
      {n}
      {suffix}
    </span>
  )
}

export function Stars({ value = 5 }) {
  return (
    <span className="stars" aria-label={`${value} out of 5`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} viewBox="0 0 20 20" className={i < Math.round(value) ? 'on' : ''}>
          <path d="M10 1.5l2.6 5.6 6 .7-4.5 4.1 1.2 6-5.3-3-5.3 3 1.2-6L1.4 7.8l6-.7z" />
        </svg>
      ))}
    </span>
  )
}

const paths = {
  bag: 'M6 8h12l-1 13H7L6 8z M9 8V6a3 3 0 016 0v2',
  search: 'M11 4a7 7 0 100 14 7 7 0 000-14z M20 20l-4-4',
  heart: 'M12 20s-7-4.4-8.6-8.6A4.6 4.6 0 0112 7a4.6 4.6 0 018.6 4.4C19 15.6 12 20 12 20z',
  arrow: 'M5 12h14 M13 6l6 6-6 6',
  truck: 'M3 6h11v10H3z M14 10h4l3 3v3h-7 M7 20a2 2 0 100-4 2 2 0 000 4z M17 20a2 2 0 100-4 2 2 0 000 4z',
  return: 'M9 14L4 9l5-5 M4 9h11a5 5 0 010 10h-3',
  leaf: 'M5 19C5 10 11 5 20 5c0 9-5 15-14 14 M5 19l7-7',
  lock: 'M6 11h12v9H6z M8 11V8a4 4 0 018 0v3',
  menu: 'M4 7h16 M4 12h16 M4 17h16',
  close: 'M6 6l12 12 M18 6L6 18',
  check: 'M5 12l5 5 9-10',
  plus: 'M12 5v14 M5 12h14',
}

export function Icon({ name, size = 20, className = '', filled = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d={paths[name]}
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
