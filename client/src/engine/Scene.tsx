import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useStore } from '../store/useStore';
import { useOrbita } from '../hooks/useOrbita';
import { setupBaseScene } from './SceneSetup';

export const Scene = () => {
    const mountRef = useRef<HTMLDivElement>(null);
    const { updateMagnets } = useOrbita();

    useEffect(() => {
        const currentMount = mountRef.current;
        if (!currentMount) return;

        //Engine
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(window.devicePixelRatio); // Sharper visuals
        renderer.setSize(window.innerWidth, window.innerHeight);
        currentMount.appendChild(renderer.domElement);

        //The world
        const { disc, armGroup } = setupBaseScene();
        scene.add(disc);
        scene.add(armGroup);

        //Debugging tools
        const axesHelper = new THREE.AxesHelper(5);
        scene.add(axesHelper);

        const rayLineGeo = new THREE.BufferGeometry();
        const rayVisual = new THREE.Line(
            rayLineGeo,
            new THREE.LineBasicMaterial({ color: 0xff0000 })
        );
        scene.add(rayVisual);

        const debugMarker = new THREE.Mesh(
            new THREE.SphereGeometry(0.1),
            new THREE.MeshBasicMaterial({ color: 0xffff00 })
        );
        scene.add(debugMarker);

        //Lightning - Adjusted to hit the top of the platter better
        const light = new THREE.DirectionalLight(0xffffff, 1.5);
        light.position.set(2, 10, 5); 
        scene.add(light, new THREE.AmbientLight(0x606060));
        
        camera.position.set(0, 8, 8); // Slightly higher angle to see the platter
        camera.lookAt(0, 0, 0);

        // Interaction
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        const onMouseDown = (event: MouseEvent) => {
            const rect = renderer.domElement.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            
            raycaster.setFromCamera(mouse, camera);
            
            const start = raycaster.ray.origin;
            const end = raycaster.ray.direction.clone().multiplyScalar(20).add(start);
            rayLineGeo.setFromPoints([start, end]);
            
            const intersects = raycaster.intersectObject(disc);

            if (intersects.length > 0) {
                const { x, y, z } = intersects[0].point;
                debugMarker.position.set(x, y + 0.1, z);

                const radius = Math.sqrt(x * x + z * z);
                const angle = Math.atan2(z, x) - disc.rotation.y;

                useStore.getState().addMagnet(angle, radius);
            }
        };

        currentMount.addEventListener('mousedown', onMouseDown);
        
        let frameId: number;
        const animate = () => {
            frameId = requestAnimationFrame(animate);
            updateMagnets(scene, disc); 
            renderer.render(scene, camera);
        };
        animate();

        return () => {
            cancelAnimationFrame(frameId);
            currentMount.removeEventListener('mousedown', onMouseDown);
            if (currentMount.contains(renderer.domElement)) {
                currentMount.removeChild(renderer.domElement);
            }
            renderer.dispose();
            disc.geometry.dispose();
            (disc.material as THREE.Material).dispose();
            rayLineGeo.dispose();
        };
    }, [updateMagnets]);
    
    return <div ref={mountRef} className="w-full h-screen bg-neutral-900" />;
};