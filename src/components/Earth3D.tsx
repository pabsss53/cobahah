import React, { useRef, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three';

const Earth3D: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);

  // Load textures
  const earthTexture = useLoader(TextureLoader, 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=2048&h=1024&fit=crop');
  const normalTexture = useLoader(TextureLoader, 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=2048&h=1024&fit=crop');
  const cloudsTexture = useLoader(TextureLoader, 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=2048&h=1024&fit=crop');

  // Create materials
  const earthMaterial = useMemo(() => {
    return new THREE.MeshPhongMaterial({
      map: earthTexture,
      normalMap: normalTexture,
      shininess: 0.1,
    });
  }, [earthTexture, normalTexture]);

  const cloudsMaterial = useMemo(() => {
    return new THREE.MeshPhongMaterial({
      map: cloudsTexture,
      transparent: true,
      opacity: 0.4,
    });
  }, [cloudsTexture]);

  const atmosphereMaterial = useMemo(() => {
    return new THREE.MeshPhongMaterial({
      color: 0x93cfef,
      transparent: true,
      opacity: 0.1,
    });
  }, []);

  // Animation
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.15;
    }
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <group>
      {/* Earth */}
      <mesh ref={meshRef} material={earthMaterial}>
        <sphereGeometry args={[2, 64, 64]} />
      </mesh>

      {/* Clouds */}
      <mesh ref={cloudsRef} material={cloudsMaterial}>
        <sphereGeometry args={[2.01, 64, 64]} />
      </mesh>

      {/* Atmosphere */}
      <mesh ref={atmosphereRef} material={atmosphereMaterial}>
        <sphereGeometry args={[2.1, 64, 64]} />
      </mesh>

      {/* Ambient particles */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={1000}
            array={new Float32Array(
              Array.from({ length: 3000 }, () => (Math.random() - 0.5) * 10)
            )}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.01} color="#ffffff" transparent opacity={0.6} />
      </points>
    </group>
  );
};

export default Earth3D;