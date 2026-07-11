import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';

interface DumbbellProps {
  position?: [number, number, number];
}

export default function Dumbbell({ position = [0, 0, 0] }: DumbbellProps) {
  const meshRef = useRef<Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
      meshRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.2) * 0.2;
    }
  });

  return (
    <group ref={meshRef} position={position}>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 2, 16]} />
        <meshStandardMaterial
          color="#d4a017"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      <mesh position={[-1, 0, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial
          color="#1a1a1a"
          metalness={0.9}
          roughness={0.3}
        />
      </mesh>
      <mesh position={[1, 0, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial
          color="#1a1a1a"
          metalness={0.9}
          roughness={0.3}
        />
      </mesh>
    </group>
  );
}
