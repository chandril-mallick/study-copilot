import React, { useEffect, useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Float, Stars } from '@react-three/drei';
import * as THREE from 'three';
import './SplashScreen.css';
import DabbaBotLogo from './DabbaBotLogo';

// Loading phases shown as progress advances
const PHASES = [
  "Awakening Neural Core...",
  "Loading Knowledge Synapse...",
  "Calibrating DABBA AI Intelligence...",
  "Establishing Secure Link...",
  "Launching DABBA AI...",
];

// ── 3D Scene: rotating ring + floating particles + ambient ──
function Scene3D({ exiting }) {
  const ringRef = useRef();
  const particlesRef = useRef();

  const particleCount = 1200;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const cyan = new THREE.Color('#00D9FF');
  const emerald = new THREE.Color('#10B981');
  const white = new THREE.Color('#ffffff');

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 40;
    positions[i3 + 1] = (Math.random() - 0.5) * 40;
    positions[i3 + 2] = (Math.random() - 0.5) * 40;
    const c = i % 3 === 0 ? cyan : i % 3 === 1 ? emerald : white;
    colors[i3] = c.r;
    colors[i3 + 1] = c.g;
    colors[i3 + 2] = c.b;
  }

  return (
    <>
      <color attach="background" args={['#050508']} />
      <fog attach="fog" args={['#050508', 8, 28]} />
      <ambientLight intensity={0.25} />
      <pointLight position={[0, 2, 4]} intensity={1.2} color="#00D9FF" />
      <pointLight position={[-3, -1, 2]} intensity={0.6} color="#10B981" />

      {/* Central glowing ring */}
      <Float speed={0.8} rotationIntensity={0.2} floatIntensity={0.4}>
        <mesh ref={ringRef} rotation={[Math.PI / 2.2, 0, 0]}>
          <torusGeometry args={[1.8, 0.06, 32, 64]} />
          <meshBasicMaterial
            color="#00D9FF"
            transparent
            opacity={0.5}
          />
        </mesh>
      </Float>

      {/* Inner ring */}
      <Float speed={1} rotationIntensity={0.3} floatIntensity={0.2}>
        <mesh rotation={[Math.PI / 2.2, 0, Math.PI / 4]}>
          <torusGeometry args={[1.2, 0.03, 16, 48]} />
          <meshBasicMaterial
            color="#10B981"
            transparent
            opacity={0.4}
          />
        </mesh>
      </Float>

      {/* Particle field */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particleCount}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.04}
          vertexColors
          transparent
          opacity={0.85}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Distant starfield */}
      <Stars
        radius={25}
        depth={20}
        count={800}
        factor={2}
        saturation={0.4}
        fade
        speed={exiting ? 2 : 0.5}
      />
    </>
  );
}

const SplashScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [phaseKey, setPhaseKey] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [stage, setStage] = useState(0); // 0: logo, 1: wordmark, 2: progress
  const completedRef = useRef(false);

  // Drive the progress bar
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 1.4;
      });
    }, 30);
    return () => clearInterval(timer);
  }, []);

  // Staged reveal
  useEffect(() => {
    const t = setTimeout(() => setStage(1), 600);
    const t2 = setTimeout(() => setStage(2), 1200);
    return () => { clearTimeout(t); clearTimeout(t2); };
  }, []);

  // Update phase text every ~20% of progress
  useEffect(() => {
    const idx = Math.min(
      Math.floor((progress / 100) * PHASES.length),
      PHASES.length - 1
    );
    if (idx !== phaseIndex) {
      setPhaseIndex(idx);
      setPhaseKey((k) => k + 1);
    }
  }, [progress, phaseIndex]);

  // Trigger cinematic exit when done
  useEffect(() => {
    if (progress >= 100 && !completedRef.current) {
      completedRef.current = true;
      setTimeout(() => {
        setExiting(true);
        setTimeout(() => onComplete(), 900);
      }, 500);
    }
  }, [progress, onComplete]);

  return (
    <div
      className="splash-wrap"
      data-exiting={exiting}
    >
      {/* ── Full-screen 3D canvas ── */}
      <div className="splash-canvas-wrap">
        <Canvas
          camera={{ position: [0, 0, 6], fov: 50 }}
          dpr={[1, 1.2]}
          gl={{ 
            antialias: false, 
            alpha: false,
            powerPreference: "low-power"
          }}
        >
          <Scene3D exiting={exiting} />
        </Canvas>
      </div>

      {/* ── Gradient vignette overlay ── */}
      <div className="splash-vignette" aria-hidden />

      {/* ── Subtle grid overlay ── */}
      <div className="splash-grid" aria-hidden />

      {/* ── Main content overlay ── */}
      <div className="splash-content">
        {/* Logo + 3D-style card */}
        <div
          className="splash-logo-block"
          data-stage={stage >= 0 ? 'on' : 'off'}
        >
          <div className="splash-logo-glow" style={{ background: 'rgba(0, 255, 136, 0.4)' }} />
          <div className="splash-logo-ring-3d" style={{ borderColor: 'rgba(0, 255, 136, 0.2)' }}>
            <div className="splash-logo-enter flex items-center justify-center">
              <DabbaBotLogo iconOnly className="scale-[1.8]" />
            </div>
          </div>
        </div>

        {/* Wordmark */}
        <div
          className="splash-wordmark"
          data-stage={stage >= 1 ? 'on' : 'off'}
        >
          <h1 className="splash-title">
            DABBA<span className="splash-shimmer-text" style={{ color: '#00FF88' }}> AI</span>
          </h1>
          <p className="splash-tagline">
            Next-Gen Neural Intelligence for Institutions
          </p>
        </div>

        {/* Loading bar */}
        <div
          className="splash-progress-block"
          data-stage={stage >= 2 ? 'on' : 'off'}
        >
          <div className="splash-progress-track">
            <div
              className="splash-progress-fill"
              style={{ width: `${Math.min(progress, 100)}%`, background: '#00FF88' }}
            />
            {progress < 100 && (
              <div
                className="splash-progress-rider"
                style={{ left: `calc(${Math.min(progress, 98)}% - 16px)`, background: '#00FF88' }}
              />
            )}
          </div>
          <div className="splash-progress-meta">
            <p key={phaseKey} className="splash-phase-text">
              {PHASES[phaseIndex]}
            </p>
            <span className="splash-percent">{Math.min(Math.round(progress), 100)}%</span>
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="splash-footer">
        <p className="splash-footer-line">POWERED BY NEURAL INTELLIGENCE</p>
        <p className="splash-footer-sub">© 2026 DABBA AI · By Chandril Mallick</p>
      </div>
    </div>
  );
};

export default SplashScreen;
