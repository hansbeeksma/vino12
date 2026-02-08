"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  OrbitControls,
  Float,
  MeshTransmissionMaterial,
} from "@react-three/drei";
import * as THREE from "three";

interface WineBottle3DProps {
  wineColor?: string;
  className?: string;
  autoRotate?: boolean;
}

function WineLiquid({ color }: { color: THREE.Color }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y =
        0.5 + Math.sin(state.clock.elapsedTime * 0.8) * 0.02;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0.5, 0]}>
      <cylinderGeometry args={[0.32, 0.35, 1.6, 32]} />
      <meshPhysicalMaterial
        color={color}
        transparent
        opacity={0.85}
        roughness={0.15}
        metalness={0.05}
        clearcoat={0.3}
        clearcoatRoughness={0.2}
        transmission={0.1}
        ior={1.33}
      />
    </mesh>
  );
}

function Bottle({ wineColor = "#722f37" }: { wineColor?: string }) {
  const groupRef = useRef<THREE.Group>(null);

  // Subtle idle rotation
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
    }
  });

  const color = new THREE.Color(wineColor);

  return (
    <group ref={groupRef} position={[0, -1.2, 0]}>
      {/* Bottle body */}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.35, 0.38, 2.2, 32]} />
        <MeshTransmissionMaterial
          color="#1a3a1a"
          thickness={0.5}
          roughness={0.1}
          transmission={0.6}
          ior={1.5}
          chromaticAberration={0.02}
        />
      </mesh>

      {/* Bottle neck */}
      <mesh position={[0, 2.4, 0]}>
        <cylinderGeometry args={[0.12, 0.35, 1, 32]} />
        <MeshTransmissionMaterial
          color="#1a3a1a"
          thickness={0.3}
          roughness={0.1}
          transmission={0.6}
          ior={1.5}
        />
      </mesh>

      {/* Bottle top */}
      <mesh position={[0, 3.1, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.4, 32]} />
        <MeshTransmissionMaterial
          color="#1a3a1a"
          thickness={0.2}
          roughness={0.15}
          transmission={0.5}
          ior={1.5}
        />
      </mesh>

      {/* Cork / capsule */}
      <mesh position={[0, 3.4, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 0.2, 16]} />
        <meshStandardMaterial color="#c9a96e" metalness={0.3} roughness={0.4} />
      </mesh>

      {/* Wine inside bottle (visible through glass) */}
      <WineLiquid color={color} />

      {/* Label - front */}
      <mesh position={[0, 0.8, 0.39]} rotation={[0, 0, 0]}>
        <planeGeometry args={[0.5, 0.7]} />
        <meshStandardMaterial color="#fafaf5" roughness={0.8} metalness={0} />
      </mesh>

      {/* Label text accent stripe */}
      <mesh position={[0, 0.55, 0.395]}>
        <planeGeometry args={[0.5, 0.04]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>

      {/* Label V12 mark */}
      <mesh position={[0, 0.85, 0.395]}>
        <planeGeometry args={[0.15, 0.15]} />
        <meshStandardMaterial color="#000000" roughness={0.9} />
      </mesh>

      {/* Bottle bottom */}
      <mesh position={[0, -0.35, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.38, 32]} />
        <meshStandardMaterial color="#0a2a0a" roughness={0.3} />
      </mesh>
    </group>
  );
}

function LightSetup() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
      <directionalLight
        position={[-3, 3, -3]}
        intensity={0.3}
        color="#c9a96e"
      />
      <pointLight position={[0, 3, 4]} intensity={0.5} color="#fafaf5" />
    </>
  );
}

export function WineBottle3D({
  wineColor = "#722f37",
  className = "",
  autoRotate = true,
}: WineBottle3DProps) {
  return (
    <div className={`w-full h-full min-h-[400px] ${className}`}>
      <Canvas
        camera={{ position: [0, 1.5, 5], fov: 35 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <LightSetup />
        <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
          <Bottle wineColor={wineColor} />
        </Float>
        <OrbitControls
          autoRotate={autoRotate}
          autoRotateSpeed={0.5}
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.5}
        />
        <Environment preset="sunset" />
      </Canvas>
    </div>
  );
}
