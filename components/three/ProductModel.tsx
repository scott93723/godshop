"use client";

import { useRef, type ReactNode } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";

type V3 = [number, number, number];

export type ProductModelProps = {
  type: string;
  color?: string;
  exploded?: boolean;
};

type SubProps = { color: string; exploded: boolean };

const DARK = "#0d0d1a";

/** Dark-tinted version of the accent hex, used for metal bodies. */
function tint(hex: string, toward = DARK, amount = 0.55): string {
  return (
    "#" +
    new THREE.Color(hex).lerp(new THREE.Color(toward), amount).getHexString()
  );
}

/* ---------- shared materials ---------- */

function BodyMat({ color }: { color: string }) {
  return (
    <meshStandardMaterial
      color={tint(color)}
      metalness={0.8}
      roughness={0.3}
    />
  );
}

function DarkMat() {
  return <meshStandardMaterial color={DARK} metalness={0.85} roughness={0.35} />;
}

function AccentMat({ color }: { color: string }) {
  return <meshStandardMaterial color={color} metalness={0.7} roughness={0.28} />;
}

function ScreenMat({ color }: { color: string }) {
  return (
    <meshStandardMaterial
      color="#02020a"
      emissive={color}
      emissiveIntensity={1.2}
      metalness={0.1}
      roughness={0.4}
    />
  );
}

function GlowMat({ color, intensity = 1.6 }: { color: string; intensity?: number }) {
  return (
    <meshStandardMaterial
      color={color}
      emissive={color}
      emissiveIntensity={intensity}
      toneMapped={false}
    />
  );
}

/* ---------- exploded-view part wrapper ---------- */

function Part({
  at,
  explode,
  exploded,
  rotation,
  children,
}: {
  at: V3;
  explode?: V3;
  exploded?: boolean;
  rotation?: V3;
  children: ReactNode;
}) {
  const ref = useRef<THREE.Group>(null!);
  useFrame((_, delta) => {
    const g = ref.current;
    const k = 1 - Math.exp(-5 * delta); // framerate-independent ease
    const tx = exploded && explode ? at[0] + explode[0] : at[0];
    const ty = exploded && explode ? at[1] + explode[1] : at[1];
    const tz = exploded && explode ? at[2] + explode[2] : at[2];
    g.position.x += (tx - g.position.x) * k;
    g.position.y += (ty - g.position.y) * k;
    g.position.z += (tz - g.position.z) * k;
  });
  return (
    <group ref={ref} position={at} rotation={rotation}>
      {children}
    </group>
  );
}

/* ---------- 1. phone ---------- */

function PhoneModel({ color, exploded }: SubProps) {
  return (
    <group>
      <Part at={[0, 0, 0]} exploded={exploded}>
        <RoundedBox args={[0.78, 1.6, 0.09]} radius={0.05} smoothness={4}>
          <BodyMat color={color} />
        </RoundedBox>
      </Part>
      <Part at={[0, 0, 0.048]} explode={[0, 0, 0.35]} exploded={exploded}>
        <RoundedBox args={[0.7, 1.5, 0.014]} radius={0.02} smoothness={4}>
          <ScreenMat color={color} />
        </RoundedBox>
      </Part>
      <Part at={[-0.16, 0.52, -0.055]} explode={[0, 0, -0.35]} exploded={exploded}>
        <RoundedBox args={[0.3, 0.34, 0.04]} radius={0.02} smoothness={4}>
          <DarkMat />
        </RoundedBox>
        {[-0.07, 0.08].map((dy) => (
          <mesh
            key={dy}
            position={[0, dy, -0.022]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry args={[0.062, 0.062, 0.025, 24]} />
            <meshStandardMaterial
              color="#000008"
              metalness={0.9}
              roughness={0.12}
            />
          </mesh>
        ))}
        <mesh position={[0.08, -0.1, -0.022]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 0.02, 12]} />
          <GlowMat color={color} intensity={0.8} />
        </mesh>
      </Part>
      {/* side accent buttons */}
      <Part at={[0.4, 0.3, 0]} explode={[0.15, 0, 0]} exploded={exploded}>
        <mesh>
          <boxGeometry args={[0.015, 0.16, 0.04]} />
          <AccentMat color={color} />
        </mesh>
      </Part>
    </group>
  );
}

/* ---------- 2. earbuds ---------- */

function EarbudsModel({ color, exploded }: SubProps) {
  return (
    <group>
      {/* case base */}
      <Part at={[0, -0.3, 0]} exploded={exploded}>
        <RoundedBox args={[1.15, 0.55, 0.85]} radius={0.12} smoothness={4}>
          <BodyMat color={color} />
        </RoundedBox>
        <mesh position={[0, 0.26, 0]}>
          <boxGeometry args={[0.95, 0.04, 0.65]} />
          <GlowMat color={color} intensity={0.8} />
        </mesh>
      </Part>
      {/* open lid */}
      <Part
        at={[0, 0.3, -0.42]}
        explode={[0, 0.4, -0.3]}
        exploded={exploded}
        rotation={[-1.05, 0, 0]}
      >
        <RoundedBox args={[1.15, 0.42, 0.85]} radius={0.1} smoothness={4}>
          <BodyMat color={color} />
        </RoundedBox>
      </Part>
      {/* buds */}
      {[-1, 1].map((s) => (
        <Part
          key={s}
          at={[s * 0.3, 0.16, 0.05]}
          explode={[s * 0.4, 0.55, 0]}
          exploded={exploded}
        >
          <mesh>
            <sphereGeometry args={[0.15, 24, 24]} />
            <AccentMat color={color} />
          </mesh>
          <mesh position={[0, -0.19, 0.03]} rotation={[0.15, 0, 0]}>
            <cylinderGeometry args={[0.045, 0.05, 0.3, 16]} />
            <AccentMat color={color} />
          </mesh>
          <mesh position={[0, -0.35, 0.06]}>
            <sphereGeometry args={[0.03, 12, 12]} />
            <GlowMat color={color} intensity={1.1} />
          </mesh>
        </Part>
      ))}
    </group>
  );
}

/* ---------- 3. watch ---------- */

function WatchModel({ color, exploded }: SubProps) {
  return (
    <group>
      {/* strap loop behind the case */}
      <Part at={[0, 0, -0.12]} explode={[0, 0, -0.55]} exploded={exploded}>
        <mesh rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.92, 0.12, 16, 48]} />
          <meshStandardMaterial
            color={tint(color, "#06060f", 0.45)}
            metalness={0.2}
            roughness={0.7}
          />
        </mesh>
      </Part>
      {/* case */}
      <Part at={[0, 0, 0]} exploded={exploded}>
        <RoundedBox args={[0.85, 1.0, 0.28]} radius={0.16} smoothness={6}>
          <BodyMat color={color} />
        </RoundedBox>
      </Part>
      {/* dial */}
      <Part at={[0, 0, 0.15]} explode={[0, 0, 0.42]} exploded={exploded}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.33, 0.33, 0.02, 32]} />
          <ScreenMat color={color} />
        </mesh>
        <mesh>
          <torusGeometry args={[0.37, 0.018, 12, 44]} />
          <GlowMat color={color} />
        </mesh>
      </Part>
      {/* crown */}
      <Part at={[0.46, 0.12, 0]} explode={[0.25, 0, 0]} exploded={exploded}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.06, 0.06, 0.09, 16]} />
          <AccentMat color={color} />
        </mesh>
      </Part>
    </group>
  );
}

/* ---------- 4. laptop ---------- */

function LaptopModel({ color, exploded }: SubProps) {
  return (
    <group position={[0, -0.35, 0]}>
      {/* base */}
      <Part at={[0, 0, 0]} exploded={exploded}>
        <RoundedBox args={[1.8, 0.08, 1.15]} radius={0.03} smoothness={4}>
          <BodyMat color={color} />
        </RoundedBox>
      </Part>
      {/* keyboard deck */}
      <Part at={[0, 0.055, 0.08]} explode={[0, 0.3, 0]} exploded={exploded}>
        <mesh>
          <boxGeometry args={[1.55, 0.02, 0.82]} />
          <meshStandardMaterial
            color="#0a0a16"
            emissive={color}
            emissiveIntensity={0.25}
            metalness={0.6}
            roughness={0.5}
          />
        </mesh>
      </Part>
      {/* screen assembly, hinged open ~100° */}
      <Part
        at={[0, 0.04, -0.55]}
        explode={[0, 0.55, -0.25]}
        exploded={exploded}
        rotation={[-1.75, 0, 0]}
      >
        <group position={[0, 0.56, 0]}>
          <RoundedBox args={[1.8, 1.12, 0.05]} radius={0.02} smoothness={4}>
            <BodyMat color={color} />
          </RoundedBox>
          <mesh position={[0, 0, 0.033]}>
            <boxGeometry args={[1.68, 1.0, 0.015]} />
            <ScreenMat color={color} />
          </mesh>
        </group>
      </Part>
    </group>
  );
}

/* ---------- 5. drone ---------- */

function Rotor({
  at,
  explode,
  exploded,
  color,
  speed,
}: {
  at: V3;
  explode: V3;
  exploded: boolean;
  color: string;
  speed: number;
}) {
  const spin = useRef<THREE.Group>(null!);
  useFrame((_, delta) => {
    spin.current.rotation.y += delta * speed;
  });
  return (
    <Part at={at} explode={explode} exploded={exploded}>
      <mesh>
        <cylinderGeometry args={[0.06, 0.07, 0.09, 16]} />
        <DarkMat />
      </mesh>
      <group ref={spin} position={[0, 0.07, 0]}>
        {[0, Math.PI / 2].map((r) => (
          <mesh key={r} rotation={[0, r, 0]}>
            <boxGeometry args={[0.56, 0.012, 0.05]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.7}
              metalness={0.5}
              roughness={0.4}
              transparent
              opacity={0.85}
            />
          </mesh>
        ))}
      </group>
    </Part>
  );
}

function DroneModel({ color, exploded }: SubProps) {
  const corners: { sx: 1 | -1; sz: 1 | -1; rot: number }[] = [
    { sx: 1, sz: 1, rot: Math.PI / 4 },
    { sx: -1, sz: 1, rot: -Math.PI / 4 },
    { sx: 1, sz: -1, rot: -Math.PI / 4 },
    { sx: -1, sz: -1, rot: Math.PI / 4 },
  ];
  return (
    <group>
      <Part at={[0, 0, 0]} exploded={exploded}>
        <RoundedBox args={[0.62, 0.2, 0.62]} radius={0.08} smoothness={4}>
          <BodyMat color={color} />
        </RoundedBox>
        {/* gimbal camera */}
        <mesh position={[0, -0.1, 0.3]}>
          <sphereGeometry args={[0.09, 20, 20]} />
          <meshStandardMaterial
            color="#05050f"
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
        <mesh position={[0, 0.11, 0]}>
          <boxGeometry args={[0.2, 0.02, 0.2]} />
          <GlowMat color={color} intensity={0.9} />
        </mesh>
      </Part>
      {corners.map(({ sx, sz, rot }, i) => (
        <group key={`${sx}${sz}`}>
          <Part
            at={[sx * 0.42, 0.02, sz * 0.42]}
            explode={[sx * 0.4, 0.1, sz * 0.4]}
            exploded={exploded}
            rotation={[0, rot, 0]}
          >
            <mesh>
              <boxGeometry args={[0.55, 0.05, 0.09]} />
              <DarkMat />
            </mesh>
          </Part>
          <Rotor
            at={[sx * 0.66, 0.08, sz * 0.66]}
            explode={[sx * 0.6, 0.2, sz * 0.6]}
            exploded={exploded}
            color={color}
            speed={i % 2 === 0 ? 14 : -14}
          />
        </group>
      ))}
    </group>
  );
}

/* ---------- 6. speaker ---------- */

function SpeakerModel({ color, exploded }: SubProps) {
  return (
    <group>
      {/* fabric body */}
      <Part at={[0, 0, 0]} exploded={exploded}>
        <mesh>
          <cylinderGeometry args={[0.42, 0.46, 1.25, 40]} />
          <meshStandardMaterial
            color={tint(color, DARK, 0.4)}
            metalness={0.15}
            roughness={0.75}
          />
        </mesh>
      </Part>
      {/* top cap + ring */}
      <Part at={[0, 0.66, 0]} explode={[0, 0.4, 0]} exploded={exploded}>
        <mesh>
          <cylinderGeometry args={[0.4, 0.42, 0.08, 40]} />
          <DarkMat />
        </mesh>
        <mesh position={[0, 0.045, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.3, 0.016, 10, 44]} />
          <GlowMat color={color} />
        </mesh>
      </Part>
      {/* base */}
      <Part at={[0, -0.66, 0]} explode={[0, -0.4, 0]} exploded={exploded}>
        <mesh>
          <cylinderGeometry args={[0.46, 0.48, 0.08, 40]} />
          <DarkMat />
        </mesh>
      </Part>
      {/* glow band */}
      <Part at={[0, -0.3, 0]} explode={[0, -0.12, 0]} exploded={exploded}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.45, 0.02, 10, 48]} />
          <GlowMat color={color} />
        </mesh>
      </Part>
      {/* front driver */}
      <Part at={[0, 0.15, 0.42]} explode={[0, 0, 0.32]} exploded={exploded}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.16, 0.16, 0.03, 28]} />
          <meshStandardMaterial
            color="#06060f"
            metalness={0.7}
            roughness={0.25}
          />
        </mesh>
        <mesh position={[0, 0, 0.02]}>
          <torusGeometry args={[0.16, 0.012, 8, 32]} />
          <GlowMat color={color} intensity={1.1} />
        </mesh>
      </Part>
    </group>
  );
}

/* ---------- 7. vr headset ---------- */

function VrModel({ color, exploded }: SubProps) {
  return (
    <group>
      {/* visor body */}
      <Part at={[0, 0, 0]} exploded={exploded}>
        <RoundedBox args={[1.4, 0.68, 0.62]} radius={0.22} smoothness={6}>
          <BodyMat color={color} />
        </RoundedBox>
      </Part>
      {/* glossy front panel */}
      <Part at={[0, 0, 0.31]} explode={[0, 0, 0.45]} exploded={exploded}>
        <RoundedBox args={[1.26, 0.54, 0.12]} radius={0.16} smoothness={6}>
          <meshPhysicalMaterial
            color="#08081a"
            metalness={0.4}
            roughness={0.08}
            clearcoat={1}
            clearcoatRoughness={0.1}
            emissive={color}
            emissiveIntensity={0.35}
          />
        </RoundedBox>
        <mesh position={[0, -0.19, 0.065]}>
          <boxGeometry args={[1.0, 0.03, 0.015]} />
          <GlowMat color={color} />
        </mesh>
      </Part>
      {/* head strap arc (horizontal, wrapping the back) */}
      <Part at={[0, 0, -0.15]} explode={[0, 0, -0.5]} exploded={exploded}>
        <group rotation={[Math.PI / 2, 0, 0]}>
          <mesh rotation={[0, 0, Math.PI * 0.9]}>
            <torusGeometry args={[0.72, 0.055, 12, 48, Math.PI * 1.25]} />
            <meshStandardMaterial
              color="#0a0a16"
              metalness={0.3}
              roughness={0.7}
            />
          </mesh>
        </group>
      </Part>
      {/* tracking cameras */}
      {[-1, 1].map((s) => (
        <Part
          key={s}
          at={[s * 0.5, 0.22, 0.31]}
          explode={[s * 0.2, 0.2, 0.3]}
          exploded={exploded}
        >
          <mesh>
            <sphereGeometry args={[0.045, 14, 14]} />
            <GlowMat color={color} intensity={1.2} />
          </mesh>
        </Part>
      ))}
    </group>
  );
}

/* ---------- 8. tablet ---------- */

function TabletModel({ color, exploded }: SubProps) {
  return (
    <group>
      <Part at={[0, 0, 0]} exploded={exploded}>
        <RoundedBox args={[1.15, 1.55, 0.06]} radius={0.04} smoothness={4}>
          <BodyMat color={color} />
        </RoundedBox>
        <mesh position={[0.42, 0.62, -0.033]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.015, 16]} />
          <DarkMat />
        </mesh>
      </Part>
      <Part at={[0, 0, 0.036]} explode={[0, 0, 0.32]} exploded={exploded}>
        <RoundedBox args={[1.05, 1.45, 0.012]} radius={0.02} smoothness={4}>
          <ScreenMat color={color} />
        </RoundedBox>
      </Part>
    </group>
  );
}

/* ---------- fallback core ---------- */

function CoreModel({ color }: SubProps) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((_, delta) => {
    ref.current.rotation.y += delta * 0.6;
    ref.current.rotation.x += delta * 0.2;
  });
  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[0.85, 0]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.4}
        wireframe
      />
    </mesh>
  );
}

/* ---------- entry ---------- */

export default function ProductModel({
  type,
  color = "#22d3ee",
  exploded = false,
}: ProductModelProps) {
  switch (type) {
    case "phone":
      return <PhoneModel color={color} exploded={exploded} />;
    case "earbuds":
      return <EarbudsModel color={color} exploded={exploded} />;
    case "watch":
      return <WatchModel color={color} exploded={exploded} />;
    case "laptop":
      return <LaptopModel color={color} exploded={exploded} />;
    case "drone":
      return <DroneModel color={color} exploded={exploded} />;
    case "speaker":
      return <SpeakerModel color={color} exploded={exploded} />;
    case "vr":
      return <VrModel color={color} exploded={exploded} />;
    case "tablet":
      return <TabletModel color={color} exploded={exploded} />;
    default:
      return <CoreModel color={color} exploded={exploded} />;
  }
}
