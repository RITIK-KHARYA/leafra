"use client";

import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, MeshDistortMaterial } from "@react-three/drei";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import Link from "next/link";
import type * as THREE from "three";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      {/* 3D Scene - Main Focus */}
      <div className="w-full h-96 mb-8">
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-full text-white">
              Loading...
            </div>
          }
        >
          <Canvas camera={{ position: [0, 0, 6], fov: 60 }}>
            <ambientLight intensity={0.3} />
            <directionalLight
              position={[10, 10, 5]}
              intensity={1}
              color="#ffffff"
            />
            <pointLight
              position={[-10, 0, -10]}
              intensity={0.5}
              color="#3b82f6"
            />
            <pointLight
              position={[10, 0, 10]}
              intensity={0.5}
              color="#8b5cf6"
            />

            <InteractiveCrystal />

            <OrbitControls
              enableZoom={true}
              enablePan={true}
              autoRotate
              minDistance={10}
              maxDistance={25}
              autoRotateSpeed={0.3}
              enableRotate={true}
            />
          </Canvas>
        </Suspense>
      </div>

      {/* Minimal Content */}
      <div className="text-center space-y-4 flex flex-col items-center">
        <h1 className="text-2xl font-bold text-white space-y-4">
          Page Not Found
        </h1>
        <span className="text-neutral-300">return to dashboard</span>
        <Button asChild className="bg-white text-black hover:bg-gray-200">
          <Link href="/dashboard">
            <Home className="w-4 h-4 mr-2" />
            Home
          </Link>
        </Button>
      </div>
    </div>
  );
}

function InteractiveCrystal() {
  const mainCrystalRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const orbitingShapesRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // Main crystal rotation and floating
    if (mainCrystalRef.current) {
      mainCrystalRef.current.rotation.x = Math.sin(time * 0.3) * 0.2;
      mainCrystalRef.current.rotation.y = time * 0.2;
      mainCrystalRef.current.position.y = Math.sin(time * 0.5) * 0.3;
    }

    // Orbiting shapes
    if (orbitingShapesRef.current) {
      orbitingShapesRef.current.rotation.y = time * 0.4;
      orbitingShapesRef.current.rotation.x = Math.sin(time * 0.2) * 0.1;
    }

    // Group breathing effect
    if (groupRef.current) {
      const scale = 1 + Math.sin(time * 0.8) * 0.05;
      groupRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main Interactive Crystal */}
      <Float speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh
          ref={mainCrystalRef}
          onClick={() => console.log("Crystal clicked!")}
        >
          <octahedronGeometry args={[1.5, 2]} />
          <MeshDistortMaterial
            color="#ffffff"
            transparent
            opacity={0.8}
            distort={0.4}
            speed={2}
            roughness={0}
            metalness={0.8}
          />
        </mesh>
      </Float>

      {/* Orbiting Elements */}
      <group ref={orbitingShapesRef}>
        {/* Ring 1 */}
        <Float speed={1.5} rotationIntensity={2} floatIntensity={1}>
          <mesh position={[3, 0, 0]}>
            <icosahedronGeometry args={[0.3, 1]} />
            <meshStandardMaterial
              color="#3b82f6"
              emissive="#3b82f6"
              emissiveIntensity={0.3}
            />
          </mesh>
        </Float>

        <Float speed={1.8} rotationIntensity={1.5} floatIntensity={1.2}>
          <mesh position={[-3, 0, 0]}>
            <dodecahedronGeometry args={[0.3, 0]} />
            <meshStandardMaterial
              color="#8b5cf6"
              emissive="#8b5cf6"
              emissiveIntensity={0.3}
            />
          </mesh>
        </Float>

        <Float speed={2} rotationIntensity={3} floatIntensity={1.5}>
          <mesh position={[0, 3, 0]}>
            <tetrahedronGeometry args={[0.4, 0]} />
            <meshStandardMaterial
              color="#06b6d4"
              emissive="#06b6d4"
              emissiveIntensity={0.3}
            />
          </mesh>
        </Float>

        <Float speed={1.3} rotationIntensity={2.5} floatIntensity={1.8}>
          <mesh position={[0, -3, 0]}>
            <coneGeometry args={[0.3, 0.8, 8]} />
            <meshStandardMaterial
              color="#10b981"
              emissive="#10b981"
              emissiveIntensity={0.3}
            />
          </mesh>
        </Float>

        {/* Ring 2 - Closer orbit */}
        <Float speed={2.5} rotationIntensity={1} floatIntensity={2}>
          <mesh position={[2, 2, 1]}>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshStandardMaterial
              color="#f59e0b"
              emissive="#f59e0b"
              emissiveIntensity={0.4}
            />
          </mesh>
        </Float>

        <Float speed={2.2} rotationIntensity={2} floatIntensity={1.5}>
          <mesh position={[-2, -2, -1]}>
            <boxGeometry args={[0.3, 0.3, 0.3]} />
            <meshStandardMaterial
              color="#ef4444"
              emissive="#ef4444"
              emissiveIntensity={0.4}
            />
          </mesh>
        </Float>

        <Float speed={1.7} rotationIntensity={1.8} floatIntensity={2.2}>
          <mesh position={[2, -2, 0]} rotation={[Math.PI / 4, 0, Math.PI / 4]}>
            <torusGeometry args={[0.25, 0.08, 16, 100]} />
            <meshStandardMaterial
              color="#ec4899"
              emissive="#ec4899"
              emissiveIntensity={0.4}
            />
          </mesh>
        </Float>

        <Float speed={1.9} rotationIntensity={2.3} floatIntensity={1.3}>
          <mesh position={[-2, 2, 1]}>
            <cylinderGeometry args={[0.15, 0.15, 0.6, 8]} />
            <meshStandardMaterial
              color="#6366f1"
              emissive="#6366f1"
              emissiveIntensity={0.4}
            />
          </mesh>
        </Float>
      </group>

      {/* Particle-like small elements */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const radius = 4 + Math.sin(i) * 0.5;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = Math.sin(i * 2) * 2;

        return (
          <Float
            key={i}
            speed={1 + i * 0.1}
            rotationIntensity={1}
            floatIntensity={1}
          >
            <mesh position={[x, y, z]}>
              <sphereGeometry args={[0.05, 8, 8]} />
              <meshStandardMaterial
                color={`hsl(${i * 30}, 70%, 60%)`}
                emissive={`hsl(${i * 30}, 70%, 30%)`}
                emissiveIntensity={0.5}
              />
            </mesh>
          </Float>
        );
      })}
    </group>
  );
}
