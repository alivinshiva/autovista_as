// "use client";

// import { Canvas } from "@react-three/fiber";
// import { OrbitControls, Environment, Stage } from "@react-three/drei";
// import { Suspense } from "react";
// import { Loader2 } from "lucide-react";
// import { useGLTF } from "@react-three/drei";

// export default function CarViewer({ config }: { config: any }) {
//   const { scene } = useGLTF(config.modelPath);

//   return (
//     <div className="w-full h-[80vh]">
//       <Suspense fallback={<Loader2 className="animate-spin w-12 h-12" />}>
//         <Canvas shadows camera={{ position: [0, 0, 10], fov: 50 }}>
//           <Stage environment="studio" intensity={0.5}>
//             <primitive
//               object={scene}
//               scale={[2.5, 2.5, 2.5]}
//               position={[0, 0, 0]}
//               rotation={[0, Math.PI / 4, 0]}
//             />
//           </Stage>
//           <OrbitControls enablePan={false} />
//           <Environment preset="city" />
//         </Canvas>
//       </Suspense>
//     </div>
//   );
// }
