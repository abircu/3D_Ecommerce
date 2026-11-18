import { useEffect, useImperativeHandle, useRef } from 'react'
import { money } from '../data/products'

function norm(angle) {
  let value = angle % 360
  if (value > 180) value -= 360
  if (value < -180) value += 360
  return value
}

export default function RingCarousel({ products, active, onActive, onHold, onLock, apiRef }) {
  const stageRef = useRef(null)
  const ringRef = useRef(null)
  const onActiveRef = useRef(onActive)
  const onHoldRef = useRef(onHold)
  const onLockRef = useRef(onLock)
  const productsRef = useRef(products)
  const state = useRef({
    rot: -36,
    tilt: 14,
    spin: 0,
    velocity: 0.09,
    paused: false,
    hold: false,
    lockIndex: null,
    dragging: false,
    moved: 0,
    lock: null,
    lastX: 0,
    lastY: 0,
    downSlot: null,
    active: 0,
    baseTilt: 14,
    shift: 48,
    focus: null,
    release: null,
    boost: null,
  })

  useEffect(() => {
    onActiveRef.current = onActive
    onHoldRef.current = onHold
    onLockRef.current = onLock
  }, [onActive, onHold, onLock])

  useEffect(() => {
    productsRef.current = products
  }, [products])

  useImperativeHandle(apiRef, () => ({
    focus(index) {
      state.current.focus?.(index)
    },
    spin() {
      state.current.release?.()
    },
    boost() {
      state.current.boost?.()
    },
  }))

  useEffect(() => {
    const stage = stageRef.current
    const ring = ringRef.current
    if (!stage || !ring) return undefined

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const s = state.current
    const slots = () => [...stage.querySelectorAll('[data-slot]')]

    const setHold = (held) => {
      s.paused = held
      if (s.hold === held) return
      s.hold = held
      onHoldRef.current?.(held)
    }

    const layout = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      const narrow = w < 720
      const cardW = narrow ? 128 : w < 1100 ? 156 : 188
      const cardH = Math.round(cardW * 1.28)
      const rail = w >= 1100 ? 190 : 8
      const maxR = Math.max(118, w / 2 - rail - cardW * 0.7)
      let radius = Math.min(narrow ? w * 0.34 : w * 0.24, maxR, h * 0.28)
      radius = Math.max(radius, narrow ? 118 : 160)
      stage.style.setProperty('--radius', `${radius}px`)
      stage.style.setProperty('--card-w', `${cardW}px`)
      stage.style.setProperty('--card-h', `${cardH}px`)
      stage.style.setProperty('--step', `${360 / productsRef.current.length}deg`)
      s.baseTilt = narrow || h < 820 ? 9 : 15
      s.shift = narrow ? 8 : 40
    }

    const focusIndex = (index) => {
      const list = productsRef.current
      const step = 360 / list.length
      const ang = norm(index * step + s.rot)
      s.spin = s.rot - ang
      s.velocity = 0
      s.lockIndex = index
      s.active = index
      setHold(true)
      onActiveRef.current?.(index)
      onLockRef.current?.(index)
    }
    s.focus = focusIndex
    s.release = () => {
      s.lockIndex = null
      s.velocity = 0.09
      setHold(false)
    }
    s.boost = () => {
      s.lockIndex = null
      s.velocity = reduce ? 0.4 : 2.8
      setHold(false)
      stage.classList.add('is-boost')
      window.clearTimeout(s.boostTimer)
      s.boostTimer = window.setTimeout(() => stage.classList.remove('is-boost'), 720)
    }

    const paint = () => {
      const list = productsRef.current
      const step = 360 / list.length
      if (!s.dragging && !reduce) {
        if (s.paused) s.velocity = 0
        else {
          s.velocity += (0.085 - s.velocity) * 0.02
          s.spin += s.velocity
        }
      }
      const ease = reduce ? 1 : 0.1
      s.rot += (s.spin - s.rot) * ease
      s.tilt += (s.baseTilt - s.tilt) * 0.08

      ring.style.transform = `translateY(${s.shift}px) rotateX(${s.tilt}deg) rotateY(${s.rot}deg)`
      ring.style.setProperty('--rot', `${s.rot}deg`)

      let best = 0
      let bestD = Infinity
      slots().forEach((el) => {
        const index = Number(el.dataset.slot)
        const ang = norm(index * step + s.rot)
        const dist = Math.abs(ang)
        if (dist < bestD) {
          bestD = dist
          best = index
        }
        const face = el.querySelector('.face')
        const visible = dist < 92
        el.style.visibility = visible ? 'visible' : 'hidden'
        el.style.pointerEvents = visible ? 'auto' : 'none'
        if (!visible || !face) return
        const t = 1 - dist / 92
        el.style.zIndex = String(200 + Math.round(t * 120))
        face.style.opacity = String(0.4 + t * 0.6)
        face.style.filter = `brightness(${0.5 + t * 0.6}) saturate(${0.8 + t * 0.25})`
      })

      const chosen = s.paused && s.lockIndex != null ? s.lockIndex : best
      if (chosen !== s.active) {
        s.active = chosen
        onActiveRef.current?.(chosen)
      }
    }

    let frame = 0
    const loop = () => {
      paint()
      frame = requestAnimationFrame(loop)
    }

    const onMove = (event) => {
      if (!s.dragging) return
      const dx = event.clientX - s.lastX
      const dy = event.clientY - s.lastY
      s.lastX = event.clientX
      s.lastY = event.clientY
      s.moved += Math.abs(dx) + Math.abs(dy)
      if (!s.lock && s.moved > 8) {
        s.lock = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y'
        if (s.lock === 'x') stage.setPointerCapture?.(event.pointerId)
      }
      if (s.lock === 'y') {
        s.dragging = false
        return
      }
      if (s.lock !== 'x') return
      s.paused = false
      s.lockIndex = null
      setHold(false)
      s.velocity = dx * 0.42
      s.spin += dx * 0.42
    }

    const onDown = (event) => {
      if (event.button !== undefined && event.button !== 0) return
      s.dragging = true
      s.moved = 0
      s.lock = null
      s.velocity = 0
      s.lastX = event.clientX
      s.lastY = event.clientY
      const slot = event.target.closest?.('[data-slot]')
      s.downSlot = slot ? Number(slot.dataset.slot) : null
    }

    const onUp = () => {
      if (!s.dragging && s.downSlot == null) return
      const vertical = s.lock === 'y'
      const wasDrag = s.moved > 10 && !vertical
      const slot = s.downSlot
      s.dragging = false
      s.lock = null
      s.downSlot = null
      if (vertical || wasDrag || slot == null) return
      focusIndex(slot)
    }

    const onKey = (event) => {
      if (event.target instanceof HTMLElement && event.target.closest('input, textarea')) return
      const n = productsRef.current.length
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        focusIndex((s.active + 1) % n)
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault()
        focusIndex((s.active - 1 + n) % n)
      } else if (event.code === 'Space') {
        event.preventDefault()
        s.boost?.()
      }
    }

    layout()
    window.addEventListener('resize', layout)
    window.addEventListener('pointermove', onMove, { passive: true })
    stage.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('keydown', onKey)
    frame = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', layout)
      window.removeEventListener('pointermove', onMove)
      stage.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('keydown', onKey)
      window.clearTimeout(s.boostTimer)
    }
  }, [])

  return (
    <div className="stage" ref={stageRef}>
      <div className="floor" />
      <div className="ring" ref={ringRef}>
        <div className="orbit-path" />
        <div className="orbit-path inner" />
        {products.map((product, index) => (
          <span key={`bead-${product.id}`} className="bead" style={{ '--i': index }} />
        ))}
        {products.map((product, index) => (
          <button
            key={product.id}
            type="button"
            className={`slot ${index === active ? 'is-hot' : ''}`}
            data-slot={index}
            data-cursor="select"
            style={{ '--i': index }}
            aria-label={`${product.name}, ${money(product.price)}`}
          >
            <span className="face">
              <img src={product.images[0]} alt="" draggable="false" />
              <span className="face-shade" />
              <span className="face-index">{String(index + 1).padStart(2, '0')}</span>
              <span className="face-copy">
                <strong>{product.name}</strong>
                <span>{money(product.price)}</span>
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
