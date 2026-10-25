import React, { Suspense, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import GlassMirrorScene from './GlassMirrorScene'

function CanvasLoader() {
  return null
}

export default function GlassMirrorCanvas({ customName = 'ROHITH NAIDU' }) {
  const dpr = useMemo(() => {
    if (typeof window === 'undefined') return 1
    return [1, Math.min(window.devicePixelRatio || 1, 1.5)]
  }, [])

  return (
    <div
      className="hero-3d-canvas-wrapper"
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        pointerEvents: 'auto'
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 70 }}
        dpr={dpr}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance'
        }}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          inset: 0,
          pointerEvents: 'auto'
        }}
      >
        {/* Warm cream / amber lighting matching the portfolio design system */}
        <ambientLight intensity={1.1} color="#fff6eb" />
        <directionalLight position={[10, 10, 10]} intensity={0.7} color="#ffd4a3" />
        <directionalLight position={[-10, -5, 5]} intensity={0.5} color="#e1dcc9" />
        <directionalLight position={[0, -5, -5]} intensity={0.4} color="#8b6234" />
        <Suspense fallback={<CanvasLoader />}>
          <GlassMirrorScene customName={customName} />
        </Suspense>
      </Canvas>
    </div>
  )
}
