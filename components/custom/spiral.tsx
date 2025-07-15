"use client";

import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import { Mesh } from "three";

const Spiral = () => {
  const meshRef = useRef<Mesh>(null);

  // Create a custom spiral curve
  const curve = useMemo(() => {
    const points = [];
    for (let i = 0; i < 100; i++) {
      const t = i / 20;
      const x = Math.sin(t * Math.PI) * 2;
      const y = Math.cos(t * Math.PI) * 2;
      const z = t * 0.8;
      points.push(new THREE.Vector3(x, y, z));
    }
    return new THREE.CatmullRomCurve3(points);
  }, []);

  // Animate rotation
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.003;
    }
  });

  return (
    <mesh ref={meshRef}>
      <tubeGeometry args={[curve, 300, 0.2, 16, false]} />
      <meshStandardMaterial
        color={"white"}
        emissive={"#ff00ff"}
        metalness={0.5}
        roughness={0.2}
      />
    </mesh>
  );
};

export default function Spiral3DComponent() {
  return (
    <div
    className="z-10"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: -1,
        pointerEvents: "none",
      }}
    >
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Spiral />
      </Canvas>
    </div>
  );
}
