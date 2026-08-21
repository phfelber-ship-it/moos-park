"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, ContactShadows, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import {
  TIER_ORDER,
  buildBackTexture,
  buildFrontTexture,
} from "@/lib/club-card-texture";

// Hochwertige 3D-Produktanimation der Clubcard: die Karte schwebt/dreht
// sich langsam im Raum, alle 6s ein "Flip" auf die naechste Stufe (Bronze
// -> Silber -> Gold -> Premium -> ...), die Kamera faehrt dabei zwischen
// einer weiten Ansicht und einem Close-up auf Chip/Logo. Karteninhalt
// (Logo, Farben, Schrift, Proportionen) kommt 1:1 aus club-card-texture.ts
// - dieselbe Quelle wie das 2D-Kartendesign im Hero, nichts wird hier neu
// erfunden oder verzerrt.
const CYCLE_SECONDS = 6;
const FLIP_SECONDS = 1.1;

function CardMesh() {
  const groupRef = useRef<THREE.Group>(null);
  const logoRef = useRef<HTMLImageElement | null>(null);
  const tierIndexRef = useRef(0);
  const hasSwappedRef = useRef(false);
  const [frontTexture, setFrontTexture] = useState<THREE.CanvasTexture | null>(null);
  const [backTexture, setBackTexture] = useState<THREE.CanvasTexture | null>(null);

  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.src = "/images/logo.png";
    img.onload = () => {
      if (cancelled) return;
      logoRef.current = img;
      setFrontTexture(buildFrontTexture(TIER_ORDER[0], img));
      setBackTexture(buildBackTexture(TIER_ORDER[0], img));
    };
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    return () => {
      frontTexture?.dispose();
      backTexture?.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const swapToTier = (index: number) => {
    const logo = logoRef.current;
    if (!logo) return;
    const tier = TIER_ORDER[index];
    setFrontTexture((prev) => {
      prev?.dispose();
      return buildFrontTexture(tier, logo);
    });
    setBackTexture((prev) => {
      prev?.dispose();
      return buildBackTexture(tier, logo);
    });
  };

  useFrame((state) => {
    const group = groupRef.current;
    if (!group) return;
    const t = state.clock.getElapsedTime();

    const cyclePos = t % CYCLE_SECONDS;
    const currentIndex = Math.floor(t / CYCLE_SECONDS) % TIER_ORDER.length;

    let flipExtra = 0;
    const flipStart = CYCLE_SECONDS - FLIP_SECONDS;
    if (cyclePos > flipStart) {
      const p = (cyclePos - flipStart) / FLIP_SECONDS;
      flipExtra = p * Math.PI;
      if (p > 0.5 && !hasSwappedRef.current) {
        const nextIndex = (currentIndex + 1) % TIER_ORDER.length;
        swapToTier(nextIndex);
        tierIndexRef.current = nextIndex;
        hasSwappedRef.current = true;
      }
    } else {
      hasSwappedRef.current = false;
    }

    group.rotation.y = t * 0.18 + flipExtra;
    group.rotation.x = Math.sin(t * 0.35) * 0.09;
    group.rotation.z = Math.sin(t * 0.22) * 0.03;
    group.position.y = Math.sin(t * 0.5) * 0.09;
  });

  if (!frontTexture || !backTexture) return null;

  return (
    <group ref={groupRef}>
      <RoundedBox args={[1.6, 1, 0.045]} radius={0.055} smoothness={4} castShadow receiveShadow>
        <meshPhysicalMaterial
          color="#0b0b0b"
          metalness={0.55}
          roughness={0.45}
          clearcoat={0.4}
          clearcoatRoughness={0.3}
        />
      </RoundedBox>
      <mesh position={[0, 0, 0.024]}>
        <planeGeometry args={[1.56, 0.96]} />
        <meshPhysicalMaterial
          map={frontTexture}
          metalness={0.35}
          roughness={0.32}
          clearcoat={0.85}
          clearcoatRoughness={0.18}
        />
      </mesh>
      <mesh position={[0, 0, -0.024]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[1.56, 0.96]} />
        <meshPhysicalMaterial
          map={backTexture}
          metalness={0.3}
          roughness={0.5}
          clearcoat={0.4}
        />
      </mesh>
    </group>
  );
}

// Langsame filmische Kamerafahrt: meist eine weite, umkreisende Ansicht,
// alle 12s kurz ein Close-up in Richtung Chip/Logo.
function CameraRig() {
  const target = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    const camera = state.camera;
    const t = state.clock.getElapsedTime();
    const camCycle = 12;
    const pos = t % camCycle;
    const closeUp = pos > camCycle - 3.5;

    const wideRadius = 4.4;
    const closeRadius = 2.1;
    const radius = THREE.MathUtils.lerp(
      wideRadius,
      closeRadius,
      closeUp ? Math.min(1, (pos - (camCycle - 3.5)) / 1.2) : 0
    );
    const angle = t * 0.12;
    const height = 0.35 + Math.sin(t * 0.18) * 0.35;

    camera.position.x = Math.sin(angle) * radius;
    camera.position.z = Math.cos(angle) * radius;
    camera.position.y = height - (closeUp ? 0.15 : 0);

    target.set(closeUp ? 0.28 : 0, closeUp ? 0.05 : 0, closeUp ? 0.05 : 0);
    camera.lookAt(target);
  });

  return null;
}

export default function ClubCard3D() {
  return (
    <div className="relative mx-auto h-[340px] w-full max-w-2xl sm:h-[420px]">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 0.3, 4.4], fov: 32 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={["#0a0a0a"]} />
        <fog attach="fog" args={["#0a0a0a", 6, 11]} />
        <ambientLight intensity={0.45} />
        <directionalLight
          position={[3, 4, 4]}
          intensity={1.4}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <directionalLight position={[-3, -1, -3]} intensity={0.4} color="#b9cead" />
        <Environment preset="studio" environmentIntensity={0.7} />

        <CardMesh />
        <CameraRig />

        <ContactShadows
          position={[0, -0.62, 0]}
          opacity={0.55}
          scale={6}
          blur={2.6}
          far={2}
        />
      </Canvas>
    </div>
  );
}
