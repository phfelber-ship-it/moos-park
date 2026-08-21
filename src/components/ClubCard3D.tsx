"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, ContactShadows, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import {
  buildBackTexture,
  buildFrontTexture,
  type TierKey,
} from "@/lib/club-card-texture";

// Echte 3D-Version des urspruenglichen Karten-Faechers: die vier
// Clubcards (Bronze/Silber/Gold/Premium) sitzen zunaechst dicht
// uebereinander an einem gemeinsamen Drehpunkt, faechern sich dann wie
// ein aufgefaechertes Kartenspiel radial nach aussen auf, halten kurz
// und ziehen sich wieder zusammen - in Dauerschleife, je Karte leicht
// zeitversetzt. Gleiche Timing-/Winkel-Logik wie die fruehere
// CSS-Version (MemberCardsHero), nur als echte 3D-Objekte mit
// realistischen Materialien/Reflexionen gerendert. Kartendesign (Logo,
// Farben, Schrift, Proportionen) kommt 1:1 aus club-card-texture.ts.

type FanConfig = {
  tier: TierKey;
  angleDeg: number;
  delay: number;
};

const FAN_CARDS: FanConfig[] = [
  { tier: "silber", angleDeg: -42, delay: 0 },
  { tier: "bronze", angleDeg: -14, delay: 0.4 },
  { tier: "gold", angleDeg: 14, delay: 0.8 },
  { tier: "premium", angleDeg: 42, delay: 1.2 },
];

// Radius (Abstand vom Drehpunkt) waehrend der Schleife: eng zusammen ->
// beruehren -> weit aufgefaechert -> halten -> wieder eng zusammen.
const RADIUS_KEYFRAMES = [0.05, 0.05, 0.05, 1.05, 1.05, 0.05];
const ROTATE_JITTER_KEYFRAMES = [0, 0, 0, -2, 2, 0];
const SCALE_KEYFRAMES = [0.55, 0.65, 0.68, 1, 1, 0.55];
const OPACITY_KEYFRAMES = [0, 1, 1, 1, 1, 0.4];
const TIMES = [0, 0.16, 0.22, 0.45, 0.78, 1];
const CYCLE_SECONDS = 9;
// Drehpunkt: etwas unterhalb der Szenenmitte, Karten faechern nach oben
// und zur Seite auf (wie eine in der Hand gehaltene Kartenfaecher).
const PIVOT_Y = -0.12;

function easeInOutCubic(x: number) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

function interpKeyframes(values: number[], times: number[], p: number) {
  if (p <= times[0]) return values[0];
  if (p >= times[times.length - 1]) return values[values.length - 1];
  for (let i = 0; i < times.length - 1; i++) {
    if (p >= times[i] && p <= times[i + 1]) {
      const local = (p - times[i]) / (times[i + 1] - times[i]);
      const eased = easeInOutCubic(local);
      return values[i] + (values[i + 1] - values[i]) * eased;
    }
  }
  return values[values.length - 1];
}

function polarToXY(angleDeg: number, radius: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: radius * Math.sin(rad), y: PIVOT_Y + radius * Math.cos(rad) };
}

function FanCard({
  config,
  index,
  frontTexture,
  backTexture,
}: {
  config: FanConfig;
  index: number;
  frontTexture: THREE.CanvasTexture;
  backTexture: THREE.CanvasTexture;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const bodyMatRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const frontMatRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const backMatRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const baseZ = index * 0.028 - 0.042;

  useFrame((state) => {
    const group = groupRef.current;
    if (!group) return;
    const t = state.clock.getElapsedTime();
    const cyclePos = ((t + config.delay) % CYCLE_SECONDS) / CYCLE_SECONDS;

    const radius = interpKeyframes(RADIUS_KEYFRAMES, TIMES, cyclePos);
    const jitter = interpKeyframes(ROTATE_JITTER_KEYFRAMES, TIMES, cyclePos);
    const scale = interpKeyframes(SCALE_KEYFRAMES, TIMES, cyclePos);
    const opacity = interpKeyframes(OPACITY_KEYFRAMES, TIMES, cyclePos);

    const { x, y } = polarToXY(config.angleDeg, radius);
    group.position.x = x;
    group.position.y = y;
    group.position.z = baseZ;
    group.rotation.z = THREE.MathUtils.degToRad(config.angleDeg + jitter);
    group.rotation.y = THREE.MathUtils.degToRad(16 * Math.sin((t / 6) * Math.PI * 2));
    group.scale.setScalar(scale);

    if (bodyMatRef.current) bodyMatRef.current.opacity = opacity;
    if (frontMatRef.current) frontMatRef.current.opacity = opacity;
    if (backMatRef.current) backMatRef.current.opacity = opacity;
  });

  return (
    <group ref={groupRef}>
      <RoundedBox args={[1.6, 1, 0.045]} radius={0.055} smoothness={4} castShadow receiveShadow>
        <meshPhysicalMaterial
          ref={bodyMatRef}
          color="#0b0b0b"
          metalness={0.55}
          roughness={0.45}
          clearcoat={0.4}
          clearcoatRoughness={0.3}
          transparent
        />
      </RoundedBox>
      <mesh position={[0, 0, 0.024]}>
        <planeGeometry args={[1.56, 0.96]} />
        <meshPhysicalMaterial
          ref={frontMatRef}
          map={frontTexture}
          metalness={0.35}
          roughness={0.32}
          clearcoat={0.85}
          clearcoatRoughness={0.18}
          transparent
        />
      </mesh>
      <mesh position={[0, 0, -0.024]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[1.56, 0.96]} />
        <meshPhysicalMaterial
          ref={backMatRef}
          map={backTexture}
          metalness={0.3}
          roughness={0.5}
          clearcoat={0.4}
          transparent
        />
      </mesh>
    </group>
  );
}

function CameraSway() {
  useFrame((state) => {
    const camera = state.camera;
    const t = state.clock.getElapsedTime();
    camera.position.x = Math.sin(t * 0.15) * 0.18;
    camera.position.y = 0.15 + Math.sin(t * 0.11) * 0.08;
    camera.lookAt(0, PIVOT_Y * 0.4, 0);
  });
  return null;
}

export default function ClubCard3D() {
  const [logoImg, setLogoImg] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.src = "/images/logo.png";
    img.onload = () => {
      if (!cancelled) setLogoImg(img);
    };
    return () => {
      cancelled = true;
    };
  }, []);

  const textures = useMemo(() => {
    if (!logoImg) return null;
    const map = new Map<TierKey, { front: THREE.CanvasTexture; back: THREE.CanvasTexture }>();
    for (const { tier } of FAN_CARDS) {
      map.set(tier, {
        front: buildFrontTexture(tier, logoImg),
        back: buildBackTexture(tier, logoImg),
      });
    }
    return map;
  }, [logoImg]);

  useEffect(() => {
    return () => {
      textures?.forEach(({ front, back }) => {
        front.dispose();
        back.dispose();
      });
    };
  }, [textures]);

  return (
    <div className="relative mx-auto h-[340px] w-full max-w-3xl sm:h-[400px]">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 0.15, 5.2], fov: 34 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={["#0a0a0a"]} />
        <fog attach="fog" args={["#0a0a0a", 6.5, 12]} />
        <ambientLight intensity={0.45} />
        <directionalLight
          position={[3, 4, 4]}
          intensity={1.4}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <directionalLight position={[-3, -1, -3]} intensity={0.4} color="#b9cead" />
        <Environment preset="studio" environmentIntensity={0.7} />

        {textures &&
          FAN_CARDS.map((config, index) => {
            const pair = textures.get(config.tier);
            if (!pair) return null;
            return (
              <FanCard
                key={config.tier}
                config={config}
                index={index}
                frontTexture={pair.front}
                backTexture={pair.back}
              />
            );
          })}
        <CameraSway />

        <ContactShadows position={[0, -0.72, 0]} opacity={0.5} scale={7} blur={2.6} far={2} />
      </Canvas>
    </div>
  );
}
