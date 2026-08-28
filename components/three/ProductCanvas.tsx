"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Float,
  OrbitControls,
} from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import ProductModel from "./ProductModel";

export type ProductCanvasProps = {
  type: string;
  color?: string;
  exploded?: boolean;
  autoRotate?: boolean;
  interactive?: boolean;
  className?: string;
};

export default function ProductCanvas({
  type,
  color,
  exploded = false,
  autoRotate = false,
  interactive = false,
  className,
}: ProductCanvasProps) {
  const controls = useRef<OrbitControlsImpl | null>(null);

  // Keep page scroll working on touch devices when the viewer is passive.
  useEffect(() => {
    const el = controls.current?.domElement;
    if (!interactive && el) {
      el.style.touchAction = "pan-y";
    }
  }, [interactive]);

  return (
    <div className={className}>
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0.5, 4], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.45} />
          <directionalLight position={[4, 6, 5]} intensity={1.4} />
          <spotLight
            position={[-5, 4, -5]}
            angle={0.5}
            penumbra={1}
            intensity={80}
            color="#a78bfa"
          />
          <Float speed={2.2} rotationIntensity={0.5} floatIntensity={0.9}>
            <ProductModel type={type} color={color} exploded={exploded} />
          </Float>
          <ContactShadows
            position={[0, -1.35, 0]}
            opacity={0.55}
            scale={7}
            blur={2.8}
            far={2.6}
            color="#02020a"
          />
          <Environment preset="city" />
        </Suspense>
        <OrbitControls
          ref={controls}
          makeDefault
          enablePan={false}
          enableZoom={interactive}
          enableRotate={interactive}
          autoRotate={autoRotate}
          autoRotateSpeed={2.4}
          minDistance={2.5}
          maxDistance={7}
          minPolarAngle={Math.PI / 5}
          maxPolarAngle={Math.PI / 1.7}
        />
      </Canvas>
    </div>
  );
}
