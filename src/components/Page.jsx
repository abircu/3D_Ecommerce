import { motion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1]

export default function Page({ children, className = '' }) {
  const home = className.includes('home-page')

  return (
    <motion.main
      className={`page ${className}`}
      initial={home ? false : { opacity: 0, rotateX: 12, y: 36 }}
      animate={home ? { opacity: 1 } : { opacity: 1, rotateX: 0, y: 0 }}
      exit={home ? { opacity: 1 } : { opacity: 0, rotateX: -8, y: -20 }}
      transition={{ duration: 0.55, ease }}
      style={home ? undefined : { transformPerspective: 1400, transformOrigin: '50% 0px' }}
    >
      {children}
    </motion.main>
  )
}
