import { ThreeElements } from '@react-three/fiber';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: ThreeElements['group'];
      mesh: ThreeElements['mesh'];
      meshStandardMaterial: ThreeElements['meshStandardMaterial'];
      sphereGeometry: ThreeElements['sphereGeometry'];
      cylinderGeometry: ThreeElements['cylinderGeometry'];
      torusGeometry: ThreeElements['torusGeometry'];
      planeGeometry: ThreeElements['planeGeometry'];
      ambientLight: ThreeElements['ambientLight'];
      directionalLight: ThreeElements['directionalLight'];
      pointLight: ThreeElements['pointLight'];
      spotLight: ThreeElements['spotLight'];
    }
  }
}
