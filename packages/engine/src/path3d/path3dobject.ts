import * as THREE from 'three';
import { Path3DPointObject } from './path3dpointobject';

/**
 * 경로 객체
 */
class Path3DObject extends THREE.Group {

    private pathWidth: number = 0.5;
    private pathColor: THREE.Color;
    private pathPoints: Path3DPointObject[] = [];

    /**
     * 생성자
     * @param color - 경로 색상
     */
    constructor(color: THREE.ColorRepresentation) {
        super();

        this.pathColor = new THREE.Color(color);
    }

    /**
     * 메모리 해제
     */
    dispose() {
        // 위치점
        this.pathPoints.forEach(pointObj => {
            pointObj.dispose();
        });
        this.pathPoints = [];
    }

    /**
     * 경로객체 위치점 추가
     * @param worldPoint - 월드좌표
     * @param localPoint - 층기준 로컬좌표
     * @param floor - 레이캐스트된 층 객체
     */
    addPathPoint(worldPoint: THREE.Vector3, floor: THREE.Object3D) {
        // 새 위치점 생성
        const newPointObj = new Path3DPointObject(this.pathWidth, this.pathColor);
        newPointObj.name = THREE.MathUtils.generateUUID();
        newPointObj.position.copy(worldPoint);
        newPointObj.userData['floorId'] = floor.userData['floorId'];
        floor.attach(newPointObj);

        this.pathPoints.push(newPointObj);
    }

    addStraightPoint() {
        
    }
}

export {
    Path3DObject
}