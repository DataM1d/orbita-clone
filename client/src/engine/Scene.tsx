import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const Scene = () => {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const currentMount = mountRef.current;
        if (!currentMount) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        currentMount.appendChild(renderer.domElement);

        const geometry = new THREE.CylinderGeometry(5, 5, 0.2, 64);
        const material = new THREE.MeshPhongMaterial({ color: 0x222222 });

        const disc = new THREE.Mesh(geometry, material);
        scene.add(disc);

        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(5, 5, 5);
        scene.add(light);
        scene.add(new THREE.AmbientLight(0x404040));

        camera.position.z = 10;
        camera.position.y = 5;
        camera.lookAt(0, 0, 0);

        const animate = () => {
            requestAnimationFrame(animate);
            disc.rotation.y += 0.01;
            renderer.render(scene, camera);
        }
        animate();
        
        return () => {
            if (currentMount) {
                currentMount.removeChild(renderer.domElement);
            }

            renderer.dispose();
        }
    }, []);
    
    return <div ref={mountRef} className="w-full h-screen" />;
};