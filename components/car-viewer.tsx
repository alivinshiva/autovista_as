'use client';

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF, Stage } from "@react-three/drei";
import { useEffect } from "react";

interface CarViewerProps {
  modelPath: string;
  bodyColor?: string;
  wheelColor?: string;
  wheelScale?: number;
  finish?: string;
}

function Model({ modelPath, bodyColor = "#ffffff", wheelColor = "#000000", wheelScale = 1 }: CarViewerProps) {
  const { scene } = useGLTF(modelPath);

  useEffect(() => {
    scene.traverse((node: any) => {
      if (node.isMesh && node.material) {
        const nodeName = node.name.toLowerCase();

        if (nodeName.includes("wheel") || nodeName.includes("tire")) {
          node.material.color.set(wheelColor);
          node.scale.set(wheelScale, wheelScale, wheelScale);
          const offsetY = (wheelScale - 1) * -0.1;
          node.position.y = offsetY;
        }

        if (nodeName.includes("body") || nodeName.includes("chassis") || (nodeName.includes("car") && !nodeName.includes("wheel"))) {
          node.material.color.set(bodyColor);
          node.material.metalness = 0.8;
          node.material.roughness = 0.2;
          node.material.needsUpdate = true;
        }
      }
    });
  }, [bodyColor, wheelColor, wheelScale, scene]);

  return (
    <primitive
      object={scene}
      scale={[2.5, 2.5, 2.5]}
      position={[0, 0, 0]}
      rotation={[0, Math.PI / 4, 0]}
    />
  );
}

export default function CarViewer(props: CarViewerProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      style={{ width: '100%', height: '100%' }}
    >
      <Stage environment="city" intensity={0.5}>
        <Model {...props} />
      </Stage>
      <OrbitControls
        enableZoom={true}
        enablePan={true}
        enableRotate={true}
        zoomSpeed={0.6}
        panSpeed={0.5}
        rotateSpeed={0.4}
      />
      <Environment preset="city" />
    </Canvas>
  );
} 