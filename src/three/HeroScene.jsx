import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { NightLights, Drift, PointerRig } from './common'
import { Tomato, Chili, Garlic, LemonSlice, Leaf, Peppercorn, RiceField, Carrot } from './Ingredients'

/* Ingredients orbit the (DOM) phone. The phone itself is HTML so the app UI stays pixel-sharp. */
export default function HeroScene({ active = true }) {
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 8], fov: 34 }} gl={{ antialias: true, alpha: true }}
      eventSource={document.getElementById('root')} eventPrefix="client" frameloop={active ? 'always' : 'never'}>
      <NightLights />
      <Suspense fallback={null}>
        <PointerRig tilt={0.22}>
          <Drift position={[-1.55, 1.45, 0.4]} speed={1.1} phase={0.4} spin={[0.15, 0.4, 0.05]}><Tomato s={0.95} /></Drift>
          <Drift position={[1.75, 1.6, 0]} speed={0.9} phase={1.8} spin={[0.1, 0.25, 0.15]}><Carrot s={0.95} rotation={[0.3, 0, -0.9]} /></Drift>
          <Drift position={[1.85, -1.35, 0.7]} speed={1.3} phase={2.6} spin={[0.2, 0.5, 0]}><Garlic s={0.9} /></Drift>
          <Drift position={[-1.7, -1.25, 0.3]} speed={0.8} phase={3.3} spin={[0.5, 0.2, 0.3]}><LemonSlice s={0.95} rotation={[1.1, 0, 0.3]} /></Drift>
          <Drift position={[-1.0, -2.15, 1]} speed={1.2} phase={0.9} spin={[0.2, 0.3, 0.4]}><Leaf s={0.6} rotation={[0.6, 0.2, 0.8]} /></Drift>
          <Drift position={[1.25, 2.3, -0.6]} speed={1} phase={4.1} spin={[0.3, 0.2, 0.5]}><Leaf s={0.45} color="#4C8B33" rotation={[-0.5, 0.4, -0.6]} /></Drift>
          <Drift position={[-2.0, 0.2, -0.8]} speed={0.95} phase={2.1} spin={[0.1, 0.3, 0.2]}><Chili s={0.85} rotation={[0.2, 0, 0.9]} /></Drift>
          {[[1.1, -2.3, 0.5], [-0.9, 2.4, 0.2], [2.2, 0.3, -0.4], [-2.3, 1.9, -1], [2.4, -2.1, -0.6], [-0.4, -2.6, 0.9]].map((q, i) => (
            <Drift key={i} position={q} speed={1.4} phase={i} spin={[1, 1, 0]}><Peppercorn s={0.9} /></Drift>
          ))}
          <RiceField count={110} box={[6, 6.5, 3]} position={[0, 0, -1]} />
        </PointerRig>
      </Suspense>
    </Canvas>
  )
}
