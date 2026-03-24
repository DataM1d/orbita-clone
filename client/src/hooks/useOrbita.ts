import { useCallback, useRef } from 'react';
import * as THREE from 'three';
import { useStore } from '../store/useStore';
import { TriggerMagnetNote } from '../engine/Audio';

export const useOrbita = () => {
    const magnetMeshes = useRef<Map<string, THREE.Mesh>>(new Map());
    const prevRotationRef = useRef(0);
    const lastSceneRef = useRef<THREE.Scene | null>(null);

    const updateMagnets = useCallback((scene: THREE.Scene, disc: THREE.Mesh) => {
        // If the scene changed (e.g. after a hot-reload), clear the map 
        // otherwise we try to update meshes that were destroyed
        if (lastSceneRef.current !== scene) {
            magnetMeshes.current.clear();
            lastSceneRef.current = scene;
        }

        const rotationSpeed = 0.01;
        disc.rotation.y += rotationSpeed;
        
        const currentRotation = disc.rotation.y;
        const prevRotation = prevRotationRef.current;
        const stateMagnets = useStore.getState().magnets;
        const mutedTracks = useStore.getState().mutedTracks;
        const TWO_PI = Math.PI * 2;

        stateMagnets.forEach((m) => {
            let sphere = magnetMeshes.current.get(m.id);

            if (!sphere) {
                const sphereGeo = new THREE.SphereGeometry(0.15, 16, 16);
                const sphereMat = new THREE.MeshPhongMaterial({ color: m.color });
                sphere = new THREE.Mesh(sphereGeo, sphereMat);
                scene.add(sphere);
                magnetMeshes.current.set(m.id, sphere);
            }

            const currentPos = (m.angle + currentRotation) % TWO_PI;
            const prevPos = (m.angle + prevRotation) % TWO_PI;

            // Collision check with playhead (Angle 0)
            if (prevPos > currentPos) {
                // Only trigger audio and hardware glow if track is NOT muted
                if (!mutedTracks[m.trackIndex]) {
                    TriggerMagnetNote(m.note);
                    
                    sphere.scale.set(1.6, 1.6, 1.6);
                    
                    const armBase = scene.getObjectByName('arm-base');
                    if (armBase) {
                        const ring = armBase.children.find(
                            (child) => child.name === `sensor-ring-${m.trackIndex}`
                        ) as THREE.Mesh;

                        if (ring && (ring.material instanceof THREE.MeshStandardMaterial || ring.material instanceof THREE.MeshLambertMaterial)) {
                            const ringMat = ring.material as THREE.MeshLambertMaterial;
                            const originalColor = new THREE.Color(0x555555);
                            
                            ringMat.color.set(m.color); // Flash with magnet color
                            
                            setTimeout(() => {
                                ringMat.color.copy(originalColor);
                            }, 150);
                        }
                    }
                }
            } else {
                // Smoothly shrink magnet back to normal scale
                sphere.scale.lerp(new THREE.Vector3(1, 1, 1), 0.15);
            }

            const finalAngle = m.angle + currentRotation;
            sphere.position.set(
                Math.cos(finalAngle) * m.radius,
                0.2, // Sitting on top of the disc
                Math.sin(finalAngle) * m.radius
            );
        });

        prevRotationRef.current = currentRotation;
    }, []);

    return { updateMagnets };
};