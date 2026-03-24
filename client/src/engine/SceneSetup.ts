import * as THREE from 'three';

export const setupBaseScene = () => {
    //Platter
    const discGeo = new THREE.CylinderGeometry(5, 5, 0.2, 64);
    const discMat = new THREE.MeshPhongMaterial({ color: 0x222222 });
    const disc = new THREE.Mesh(discGeo, discMat);

    //Arm
    const armGroup = new THREE.Group();
    const armBase = new THREE.Mesh(
        new THREE.BoxGeometry(5.0, 0.1, 0.5),
        new THREE.MeshPhongMaterial({ color: 0x111111 })
    );
    armBase.position.set(2.5, 0.3, 0);
    armGroup.add(armBase);
    armBase.name = 'arm-base';

    //Arm Sensor Rings
    const ringGeo = new THREE.TorusGeometry(0.2, 0.03, 16, 32);
    for (let i = 0; i < 4; i++) {
        const ringMat = new THREE.MeshLambertMaterial({ color: 0x555555 });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2;
        ring.position.set((i + 1) * 1.1 - 2.5, 0.06, 0);

        ring.name = `sensor-ring-${i}`;

        armBase.add(ring);
    }

    //Concentric Track Rings (on the disc)
    for (let i = 0; i < 4; i++) {
        const trackGeo = new THREE.RingGeometry((i + 1) * 1.1 - 0.02, (i + 1) * 1.1 + 0.02, 64);
        const trackMat = new THREE.MeshBasicMaterial({
            color: 0x444444,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.8
        });
        const trackRing = new THREE.Mesh(trackGeo, trackMat);
        trackRing.rotation.x = Math.PI / 2;
        trackRing.position.y = 0.11;
        disc.add(trackRing);
    }

    return { disc, armGroup };
};

export const setupDebugHelpers = (scene: THREE.Scene) => {
    // 1. Axes (Red=X, Green=Y, Blue=Z)
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    // 2. Ray Visual (The Red Line)
    const rayLineGeo = new THREE.BufferGeometry();
    const rayVisual = new THREE.Line(
        rayLineGeo, 
        new THREE.LineBasicMaterial({ color: 0xff0000 })
    );
    scene.add(rayVisual);

    // 3. Yellow Click Marker
    const debugMarker = new THREE.Mesh(
        new THREE.SphereGeometry(0.1),
        new THREE.MeshBasicMaterial({ color: 0xffff00 })
    );
    scene.add(debugMarker);

    return { rayVisual, debugMarker, rayLineGeo };
};