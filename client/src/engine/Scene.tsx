import { useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import * as THREE from 'three';

export const Scene = () => {
    const mountRef = useRef<HTMLDivElement>(null);
    //Using Mapto keep track fo 3D objects associated with magnet IDs.
    const magnetMeshes = useRef<Map<string, THREE.Mesh>>(new Map());

    useEffect(() => {
        const currentMount = mountRef.current;
        if (!currentMount) return;

        //SCENE
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        currentMount.appendChild(renderer.domElement);

        //PLATTER
        const geometry = new THREE.CylinderGeometry(5, 5, 0.2, 64);
        const material = new THREE.MeshPhongMaterial({ color: 0x222222 });
        const disc = new THREE.Mesh(geometry, material);
        scene.add(disc);

        //GROUP TO HOLD MAGNETS so they rotate with the disc
        const magnetGroup = new THREE.Group();
        disc.add(magnetGroup);
        
        //LIGHTS
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(5, 5, 5);
        scene.add(light);
        scene.add(new THREE.AmbientLight(0x404040));

        camera.position.z = 10;
        camera.position.y = 5;
        camera.lookAt(0, 0, 0);

        //INTERACTION LOGIC raycaster
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        const addMagnet = useStore.getState().addMagnet;

        const onMouseDown = (event: MouseEvent) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        const start = raycaster.ray.origin;
        const end = raycaster.ray.direction.clone().multiplyScalar(20).add(start);
        rayLineGeometry.setFromPoints([start, end]);

        const intersects = raycaster.intersectObject(disc);

        if (intersects.length > 0) {
        const { x, y, z } = intersects[0].point;

        debugMarker.position.set(x, y + 0.1, z);

        const radius = Math.sqrt(x * x + z * z);
        const clickAngle = Math.atan2(z, x);
        const adjustedAngle = clickAngle - disc.rotation.y;

        console.table({
            x: x.toFixed(3),
            z: z.toFixed(3),
            radius: radius.toFixed(3),
            angleRad: adjustedAngle.toFixed(3),
            discRot: disc.rotation.y.toFixed(3)
        });

        addMagnet(adjustedAngle, radius);
      }
    };

        currentMount.addEventListener('mousedown', onMouseDown);
        
        let frameId: number;
        const animate = () => {
            frameId = requestAnimationFrame(animate);
            disc.rotation.y += 0.01;
            const currentRotation = disc.rotation.y;
            const stateMagnets = useStore.getState().magnets;

            stateMagnets.forEach((m) => {
                let sphere = magnetMeshes.current.get(m.id);
                if (!sphere) {
                    const sphereGeo = new THREE.SphereGeometry(0.15, 16, 16);
                    const sphereMat = new THREE.MeshPhongMaterial({ color: m.color });
                    sphere = new THREE.Mesh(sphereGeo, sphereMat);

                    scene.add(sphere);
                    magnetMeshes.current.set(m.id, sphere);
                }
                const finalAngle = m.angle + currentRotation;

                sphere.position.x = Math.cos(finalAngle) * m.radius;
                sphere.position.z = Math.sin(finalAngle) * m.radius;
                sphere.position.y = 0.2;
            })
            renderer.render(scene, camera);
        }
        animate();

        //Debug helpers
        // Red = X axis, Green = Y axis, Blue = Z axis
        const axesHelper = new THREE.AxesHelper(5);
        scene.add(axesHelper);
        
        // A red line to show the ray
        const rayLineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
        const rayLineGeometry = new THREE.BufferGeometry();
        const rayVisual = new THREE.Line(rayLineGeometry, rayLineMaterial);
        scene.add(rayVisual);

        // A tiny yellow sphere to mark the "Raw Click Point"
        const debugPointGeo = new THREE.SphereGeometry(0.1);
        const debugPointMat = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        const debugMarker = new THREE.Mesh(debugPointGeo, debugPointMat);
        scene.add(debugMarker);

        return () => {
            cancelAnimationFrame(frameId);
            currentMount.removeEventListener('mousedown', onMouseDown);
            if (currentMount) {
                currentMount.removeChild(renderer.domElement);
            }
            renderer.dispose();
            geometry.dispose();
            material.dispose();
        };
    }, []);
    
    return <div ref={mountRef} className="w-full h-screen bg-neutral-900" />;
};