import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Float, Stars } from '@react-three/drei';
import * as THREE from 'three';

// Reusable 3D background scene for dashboard, login, and all app views
function SceneContent({ variant = 'default' }) {
  const particleCount = 800;
  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);
    const cyan = new THREE.Color('#00D9FF');
    const emerald = new THREE.Color('#10B981');
    const white = new THREE.Color('#ffffff');
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * 35;
      pos[i3 + 1] = (Math.random() - 0.5) * 35;
      pos[i3 + 2] = (Math.random() - 0.5) * 35;
      const c = i % 3 === 0 ? cyan : i % 3 === 1 ? emerald : white;
      col[i3] = c.r;
      col[i3 + 1] = c.g;
      col[i3 + 2] = c.b;
    }
    return { positions: pos, colors: col };
  }, []);

  return (
    <>
      <color attach="background" args={['#06080c']} />
      <fog attach="fog" args={['#06080c', 12, 32]} />
      <ambientLight intensity={0.2} />
      <pointLight position={[2, 1, 5]} intensity={0.8} color="#00D9FF" />
      <pointLight position={[-2, -1, 3]} intensity={0.4} color="#10B981" />

      {/* Floating rings */}
      <Float speed={0.5} rotationIntensity={0.15} floatIntensity={0.25}>
        <mesh rotation={[Math.PI / 2.3, 0, 0]}>
          <torusGeometry args={[2, 0.04, 24, 48]} />
          <meshBasicMaterial color="#00D9FF" transparent opacity={0.35} />
        </mesh>
      </Float>
      <Float speed={0.7} rotationIntensity={0.2} floatIntensity={0.15}>
        <mesh rotation={[Math.PI / 2.3, 0, Math.PI / 5]}>
          <torusGeometry args={[1.3, 0.025, 16, 40]} />
          <meshBasicMaterial color="#10B981" transparent opacity={0.3} />
        </mesh>
      </Float>

      {/* Particle field */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={particleCount} array={positions} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={particleCount} array={colors} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial
          size={0.035}
          vertexColors
          transparent
          opacity={0.6}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      <Stars radius={30} depth={25} count={600} factor={1.8} saturation={0.3} fade speed={0.3} />
    </>
  );
}

export default function Scene3DBackground({ variant = 'default', className = '', disabled = false }) {
  if (disabled) return null;
  
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 55 }}
        dpr={[1, 1.2]} // Lower DPR for background to save resources
        gl={{ 
          antialias: false,
          alpha: false,
          powerPreference: "low-power"
        }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener('webglcontextlost', (event) => {
            console.warn('[Background] WebGL context lost.');
          }, false);
          gl.domElement.addEventListener('webglcontextrestored', () => {
            console.log('[Background] WebGL context restored.');
          }, false);
        }}
      >
        <SceneContent variant={variant} />
      </Canvas>
    </div>
  );
}
