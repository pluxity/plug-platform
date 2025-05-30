import * as THREE from 'three';

/**
 * 3D 경로의 각 구간 위치점 표현 클래스
 */
class PathPoint3D extends THREE.Mesh {
    /**
     * 생성자
     */
    constructor(radius: number = 0.5, height: number = 0.5, color: THREE.ColorRepresentation = 0xff0000) {
        super();

        this.geometry = new THREE.CylinderGeometry(radius, radius, height, 20);
        this.material = new THREE.MeshBasicMaterial({ color: color });
    }

    /**
     * 메모리 해제
     */
    dispose() {
        (this.material as THREE.Material).dispose();
        this.geometry.dispose();
    }
}

export {
    PathPoint3D,
}