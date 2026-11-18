import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { useFrame, useThree } from '@react-three/fiber'
import {
  ContactShadows,
  Environment,
  Float,
  Lightformer,
  PresentationControls,
  Sparkles,
} from '@react-three/drei'

/* ---------- procedural garment ---------- */

function teeShape() {
  const s = new THREE.Shape()
  s.moveTo(-0.34, 1.06)
  s.quadraticCurveTo(0, 0.72, 0.34, 1.06) // neckline
  s.lineTo(0.9, 0.93) // shoulder
  s.quadraticCurveTo(1.14, 0.82, 1.42, 0.36) // sleeve top
  s.lineTo(1.04, 0.12) // sleeve hem
  s.quadraticCurveTo(0.88, 0.3, 0.77, 0.44) // under-arm
  s.quadraticCurveTo(0.7, -0.3, 0.8, -1.12) // side seam
  s.quadraticCurveTo(0, -1.2, -0.8, -1.12) // hem
  s.quadraticCurveTo(-0.7, -0.3, -0.77, 0.44)
  s.quadraticCurveTo(-0.88, 0.3, -1.04, 0.12)
  s.lineTo(-1.42, 0.36)
  s.quadraticCurveTo(-1.14, 0.82, -0.9, 0.93)
  s.lineTo(-0.34, 1.06)
  return s
}

function teeGeometry() {
  let g = new THREE.ExtrudeGeometry(teeShape(), {
    depth: 0.16,
    bevelEnabled: true,
    bevelThickness: 0.13,
    bevelSize: 0.08,
    bevelSegments: 12,
    curveSegments: 48,
  })
  g.translate(0, 0, -0.08)
  // smooth the puffy edges: drop the flat normals, weld, recompute
  g.deleteAttribute('normal')
  g = mergeVertices(g)
  g.computeVertexNormals()
  return g
}

// tiny knit pattern used as bump + roughness so the surface reads as fabric
function knitTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const g = c.getContext('2d')
  g.fillStyle = '#7a7a7a'
  g.fillRect(0, 0, 128, 128)
  for (let x = 0; x < 128; x += 4) {
    for (let y = 0; y < 128; y += 4) {
      const v = 120 + Math.random() * 70
      g.fillStyle = `rgb(${v},${v},${v})`
      g.beginPath()
      g.ellipse(x + 2, y + 2, 1.5, 2.1, 0, 0, Math.PI * 2)
      g.fill()
    }
  }
  const t = new THREE.CanvasTexture(c)
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.repeat.set(3, 3)
  return t
}

function printTexture() {
  const c = document.createElement('canvas')
  c.width = 512
  c.height = 256
  const g = c.getContext('2d')
  g.fillStyle = '#fff'
  g.strokeStyle = '#fff'
  g.lineWidth = 6
  g.beginPath()
  g.arc(256, 70, 44, 0, Math.PI * 2)
  g.stroke()
  g.font = '700 46px Syne, Arial, sans-serif'
  g.textAlign = 'center'
  g.fillText('V', 256, 87)
  g.font = '700 64px Syne, Arial, sans-serif'
  g.fillText('VELORA', 256, 190)
  g.font = '500 22px Outfit, Arial, sans-serif'
  g.fillText('WEAR THE MOTION · EST. 2026', 256, 232)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 8
  return t
}

function isLight(hex) {
  const c = new THREE.Color(hex)
  const hsl = {}
  c.getHSL(hsl)
  return hsl.l > 0.62
}

function Hanger() {
  const bar = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.92, 0.9, -0.2),
        new THREE.Vector3(-0.5, 1.14, -0.2),
        new THREE.Vector3(0, 1.36, -0.2),
        new THREE.Vector3(0.5, 1.14, -0.2),
        new THREE.Vector3(0.92, 0.9, -0.2),
      ]),
    [],
  )
  return (
    <group>
      <mesh>
        <tubeGeometry args={[bar, 64, 0.028, 12, false]} />
        <meshStandardMaterial color="#d9d4cc" metalness={1} roughness={0.22} />
      </mesh>
      <mesh position={[0, 1.43, -0.2]}>
        <cylinderGeometry args={[0.024, 0.024, 0.16, 12]} />
        <meshStandardMaterial color="#d9d4cc" metalness={1} roughness={0.22} />
      </mesh>
      <mesh position={[0.1, 1.6, -0.2]} rotation={[0, 0, -0.6]}>
        <torusGeometry args={[0.12, 0.024, 16, 48, Math.PI * 1.35]} />
        <meshStandardMaterial color="#d9d4cc" metalness={1} roughness={0.22} />
      </mesh>
    </group>
  )
}

function Tee({ color }) {
  const pivot = useRef(null)
  const mat = useRef(null)
  const printMat = useRef(null)
  const geo = useMemo(() => teeGeometry(), [])
  const knit = useMemo(() => knitTexture(), [])
  const print = useMemo(() => printTexture(), [])
  const target = useMemo(() => new THREE.Color(), [])
  const ink = useMemo(() => new THREE.Color(), [])
  const front = useMemo(() => {
    geo.computeBoundingBox()
    return geo.boundingBox.max.z + 0.003
  }, [geo])

  useFrame((state, dt) => {
    const k = 1 - Math.exp(-dt * 5)
    target.set(color)
    ink.set(isLight(color) ? '#16161a' : '#f6f1e8')
    mat.current.color.lerp(target, k)
    printMat.current.color.lerp(ink, k)
    const t = state.clock.elapsedTime
    // a gentle pendulum sway from the hanger hook
    pivot.current.rotation.z = Math.sin(t * 1.1) * 0.045
    pivot.current.rotation.x = Math.sin(t * 0.8 + 1) * 0.035
  })

  return (
    <group position={[0, 1.62, 0]}>
      <group ref={pivot}>
        <group position={[0, -1.62, 0]}>
          <Hanger />
          <mesh geometry={geo}>
            <meshPhysicalMaterial
              ref={mat}
              roughness={0.82}
              roughnessMap={knit}
              bumpMap={knit}
              bumpScale={0.6}
              sheen={1}
              sheenRoughness={0.6}
              sheenColor="#ffffff"
            />
          </mesh>
          <mesh position={[0, 0.28, front]}>
            <planeGeometry args={[0.92, 0.46]} />
            <meshStandardMaterial
              ref={printMat}
              map={print}
              transparent
              roughness={0.9}
              polygonOffset
              polygonOffsetFactor={-2}
            />
          </mesh>
        </group>
      </group>
    </group>
  )
}

/* ---------- floating sewing buttons ---------- */

function SewButton({ position, color, scale = 1, speed = 1.4 }) {
  const holes = [
    [0.05, 0.05],
    [-0.05, 0.05],
    [0.05, -0.05],
    [-0.05, -0.05],
  ]
  return (
    <Float speed={speed} rotationIntensity={2.2} floatIntensity={1.6}>
      <group position={position} scale={scale} rotation={[Math.PI / 2.4, 0, 0.3]}>
        <mesh>
          <cylinderGeometry args={[0.2, 0.2, 0.06, 48]} />
          <meshStandardMaterial color={color} roughness={0.3} metalness={0.15} />
        </mesh>
        <mesh position={[0, 0.032, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.16, 0.016, 12, 48]} />
          <meshStandardMaterial color={color} roughness={0.3} metalness={0.15} />
        </mesh>
        {holes.map(([x, z]) => (
          <mesh key={`${x}${z}`} position={[x, 0.031, z]}>
            <cylinderGeometry args={[0.022, 0.022, 0.012, 16]} />
            <meshBasicMaterial color="#0c0c0e" />
          </mesh>
        ))}
      </group>
    </Float>
  )
}

/* ---------- camera rig: subtle parallax with the pointer ---------- */

function Rig({ children }) {
  const group = useRef(null)
  const { viewport } = useThree()
  const scale = Math.min(1, viewport.width / 4.4)
  useFrame((state, dt) => {
    const k = 1 - Math.exp(-dt * 3)
    group.current.rotation.y += (state.pointer.x * 0.25 - group.current.rotation.y) * k
    group.current.rotation.x += (-state.pointer.y * 0.12 - group.current.rotation.x) * k
  })
  return (
    <group ref={group} scale={scale}>
      {children}
    </group>
  )
}

export default function HeroScene({ color }) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 4, 5]} intensity={1.8} />
      <spotLight position={[-4, 3, 2]} intensity={40} angle={0.5} penumbra={1} color="#ffd9c7" />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={3} position={[0, 4, -2]} scale={[8, 2, 1]} />
        <Lightformer form="rect" intensity={2} position={[-5, 1, 1]} rotation-y={Math.PI / 2} scale={[6, 3, 1]} />
        <Lightformer form="ring" intensity={4} color="#ff5a36" position={[4, 0, 3]} scale={2} />
      </Environment>

      <Rig>
        <PresentationControls
          cursor
          snap
          speed={1.6}
          polar={[-0.25, 0.3]}
          azimuth={[-Math.PI / 1.6, Math.PI / 1.6]}
          damping={0.25}
        >
          <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.4}>
            <Tee color={color} />
          </Float>
        </PresentationControls>

        <SewButton position={[-1.9, 0.9, -0.6]} color="#ff5a36" scale={1.1} />
        <SewButton position={[1.95, -0.6, 0.2]} color="#ece5d8" scale={0.9} speed={1.8} />
        <SewButton position={[1.6, 1.25, -1.2]} color="#3651d4" scale={0.7} speed={1.1} />
        <SewButton position={[-1.7, -1.1, 0.4]} color="#8fa58a" scale={0.6} speed={2} />
      </Rig>

      <Sparkles count={46} scale={[7, 4.5, 3]} size={2.4} speed={0.35} color="#ffb199" opacity={0.7} />
      <ContactShadows position={[0, -1.85, 0]} opacity={0.5} scale={9} blur={2.6} far={3.5} />
    </>
  )
}
