import * as THREE from 'three';

/**
 * 경로 위치점 객체
 */
class Path3DPointObject extends THREE.Group {
    /**
     * 생성자
     */
    constructor(width: number, color: THREE.Color) {
        super();

        // 3d메시
        const radius = width * 0.5;
        const geometry = new THREE.CylinderGeometry(radius, radius, width, 20);
        const material = new THREE.MeshBasicMaterial({ color: color });
        const mesh = new THREE.Mesh(geometry, material);
        this.add(mesh);

        // 스프라이트
        const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ color: 'yellow', depthTest: false, depthWrite: false, }));
        sprite.scale.set(0.1, 0.1, 1);
        this.add(sprite);
    }

    /**
     * 메모리 해제
     */
    dispose() {
        this.parent?.remove(this);

    }
}

export {
    Path3DPointObject,
}