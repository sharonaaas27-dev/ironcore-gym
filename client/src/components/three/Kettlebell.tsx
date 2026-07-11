import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';

interface KettlebellProps {
  position?: [number, number, number];
}

export default function Kettlebell({ position = [0, 0, 0] }: KettlebellProps) {
  const meshRef = useRef<Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.3;
    }
  });

  return (
    <group ref={meshRef} position={position}>
      <mesh position={[0, 0.3, 0]}>
        <sphereGeometry args={[0.4, 20, 20]} />
        <meshStandardMaterial
          color="#2a2a2a"
          metalness={0.9}
          roughness={0.3}
        />
      </mesh>
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.1, 0.12, 0.6, 12]} />
        <meshStandardMaterial
          color="#d4a017"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      <mesh position={[0, 1, 0]}>
        <torusGeometry args={[0.15, 0.05, 8, 12]} />
        <meshStandardMaterial
          color="#d4a017"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      <mesh position={[0, 0.3, 0]}>
        <sphereGeometry args={[0.38, 20, 20]} />
        <meshStandardMaterial
          color="#d4a017"
          metalness={0.1}
          roughness={0.5}
          transparent
          opacity={0.1}
        />
      </mesh>
    </group>
  );
}
