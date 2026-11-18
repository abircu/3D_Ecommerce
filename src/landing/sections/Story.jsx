import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Counter, Icon, Reveal, SplitWords } from '../ui'
import { ease, unsplash } from '../utils'

export default function Story({ stats, features }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const rotA = useTransform(scrollYProgress, [0, 1], [-14, 10])
  const rotB = useTransform(scrollYProgress, [0, 1], [12, -8])
  const yA = useTransform(scrollYProgress, [0, 1], ['10%', '-14%'])
  const yB = useTransform(scrollYProgress, [0, 1], ['-6%', '16%'])

  return (
    <section className="lp-story" id="story" ref={ref}>
      <div className="lp-story-grid">
        <div className="lp-story-copy">
          <Reveal as="p" className="lp-kicker">
            04 — Our story
          </Reveal>
          <h2>
            <SplitWords text="Slow fashion," /> <SplitWords text="fast feelings." className="lp-accent-serif" delay={0.2} />
          </h2>
          <Reveal delay={0.1}>
            <p className="lp-story-text">
              Every VELORA piece starts as a sketch in our studio and ends in small batches cut from organic, traceable
              fibre. Less waste, longer life, better fit.
            </p>
          </Reveal>
          <div className="lp-stats">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.08} className="lp-stat">
                <b>
                  <Counter value={s.value} suffix={s.suffix} />
                </b>
                <span>{s.label}</span>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="lp-story-visual" aria-hidden="true">
          <motion.img
            src={unsplash('photo-1489987707025-afc232f7ea0f', 700, 900)}
            alt=""
            className="lp-story-img a"
            style={{ rotate: rotA, y: yA }}
          />
          <motion.img
            src={unsplash('photo-1523381210434-271e8be1f52b', 600, 760)}
            alt=""
            className="lp-story-img b"
            style={{ rotate: rotB, y: yB }}
          />
          <motion.div
            className="lp-story-seal"
            animate={{ rotate: 360 }}
            transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          >
            <svg viewBox="0 0 200 200">
              <defs>
                <path id="seal" d="M100,100 m-72,0 a72,72 0 1,1 144,0 a72,72 0 1,1 -144,0" />
              </defs>
              <text>
                <textPath href="#seal" textLength="446" lengthAdjust="spacing">
                  ORGANIC ✦ MADE TO LAST ✦ VELORA ✦
                </textPath>
              </text>
            </svg>
          </motion.div>
        </div>
      </div>

      <div className="lp-features">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            className="lp-feature"
            initial={{ opacity: 0, y: 50, rotateY: -25 }}
            whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, delay: i * 0.1, ease }}
            whileHover={{ y: -8 }}
          >
            <span className="lp-feature-icon">
              <Icon name={f.icon} size={26} />
            </span>
            <h3>{f.title}</h3>
            <p>{f.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
