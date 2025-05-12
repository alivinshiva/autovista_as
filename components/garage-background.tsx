"use client"
import { useLoader } from "@react-three/fiber"
import * as THREE from "three"

export function GarageBackground({ imageUrl }: { imageUrl: string }) {
    const texture = useLoader(THREE.TextureLoader, imageUrl)

    return (
        <mesh position={[0, 0, -10]}>
            <planeGeometry args={[30, 20]} />
            <meshBasicMaterial map={texture} side={THREE.DoubleSide} />
        </mesh>
    )
}
