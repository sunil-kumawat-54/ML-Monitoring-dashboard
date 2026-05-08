"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

function Particles() {
  const count = 2000;
  const mesh = useRef<THREE.InstancedMesh>(null);
  
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 40;
      const y = (Math.random() - 0.5) * 40;
      const z = (Math.random() - 0.5) * 20;
      const velocity = Math.random() * 0.006 + 0.002;
      const size = Math.random() * 0.6 + 0.6;
      temp.push({ x, y, z, velocity, size, startY: y });
    }
    return temp;
  }, [count]);

  const { mouse } = useThree();

  useFrame(() => {
    if (!mesh.current) return;
    
    particles.forEach((particle, i) => {
      // Upward drift
      particle.y += particle.velocity;
      if (particle.y > 20) {
        particle.y = -20;
      }

      // Mouse Parallax effect
      const targetX = particle.x + (mouse.x * 2);
      const targetY = particle.y + (mouse.y * 2);

      dummy.position.set(targetX, targetY, particle.z);
      dummy.scale.set(particle.size * 0.05, particle.size * 0.05, particle.size * 0.05);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <circleGeometry args={[1, 8]} />
      <meshBasicMaterial 
        color="#3d9bff" 
        transparent 
        opacity={0.3} 
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </instancedMesh>
  );
}

function OrbitalRings() {
  const ring1 = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);
  const ring3 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ring1.current) {
      ring1.current.rotation.x = t * 0.05;
      ring1.current.rotation.y = t * 0.08;
    }
    if (ring2.current) {
      ring2.current.rotation.x = t * 0.03 + Math.PI / 4;
      ring2.current.rotation.y = t * 0.04;
    }
    if (ring3.current) {
      ring3.current.rotation.x = -t * 0.02;
      ring3.current.rotation.y = t * 0.06 + Math.PI / 2;
    }
  });

  const material = useMemo(() => new THREE.MeshBasicMaterial({
    color: "#a855f7",
    wireframe: true,
    transparent: true,
    opacity: 0.04,
    blending: THREE.AdditiveBlending
  }), []);

  return (
    <>
      <mesh ref={ring1} position={[0, 0, -5]}>
        <torusGeometry args={[12, 0.5, 16, 100]} />
        <primitive object={material} />
      </mesh>
      <mesh ref={ring2} position={[2, -2, -8]}>
        <torusGeometry args={[16, 0.8, 16, 100]} />
        <meshBasicMaterial color="#3d9bff" wireframe transparent opacity={0.03} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh ref={ring3} position={[-3, 4, -12]}>
        <torusGeometry args={[20, 1, 16, 100]} />
        <primitive object={material} />
      </mesh>
    </>
  );
}

export default function AmbientLayer() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
        <fog attach="fog" args={["#04060f", 5, 25]} />
        <Particles />
        <OrbitalRings />
        <EffectComposer>
          <Bloom 
            intensity={0.4} 
            luminanceThreshold={0.85} 
            luminanceSmoothing={0.9} 
            mipmapBlur 
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
