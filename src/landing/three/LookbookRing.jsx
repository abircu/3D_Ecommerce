import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { useCursor, useTexture } from '@react-three/drei'

const R = 3.7
const W = 1.55
const H = 2.15
const TAU = Math.PI * 2

// a plane bent onto the ring's cylinder, so every look is a curved panel
function curvedPanel() {
  const g = new THREE.PlaneGeometry(W, H, 32, 1)
  const pos = g.attributes.position
  for (let i = 0; i < pos.count; i += 1) {
    const a = pos.getX(i) / R
    pos.setX(i, Math.sin(a) * R)
    pos.setZ(i, Math.cos(a) * R - R)
  }
  g.computeVertexNormals()
  return g
}

function Panel({ texture, angle, geo, index, onPick }) {
  const mesh = useRef(null)
  const [hot, setHot] = useState(false)
  useCursor(hot)
  useFrame((_, dt) => {
    const s = hot ? 1.08 : 1
    const k = 1 - Math.exp(-dt * 8)
    mesh.current.scale.x += (s - mesh.current.scale.x) * k
    mesh.current.scale.y += (s - mesh.current.scale.y) * k
  })
  return (
    <group rotation={[0, angle, 0]}>
      <mesh
        ref={mesh}
        geometry={geo}
        position={[0, 0, R]}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHot(true)
        }}
        onPointerOut={() => setHot(false)}
        onClick={(e) => {
          e.stopPropagation()
          onPick(index)
        }}
      >
        <meshBasicMaterial map={texture} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
    </group>
  )
}

export default function LookbookRing({ images, progress, onFront, focusRef }) {
  const loaded = useTexture(images)
  const textures = useMemo(() => {
    loaded.forEach((t) => {
      t.colorSpace = THREE.SRGBColorSpace
      t.anisotropy = 8
    })
    return loaded
  }, [loaded])

  const geo = useMemo(() => curvedPanel(), [])
  const ring = useRef(null)
  const tilt = useRef(null)
  const drag = useRef({ down: false, x: 0, v: 0, offset: 0 })
  const front = useRef(-1)
  const { gl, viewport } = useThree()
  const N = images.length
  const step = TAU / N
  // desktop: fit the whole ring; phones: keep the front look roughly half the screen width
  const scale = Math.min(1, Math.max(viewport.width / 9, (viewport.width * 0.36) / W))

  // drag to spin, with inertia
  useEffect(() => {
    const el = gl.domElement
    const d = drag.current
    const down = (e) => {
      d.down = true
      d.x = e.clientX
      el.setPointerCapture?.(e.pointerId)
    }
    const move = (e) => {
      if (!d.down) return
      const dx = e.clientX - d.x
      d.x = e.clientX
      d.v = dx * 0.006
      d.offset += d.v
    }
    const up = () => {
      d.down = false
    }
    el.addEventListener('pointerdown', down)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    return () => {
      el.removeEventListener('pointerdown', down)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
  }, [gl])

  // let the HTML buttons jump to a look
  useEffect(() => {
    if (!focusRef) return
    focusRef.current = (i) => {
      const current = ring.current.rotation.y
      const goal = -i * step
      const diff = Math.atan2(Math.sin(goal - current), Math.cos(goal - current))
      drag.current.offset += diff
      drag.current.v = 0
    }
  }, [focusRef, step])

  useFrame((state, dt) => {
    const d = drag.current
    if (!d.down) {
      d.offset += d.v
      d.v *= Math.pow(0.9, dt * 60)
      d.offset -= dt * 0.06 // slow idle drift
    }
    const goal = -(progress?.get() ?? 0) * TAU * 0.85 + d.offset
    const r = ring.current
    r.rotation.y += (goal - r.rotation.y) * (1 - Math.exp(-dt * 5))

    const t = tilt.current
    const k = 1 - Math.exp(-dt * 3)
    t.rotation.x += (0.1 - state.pointer.y * 0.08 - t.rotation.x) * k
    t.rotation.z += (0.05 + state.pointer.x * 0.04 - t.rotation.z) * k

    const i = (((Math.round(-r.rotation.y / step) % N) + N) % N)
    if (i !== front.current) {
      front.current = i
      onFront?.(i)
    }
  })

  return (
    <group ref={tilt} scale={scale} position={[0, -0.1, 0]}>
      <group ref={ring}>
        {textures.map((tex, i) => (
          <Panel
            key={images[i]}
            texture={tex}
            angle={i * step}
            geo={geo}
            index={i}
            onPick={(idx) => focusRef?.current?.(idx)}
          />
        ))}
      </group>
    </group>
  )
}
