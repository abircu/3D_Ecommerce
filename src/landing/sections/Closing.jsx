import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Icon, Magnetic, SplitWords } from '../ui'
import { ease } from '../utils'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)

  return (
    <section className="lp-news">
      <div className="lp-news-orbs" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.i
            key={i}
            animate={{ y: [0, -24, 0], rotate: [0, 180, 360] }}
            transition={{ duration: 6 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
          />
        ))}
      </div>
      <p className="lp-kicker">Members get 15% off</p>
      <h2>
        <SplitWords text="Join the" /> <SplitWords text="inner circle." className="lp-accent-serif" delay={0.15} />
      </h2>
      <p className="lp-news-text">Early access to drops, private sales and studio notes. One email a week, never more.</p>

      <AnimatePresence mode="wait">
        {done ? (
          <motion.p
            key="done"
            className="lp-news-done"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 18 }}
          >
            <Icon name="check" /> You're in. Check your inbox for your code.
          </motion.p>
        ) : (
          <motion.form
            key="form"
            className="lp-news-form"
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease }}
            onSubmit={(e) => {
              e.preventDefault()
              if (/\S+@\S+\.\S+/.test(email)) setDone(true)
            }}
          >
            <input
              type="email"
              required
              placeholder="you@example.com"
              aria-label="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Magnetic type="submit" className="lp-btn lp-btn-dark" strength={0.2}>
              Subscribe <Icon name="arrow" size={18} />
            </Magnetic>
          </motion.form>
        )}
      </AnimatePresence>
    </section>
  )
}

const cols = [
  { title: 'Shop', links: ['Men', 'Women', 'Streetwear', 'New arrivals', 'Sale'] },
  { title: 'Help', links: ['Shipping', 'Returns', 'Size guide', 'Contact'] },
  { title: 'Studio', links: ['Our story', 'Sustainability', 'Careers', 'Press'] },
]

export function Footer({ brand }) {
  return (
    <footer className="lp-footer">
      <div className="lp-footer-top">
        <div>
          <a href="#top" className="lp-logo">
            <span className="lp-logo-mark">V</span>
            {brand.name}
          </a>
          <p className="lp-muted">{brand.tagline} Designed in small batches, shipped worldwide.</p>
        </div>
        {cols.map((c) => (
          <div key={c.title} className="lp-footer-col">
            <h4>{c.title}</h4>
            {c.links.map((l) => (
              <a key={l} href="#shop">
                {l}
              </a>
            ))}
          </div>
        ))}
      </div>
      <motion.div
        className="lp-footer-word"
        initial={{ y: '40%', opacity: 0 }}
        whileInView={{ y: '0%', opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease }}
        aria-hidden="true"
      >
        {brand.name}
      </motion.div>
      <div className="lp-footer-bottom">
        <span>© 2026 {brand.name}. Demo store — all products are sample data.</span>
        <span>Instagram · TikTok · Pinterest</span>
      </div>
    </footer>
  )
}
