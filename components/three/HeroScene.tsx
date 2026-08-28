"use client";

import { Suspense, useRef, type ReactNode } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  Float,
  MeshDistortMaterial,
  Sparkles,
} from "@react-three/drei";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import ProductModel from "./ProductModel";

type V3 = [number, number, number];

/** Mouse-parallax rig: eases group rotation toward the pointer. */
function Rig({ children }: { children: ReactNode }) {
  const ref = useRef<THREE.Group>(null!);
  useFrame((state, delta) => {
    const g = ref.current;
    g.rotation.y = THREE.MathUtils.damp(
      g.rotation.y,
      state.pointer.x * 0.22,
      2.2,
      delta
    );
    g.rotation.x = THREE.MathUtils.damp(
      g.rotation.x,
      -state.pointer.y * 0.14,
      2.2,
      delta
    );
  });
  return <group ref={ref}>{children}</group>;
}

/** Slowly rotating wireframe torus-knot with distortion. */
function Centerpiece() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((_, delta) => {
    ref.current.rotation.y += delta * 0.25;
    ref.current.rotation.x += delta * 0.08;
  });
  return (
    <mesh ref={ref} position={[0, 0.35, -3.6]} scale={1.35}>
      <torusKnotGeometry args={[1, 0.3, 180, 24]} />
      <MeshDistortMaterial
        color="#7c6cf0"
        emissive="#4c1d95"
        emissiveIntensity={0.25}
        metalness={0.9}
        roughness={0.25}
        distort={0.28}
        speed={1.6}
        wireframe
        transparent
        opacity={0.55}
      />
    </mesh>
  );
}

const FLEET: {
  type: string;
  color: string;
  pos: V3;
  rotY: number;
  scale: number;
  speed: number;
}[] = [
  { type: "phone", color: "#22d3ee", pos: [2.6, -0.6, -1.2], rotY: -0.35, scale: 0.85, speed: 2.2 },
  { type: "vr", color: "#a78bfa", pos: [-2.7, -0.4, -1.6], rotY: 0.4, scale: 0.8, speed: 1.8 },
  { type: "watch", color: "#f43f5e", pos: [-1.35, 1.35, -2.8], rotY: 0.2, scale: 0.62, speed: 2.6 },
  { type: "earbuds", color: "#34d399", pos: [1.5, 1.3, -2.6], rotY: -0.25, scale: 0.66, speed: 2.4 },
  { type: "drone", color: "#fbbf24", pos: [0.1, 2.15, -3.4], rotY: 0, scale: 0.7, speed: 2.0 },
];

export default function HeroScene() {
  const noPost =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).has("nopost");
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0.4, 6.2], fov: 42 }}
      gl={{ antialias: false, powerPreference: "high-performance" }}
    >
      <color attach="background" args={["#050510"]} />
      <fog attach="fog" args={["#050510", 7, 15]} />
      <Suspense fallback={null}>
        <ambientLight intensity={0.35} />
        <directionalLight position={[5, 8, 4]} intensity={1.1} />
        <pointLight position={[-6, 3, 2]} intensity={60} color="#22d3ee" />
        <pointLight position={[6, -2, 1]} intensity={50} color="#a78bfa" />
        <Rig>
          <Centerpiece />
          {FLEET.map((m) => (
            <Float
              key={m.type}
              speed={m.speed}
              rotationIntensity={0.7}
              floatIntensity={1.1}
            >
              <group
                position={m.pos}
                rotation={[0, m.rotY, 0]}
                scale={m.scale}
              >
                <ProductModel type={m.type} color={m.color} />
              </group>
            </Float>
          ))}
          <Sparkles
            count={200}
            scale={[13, 7, 6]}
            position={[0, 0.5, -2]}
            size={2.2}
            speed={0.32}
            opacity={0.55}
            color="#7dd3fc"
            noise={1.5}
          />
        </Rig>
        <Environment preset="city" />
        {noPost ? null : (
          <EffectComposer multisampling={0}>
            <Bloom
              intensity={0.6}
              luminanceThreshold={0.2}
              luminanceSmoothing={0.3}
              mipmapBlur
            />
            <Vignette offset={0.22} darkness={0.78} />
          </EffectComposer>
        )}
      </Suspense>
    </Canvas>
  );
}
