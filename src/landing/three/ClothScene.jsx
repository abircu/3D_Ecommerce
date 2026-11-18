import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'

const IMG_ASPECT = 1.6

const vertex = /* glsl */ `
  uniform float uTime;
  uniform float uProgress;
  uniform vec2 uMouse;
  uniform float uHover;
  varying vec2 vUv;
  varying float vShade;

  void main() {
    vUv = uv;
    vec3 p = position;
    // fabric pinned on the left edge, free on the right — like a banner on a rail
    float pin = smoothstep(0.0, 1.0, uv.x);
    float wave = sin(p.x * 1.3 + uTime * 1.5) * 0.16
               + sin(p.y * 2.1 + uTime * 1.1 + p.x * 0.8) * 0.07;
    float d = distance(uv, uMouse);
    float bulge = smoothstep(0.42, 0.0, d) * 0.42 * uHover;
    // the whole cloth billows while the image changes
    float billow = sin(uProgress * 3.14159) * 0.7 * sin(uv.x * 3.14159) * (0.6 + 0.4 * sin(uv.y * 3.14159));
    p.z += wave * pin + bulge + billow;
    vShade = (wave * pin + billow) * 0.9 + bulge * 0.5;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`

const fragment = /* glsl */ `
  uniform sampler2D uTex0;
  uniform sampler2D uTex1;
  uniform float uProgress;
  uniform float uPlaneAspect;
  uniform float uImgAspect;
  uniform float uTime;
  varying vec2 vUv;
  varying float vShade;

  vec2 cover(vec2 uv) {
    vec2 s = uPlaneAspect > uImgAspect
      ? vec2(1.0, uImgAspect / uPlaneAspect)
      : vec2(uPlaneAspect / uImgAspect, 1.0);
    return (uv - 0.5) * s + 0.5;
  }

  void main() {
    vec2 uv = cover(vUv);
    float n = sin(vUv.y * 14.0 + uTime * 2.0) * 0.035 + sin(vUv.y * 31.0) * 0.012;
    float front = uProgress * 1.35;
    float m = 1.0 - smoothstep(front - 0.35, front, vUv.x + n);
    float push = sin(uProgress * 3.14159) * 0.08;
    vec4 a = texture2D(uTex0, uv + vec2(push * m, 0.0));
    vec4 b = texture2D(uTex1, uv - vec2(push * (1.0 - m), 0.0));
    vec3 col = mix(a.rgb, b.rgb, m);
    // light the folds
    col *= 0.86 + vShade * 0.75;
    // soft vignette
    float v = smoothstep(1.15, 0.35, length(vUv - 0.5) * 1.4);
    col *= mix(0.55, 1.0, v);
    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`

export default function ClothScene({ images, active }) {
  const loaded = useTexture(images)
  const textures = useMemo(() => {
    loaded.forEach((t) => {
      t.colorSpace = THREE.SRGBColorSpace
      t.anisotropy = 8
    })
    return loaded
  }, [loaded])

  const { viewport } = useThree()
  const w = viewport.width
  const h = viewport.height
  const mat = useRef(null)
  const hover = useRef(0)
  const mouse = useMemo(() => new THREE.Vector2(0.5, 0.5), [])
  const track = useRef({ from: active, to: active, p: 1 })

  const uniforms = useMemo(
    () => ({
      uTex0: { value: textures[active] },
      uTex1: { value: textures[active] },
      uProgress: { value: 1 },
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uHover: { value: 0 },
      uPlaneAspect: { value: 1 },
      uImgAspect: { value: IMG_ASPECT },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [textures],
  )

  useEffect(() => {
    const s = track.current
    if (active === s.to) return
    s.from = s.p > 0.5 ? s.to : s.from
    s.to = active
    s.p = 0
    uniforms.uTex0.value = textures[s.from]
    uniforms.uTex1.value = textures[s.to]
  }, [active, textures, uniforms])

  useFrame((state, dt) => {
    const s = track.current
    s.p = Math.min(1, s.p + dt * 0.75)
    const u = uniforms
    u.uProgress.value = s.p
    u.uTime.value += dt
    u.uPlaneAspect.value = w / h
    mouse.set(state.pointer.x * 0.5 + 0.5, state.pointer.y * 0.5 + 0.5)
    u.uMouse.value.lerp(mouse, 1 - Math.exp(-dt * 6))
    u.uHover.value += (hover.current - u.uHover.value) * (1 - Math.exp(-dt * 4))
  })

  return (
    <mesh
      onPointerEnter={() => (hover.current = 1)}
      onPointerLeave={() => (hover.current = 0)}
      scale={[1, 1, 1]}
    >
      <planeGeometry args={[w * 1.04, h * 1.04, 96, 64]} />
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        vertexShader={vertex}
        fragmentShader={fragment}
        toneMapped={false}
      />
    </mesh>
  )
}
