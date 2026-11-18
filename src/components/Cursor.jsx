import { useEffect, useRef } from 'react'

export default function Cursor() {
  const dot = useRef(null)
  const ring = useRef(null)

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    if (!fine || !dot.current || !ring.current) return undefined

    document.body.classList.add('has-cursor')
    const pos = { x: -80, y: -80 }
    const lag = { x: pos.x, y: pos.y }
    let label = ''
    let frame = 0
    dot.current.style.opacity = '0'
    ring.current.style.opacity = '0'

    const move = (event) => {
      dot.current.style.opacity = '1'
      ring.current.style.opacity = '1'
      pos.x = event.clientX
      pos.y = event.clientY
      document.documentElement.style.setProperty('--mx', `${event.clientX}px`)
      document.documentElement.style.setProperty('--my', `${event.clientY}px`)
      const target = event.target.closest?.('[data-cursor]')
      const next = target?.dataset.cursor || ''
      if (next !== label && ring.current) {
        label = next
        ring.current.dataset.label = label
        ring.current.classList.toggle('is-hot', Boolean(label))
      }
    }

    const loop = () => {
      lag.x += (pos.x - lag.x) * 0.2
      lag.y += (pos.y - lag.y) * 0.2
      dot.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`
      ring.current.style.transform = `translate3d(${lag.x}px, ${lag.y}px, 0)`
      frame = requestAnimationFrame(loop)
    }

    window.addEventListener('pointermove', move, { passive: true })
    frame = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', move)
      document.body.classList.remove('has-cursor')
    }
  }, [])

  return (
    <>
      <div ref={dot} className="cursor-dot" />
      <div ref={ring} className="cursor-ring" data-label="" />
    </>
  )
}
