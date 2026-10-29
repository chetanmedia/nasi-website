import * as THREE from 'three'
import { useMemo, useRef, useLayoutEffect } from 'react'
import { useFrame } from '@react-three/fiber'

/* Procedural, low-poly-but-glossy ingredients. All sizes in scene units (phone is ~2 units tall). */

export function Tomato({ s = 1, ...p }) {
  const calyx = useMemo(() => {
    const sh = new THREE.Shape()
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2, r = i % 2 ? 0.07 : 0.2
      const x = Math.cos(a) * r, y = Math.sin(a) * r
      i ? sh.lineTo(x, y) : sh.moveTo(x, y)
    }
    sh.closePath()
    return new THREE.ShapeGeometry(sh)
  }, [])
  return (
    <group scale={s} {...p}>
      <mesh scale={[1, 0.82, 1]}>
        <sphereGeometry args={[0.36, 48, 32]} />
        <meshPhysicalMaterial color="#E0432B" roughness={0.22} clearcoat={1} clearcoatRoughness={0.12} sheen={0.3} />
      </mesh>
      <mesh geometry={calyx} position={[0, 0.292, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#4E7A2E" side={THREE.DoubleSide} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.34, 0]}>
        <cylinderGeometry args={[0.022, 0.03, 0.1, 10]} />
        <meshStandardMaterial color="#4E7A2E" roughness={0.6} />
      </mesh>
    </group>
  )
}

export function Chili({ s = 1, color = '#D2301F', ...p }) {
  const geo = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.5, 0), new THREE.Vector3(0.06, 0.2, 0.02), new THREE.Vector3(0.02, -0.15, 0), new THREE.Vector3(-0.12, -0.42, -0.02)
    ])
    const g = new THREE.TubeGeometry(curve, 64, 0.1, 20, false)
    // taper toward the tip
    const pos = g.attributes.position, n = 65, rs = 21
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1), c = curve.getPointAt(t), k = Math.pow(1 - t, 0.55) * 0.95 + 0.05
      for (let j = 0; j < rs; j++) {
        const idx = i * rs + j
        pos.setXYZ(idx, c.x + (pos.getX(idx) - c.x) * k, c.y + (pos.getY(idx) - c.y) * k, c.z + (pos.getZ(idx) - c.z) * k)
      }
    }
    g.computeVertexNormals()
    return g
  }, [])
  return (
    <group scale={s} {...p}>
      <mesh geometry={geo}>
        <meshPhysicalMaterial color={color} roughness={0.18} clearcoat={1} clearcoatRoughness={0.08} />
      </mesh>
      <mesh position={[0, 0.53, 0]}>
        <cylinderGeometry args={[0.1, 0.08, 0.07, 16]} />
        <meshStandardMaterial color="#4E7A2E" roughness={0.5} />
      </mesh>
      <mesh position={[0.02, 0.64, 0]} rotation={[0, 0, -0.3]}>
        <cylinderGeometry args={[0.018, 0.024, 0.18, 8]} />
        <meshStandardMaterial color="#5C8A35" roughness={0.5} />
      </mesh>
    </group>
  )
}

export function Garlic({ s = 1, ...p }) {
  const geo = useMemo(() => {
    const pts = []
    for (let i = 0; i <= 24; i++) {
      const t = i / 24, y = -0.3 + t * 0.62
      const r = Math.sin(Math.pow(t, 0.75) * Math.PI) * 0.3 * (1 - Math.pow(t, 3) * 0.75) + (t > 0.92 ? 0.01 : 0)
      pts.push(new THREE.Vector2(Math.max(r, 0.004), y))
    }
    return new THREE.LatheGeometry(pts, 48)
  }, [])
  return (
    <group scale={s} {...p}>
      <mesh geometry={geo} scale={[1, 1, 0.92]}>
        <meshPhysicalMaterial color="#F4ECDD" roughness={0.45} sheen={1} sheenColor="#f3d9c9" clearcoat={0.3} />
      </mesh>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <mesh key={i} rotation={[0, (i / 6) * Math.PI * 2, 0]} position={[0, 0, 0]}>
          <torusGeometry args={[0.24, 0.004, 4, 40, Math.PI * 0.6]} />
          <meshBasicMaterial color="#E4C9B8" />
        </mesh>
      ))}
    </group>
  )
}

function lemonTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 256
  const g = c.getContext('2d')
  g.fillStyle = '#F7D23A'; g.beginPath(); g.arc(128, 128, 128, 0, 7); g.fill()
  g.fillStyle = '#FBF2C9'; g.beginPath(); g.arc(128, 128, 112, 0, 7); g.fill()
  for (let i = 0; i < 10; i++) {
    const a0 = (i / 10) * Math.PI * 2 + 0.06, a1 = ((i + 1) / 10) * Math.PI * 2 - 0.06
    const gr = g.createRadialGradient(128, 128, 10, 128, 128, 104)
    gr.addColorStop(0, '#FBE57E'); gr.addColorStop(1, '#F5CE2E')
    g.fillStyle = gr; g.beginPath(); g.moveTo(128 + Math.cos((a0 + a1) / 2) * 10, 128 + Math.sin((a0 + a1) / 2) * 10)
    g.arc(128, 128, 102, a0, a1); g.closePath(); g.fill()
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace
  return t
}
export function LemonSlice({ s = 1, ...p }) {
  const tex = useMemo(lemonTexture, [])
  return (
    <mesh scale={s} {...p}>
      <cylinderGeometry args={[0.36, 0.36, 0.07, 48]} />
      <meshPhysicalMaterial attach="material-0" color="#F2C928" roughness={0.35} clearcoat={0.6} />
      <meshPhysicalMaterial attach="material-1" map={tex} roughness={0.25} clearcoat={1} transmission={0} />
      <meshPhysicalMaterial attach="material-2" map={tex} roughness={0.25} clearcoat={1} />
    </mesh>
  )
}

export function Leaf({ s = 1, color = '#3F7A2C', ...p }) {
  const geo = useMemo(() => {
    const sh = new THREE.Shape()
    sh.moveTo(0, -0.5)
    sh.bezierCurveTo(0.34, -0.3, 0.32, 0.25, 0, 0.5)
    sh.bezierCurveTo(-0.32, 0.25, -0.34, -0.3, 0, -0.5)
    const g = new THREE.ShapeGeometry(sh, 24)
    const pos = g.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i)
      pos.setZ(i, -x * x * 0.9 + Math.sin(y * 2.4) * 0.05)
    }
    g.computeVertexNormals()
    return g
  }, [])
  return (
    <group scale={s} {...p}>
      <mesh geometry={geo}>
        <meshPhysicalMaterial color={color} roughness={0.35} clearcoat={0.7} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0, 0.004]}>
        <boxGeometry args={[0.012, 0.95, 0.004]} />
        <meshBasicMaterial color="#6FA34E" />
      </mesh>
    </group>
  )
}

export function Peppercorn({ s = 1, ...p }) {
  return (
    <mesh scale={s} {...p}>
      <icosahedronGeometry args={[0.07, 2]} />
      <meshStandardMaterial color="#2E2420" roughness={0.9} flatShading />
    </mesh>
  )
}

/** Instanced rice grains that drift and tumble inside a box. */
export function RiceField({ count = 140, box = [8, 6, 3], speed = 1, color = '#FFF8EC', fall = true, ...p }) {
  const ref = useRef()
  const parts = useMemo(
    () => Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * box[0], y: (Math.random() - 0.5) * box[1], z: (Math.random() - 0.5) * box[2],
      rx: Math.random() * 6, ry: Math.random() * 6, vr: (Math.random() - 0.5) * 1.5, vy: 0.1 + Math.random() * 0.25, s: 0.75 + Math.random() * 0.5, ph: Math.random() * 6
    })),
    [count]
  )
  const d = useMemo(() => new THREE.Object3D(), [])
  const write = (t) => {
    parts.forEach((q, i) => {
      d.position.set(q.x + Math.sin(t * 0.5 + q.ph) * 0.08, q.y, q.z)
      d.rotation.set(q.rx, q.ry, 0)
      d.scale.set(0.028 * q.s, 0.075 * q.s, 0.028 * q.s)
      d.updateMatrix(); ref.current.setMatrixAt(i, d.matrix)
    })
    ref.current.instanceMatrix.needsUpdate = true
  }
  useLayoutEffect(() => write(0), [])
  useFrame((st, dt) => {
    const k = Math.min(dt, 0.05) * speed
    parts.forEach((q) => {
      if (fall) { q.y -= q.vy * k; if (q.y < -box[1] / 2) { q.y = box[1] / 2; q.x = (Math.random() - 0.5) * box[0] } }
      q.rx += q.vr * k; q.ry += q.vr * 0.7 * k
    })
    write(st.clock.elapsedTime)
  })
  return (
    <instancedMesh ref={ref} args={[null, null, count]} {...p}>
      <sphereGeometry args={[1, 10, 8]} />
      <meshPhysicalMaterial color={color} roughness={0.35} sheen={0.6} clearcoat={0.4} />
    </instancedMesh>
  )
}

export function Carrot({ s = 1, ...p }) {
  const geo = useMemo(() => {
    const pts = []
    for (let i = 0; i <= 30; i++) {
      const t = i / 30, y = -0.75 + t * 1.5
      const r = 0.012 + Math.pow(t, 0.7) * 0.17 * (t > 0.94 ? 1 - (t - 0.94) * 9 : 1) + Math.sin(t * 40) * 0.004
      pts.push(new THREE.Vector2(Math.max(r, 0.005), y))
    }
    return new THREE.LatheGeometry(pts, 40)
  }, [])
  return (
    <group scale={s} {...p}>
      <mesh geometry={geo}>
        <meshPhysicalMaterial color="#F07A1F" roughness={0.35} clearcoat={0.6} clearcoatRoughness={0.3} />
      </mesh>
      {[-0.5, 0, 0.5, 0.95].map((a, i) => (
        <mesh key={i} position={[Math.sin(a) * 0.05, 0.98, Math.cos(a) * 0.03]} rotation={[0, a * 2, a * 0.6]}>
          <coneGeometry args={[0.05, 0.5, 6]} />
          <meshStandardMaterial color={i % 2 ? '#3E8A2E' : '#56A33A'} roughness={0.6} />
        </mesh>
      ))}
    </group>
  )
}

export function SteamPuff({ s = 1, ...p }) {
  return (
    <mesh scale={s} {...p}>
      <sphereGeometry args={[0.3, 24, 16]} />
      <meshStandardMaterial color="#ffffff" transparent opacity={0.08} roughness={1} />
    </mesh>
  )
}
