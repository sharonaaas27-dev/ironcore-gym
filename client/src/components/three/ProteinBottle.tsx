import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';

interface ProteinBottleProps {
  position?: [number, number, number];
}

export default function ProteinBottle({ position = [0, 0, 0] }: ProteinBottleProps) {
  const meshRef = useRef<Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.4;
    }
  });

  return (
    <group ref={meshRef} position={position}>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.25, 0.3, 1, 20]} />
        <meshStandardMaterial
          color="#d4a017"
          metalness={0.1}
          roughness={0.4}
          transparent
          opacity={0.7}
        />
      </mesh>
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[0.2, 0.15, 0.2, 20]} />
        <meshStandardMaterial
          color="#2a2a2a"
          metalness={0.9}
          roughness={0.3}
        />
      </mesh>
      <mesh position={[0, 0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.4, 0.6]} />
        <meshStandardMaterial
          color="#d4a017"
          transparent
          opacity={0.2}
        />
      </mesh>
    </group>
  );
}
