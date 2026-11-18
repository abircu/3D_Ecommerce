import { useRef } from 'react'

export default function Tilt({ children, className = '', max = 10 }) {
  const ref = useRef(null)

  const move = (event) => {
    if (event.pointerType === 'touch') return
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (event.clientX - rect.left) / rect.width - 0.5
    const py = (event.clientY - rect.top) / rect.height - 0.5
    el.style.setProperty('--rx', `${(-py * max).toFixed(2)}deg`)
    el.style.setProperty('--ry', `${(px * max).toFixed(2)}deg`)
    el.style.setProperty('--mx', `${(px + 0.5) * 100}%`)
    el.style.setProperty('--my', `${(py + 0.5) * 100}%`)
  }

  const leave = () => {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--rx', '0deg')
    el.style.setProperty('--ry', '0deg')
  }

  return (
    <div className={`tilt ${className}`}>
      <div
        ref={ref}
        className="tilt-inner"
        onPointerMove={move}
        onPointerLeave={leave}
      >
        {children}
      </div>
    </div>
  )
}
