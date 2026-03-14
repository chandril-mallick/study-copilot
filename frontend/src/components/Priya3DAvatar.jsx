import React, { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
// Static path from public folder to avoid Vite console noise
const priyaModelUrl = "/assets/3d/priya.glb";

/* ---------------------------
   Mouth morph detection
---------------------------- */

const MOUTH_MORPH_NAMES = [
  "mouthOpen",
  "mouth_open",
  "viseme_aa",
  "viseme_oh",
  "viseme_ee",
  "A",
  "E",
  "I",
  "O",
  "U",
  "aa",
  "oh",
  "ee",
  "ou",
  "ch",
  "pp",
];

function findMouthMorphIndices(mesh) {
  if (!mesh.morphTargetDictionary) return [];

  const dict = mesh.morphTargetDictionary;
  const indices = [];

  for (const name of Object.keys(dict)) {
    const lower = name.toLowerCase();

    if (MOUTH_MORPH_NAMES.some((m) => lower.includes(m))) {
      indices.push(dict[name]);
    }
  }

  return indices;
}

/* ---------------------------
   Priya Model
---------------------------- */

function PriyaModel({ isSpeaking, amplitudeRef }) {
  const { scene } = useGLTF(priyaModelUrl);

  const groupRef = useRef();
  const mouthMeshesRef = useRef([]);

  const clonedScene = useMemo(() => scene.clone(), [scene]);

  useMemo(() => {
    mouthMeshesRef.current = [];

    clonedScene.traverse((obj) => {
      if (obj.isMesh && obj.morphTargetInfluences) {
        const indices = findMouthMorphIndices(obj);

        if (indices.length > 0) {
          mouthMeshesRef.current.push({
            mesh: obj,
            indices,
          });
        }
      }
    });
  }, [clonedScene]);

  const ampRef = amplitudeRef ?? { current: 0 };

  useFrame(({ clock }, delta) => {
    const level = ampRef.current ?? 0;

    const targetLevel = isSpeaking
      ? level > 0
        ? level
        : 0.45 + Math.sin(Date.now() * 0.02) * 0.2
      : 0;

    /* mouth animation */

    mouthMeshesRef.current.forEach(({ mesh, indices }) => {
      indices.forEach((i) => {
        const current = mesh.morphTargetInfluences[i] ?? 0;

        mesh.morphTargetInfluences[i] =
          current + (targetLevel - current) * Math.min(1, delta * 12);
      });
    });

    /* idle animation */

    if (groupRef.current) {
      const t = clock.getElapsedTime();

      groupRef.current.rotation.y = Math.sin(t * 0.5) * 0.05;
      groupRef.current.rotation.z = Math.sin(t * 0.3) * 0.02;
      groupRef.current.rotation.x = Math.sin(t * 0.2) * 0.02;

      const breath = 1 + Math.sin(t * 1.5) * 0.01;

      groupRef.current.scale.set(
        1.35 * breath,
        1.35 * breath,
        1.35 * breath
      );

      if (isSpeaking) {
        groupRef.current.position.y = -0.45 + Math.sin(t * 8) * 0.01;
      }
    }
  });

  return (
    <group ref={groupRef} scale={1.35} position={[0, -0.105, 0]}>
      <primitive object={clonedScene} />
    </group>
  );
}

/* ---------------------------
   Avatar Canvas
---------------------------- */

export default function Priya3DAvatar({ isSpeaking, amplitudeRef = { current: 0 } }) {
  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{
          position: [0, 1.45, 1.6],
          fov: 28,
        }}
        shadows
        dpr={[1, 1.2]} // Further reduced from 1.5 to 1.2 for stability
        gl={{
          preserveDrawingBuffer: false, // Default to false for less memory usage
          powerPreference: "default", // Changed from high-performance to avoid GPU switching
          antialias: false,
          failIfMajorPerformanceCaveat: false 
        }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener('webglcontextlost', (event) => {
            event.preventDefault();
            console.warn('[Avatar] WebGL context lost.');
          }, false);
          
          gl.domElement.addEventListener('webglcontextrestored', () => {
            console.log('[Avatar] WebGL context restored.');
          }, false);
        }}
      >
        {/* background */}

        <color attach="background" args={["#020617"]} />

        {/* lighting */}

        <ambientLight intensity={0.9} />

        <spotLight
          position={[0, 4, 3]}
          intensity={2.2}
          angle={0.35}
          penumbra={1}
        />

        <directionalLight
          position={[3, 3, 2]}
          intensity={1.5}
          color="#bfdbfe"
        />

        <directionalLight
          position={[-3, 2, -2]}
          intensity={1.2}
          color="#22c55e"
        />

        <pointLight position={[0, 2, 2]} intensity={1} />

        {/* avatar */}

        <Suspense fallback={null}>
          <PriyaModel isSpeaking={isSpeaking} amplitudeRef={amplitudeRef} />
        </Suspense>

        {/* controls */}

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          target={[0, 1.4, 0]}
          minPolarAngle={Math.PI / 2.5}
          maxPolarAngle={Math.PI / 1.8}
          enableDamping
        />
      </Canvas>
    </div>
  );
}

/* preload model */

useGLTF.preload(priyaModelUrl);