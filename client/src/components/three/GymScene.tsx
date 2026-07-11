import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, Environment, ContactShadows } from '@react-three/drei';
import Dumbbell from './Dumbbell';
import Kettlebell from './Kettlebell';
import ProteinBottle from './ProteinBottle';

export default function GymScene() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={['#0a0a0a']} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-5, -5, -5]} intensity={0.5} color="#d4a017" />
        <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={0.8} color="#d4a017" />

        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
          <Dumbbell position={[-2.5, 0, 0]} />
        </Float>

        <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
          <Kettlebell position={[2.5, -0.5, 0]} />
        </Float>

        <Float speed={2.5} rotationIntensity={0.4} floatIntensity={1.2}>
          <ProteinBottle position={[0, 1, -2]} />
        </Float>

        <Environment preset="night" />
        <ContactShadows
          position={[0, -2.5, 0]}
          opacity={0.4}
          scale={10}
          blur={2.5}
        />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
}
