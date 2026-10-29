import * as THREE from 'three'
import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'

/** Soft, warm, kitchen-window lighting. Lightformers keep everything offline (no HDR download). */
export function Lights({ intensity = 1 }) {
  return (
    <>
      <ambientLight intensity={0.75 * intensity} color="#fff3e2" />
      <directionalLight position={[3, 5, 4]} intensity={1.7 * intensity} color="#fff1dc" />
      <directionalLight position={[-4, 2, -2]} intensity={0.5 * intensity} color="#ffd9a0" />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={2.2} color="#fff6ea" position={[0, 4, 3]} scale={[8, 3, 1]} />
        <Lightformer form="rect" intensity={1.4} color="#ffd38a" position={[-5, 1, 1]} rotation-y={Math.PI / 2} scale={[6, 3, 1]} />
        <Lightformer form="rect" intensity={1} color="#ffffff" position={[5, 0, 2]} rotation-y={-Math.PI / 2} scale={[6, 4, 1]} />
        <Lightformer form="circle" intensity={1.5} color="#ffe2b0" position={[0, -3, 4]} scale={3} />
      </Environment>
    </>
  )
}

/** Night kitchen: warm key light from the stove side, cool navy rim like the app's backdrop. */
export function NightLights({ intensity = 1 }) {
  return (
    <>
      <ambientLight intensity={0.35 * intensity} color="#b9c8ff" />
      <directionalLight position={[3, 4, 5]} intensity={2.2 * intensity} color="#ffd9a6" />
      <directionalLight position={[-5, 1, -3]} intensity={1.6 * intensity} color="#5f8fe0" />
      <pointLight position={[0, -2, 3]} intensity={6 * intensity} distance={9} color="#ff9b4a" />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={1.6} color="#ffe2b8" position={[2, 4, 4]} scale={[6, 2, 1]} />
        <Lightformer form="rect" intensity={1.2} color="#4f7fd8" position={[-5, 1, 0]} rotation-y={Math.PI / 2} scale={[6, 4, 1]} />
        <Lightformer form="circle" intensity={1.2} color="#ff9f55" position={[0, -3, 4]} scale={3} />
      </Environment>
    </>
  )
}

/** Gentle self-rotation + bob, frame-rate independent. */
export function Drift({ speed = 1, amp = 0.12, spin = [0.2, 0.35, 0], phase = 0, children, ...p }) {
  const ref = useRef()
  useFrame((s, dt) => {
    const t = s.clock.elapsedTime * speed + phase
    if (!ref.current) return
    ref.current.position.y = Math.sin(t) * amp
    ref.current.rotation.x += spin[0] * Math.min(dt, 0.05)
    ref.current.rotation.y += spin[1] * Math.min(dt, 0.05)
    ref.current.rotation.z += spin[2] * Math.min(dt, 0.05)
  })
  return (
    <group {...p}>
      <group ref={ref}>{children}</group>
    </group>
  )
}

/** Eases a group from below into place and tilts it toward the pointer. */
export function PointerRig({ children, tilt = 0.25, intro = true, ...p }) {
  const ref = useRef()
  const born = useRef(intro ? 0 : 1)
  useFrame((s, dt) => {
    const k = Math.min(dt, 0.05)
    born.current = intro ? Math.min(1, s.clock.elapsedTime * 0.7) : 1
    const e = 1 - Math.pow(1 - born.current, 3)
    const g = ref.current
    g.position.y = (1 - e) * -2.4
    g.scale.setScalar(0.85 + 0.15 * e)
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, s.pointer.x * tilt + (1 - e) * -0.9, 3, k)
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -s.pointer.y * tilt * 0.5, 3, k)
  })
  return <group ref={ref} {...p}>{children}</group>
}

export function useReducedMotion() {
  const [rm, set] = useState(false)
  useEffect(() => {
    const m = matchMedia('(prefers-reduced-motion: reduce)')
    set(m.matches)
    const f = () => set(m.matches)
    m.addEventListener('change', f)
    return () => m.removeEventListener('change', f)
  }, [])
  return rm
}

export function hasWebGL() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch { return false }
}
