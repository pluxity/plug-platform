import * as THREE from 'three';

/**
 * 3d경로 표현 클래스
 */
class PathSegment3D extends THREE.Mesh {

    private curvePath: THREE.QuadraticBezierCurve3 = new THREE.QuadraticBezierCurve3();

    private startPointDummy!: THREE.Object3D;
    private controlPointDummy!: THREE.Object3D;
    private endPointDummy!: THREE.Object3D;

    /**
     * 경로 구간 색상
     */
    private segmentColor: THREE.ColorRepresentation = 'red';

    /**
     * PathSegment 생성자
     */
    constructor(color: THREE.ColorRepresentation = 'red') {
        super();

        this.segmentColor = color;
    }

    set StartPointDummy(value: THREE.Object3D) {
        this.startPointDummy = value;

        this.curvePath.v0 = this.StartPointWorldPosition.clone();
    }
    get StartPointDummy(): THREE.Object3D {
        return this.startPointDummy;
    }
    get StartPointLocalPosition(): THREE.Vector3 {
        return this.startPointDummy.position.clone();
    }
    get StartPointWorldPosition(): THREE.Vector3 {
        const worldPoint = new THREE.Vector3();
        this.startPointDummy.getWorldPosition(worldPoint);
        return worldPoint;
    }

    set ControlPointDummy(value: THREE.Object3D) {
        this.controlPointDummy = value;

        this.curvePath.v1 = this.ControlPointWorldPosition.clone();
    }
    get ControlPointDummy(): THREE.Object3D {
        return this.controlPointDummy;
    }
    get ControlPointLocalPosition(): THREE.Vector3 {
        return this.controlPointDummy.position.clone();
    }
    get ControlPointWorldPosition(): THREE.Vector3 {
        const worldPoint = new THREE.Vector3();
        this.controlPointDummy.getWorldPosition(worldPoint);
        return worldPoint;
    }

    set EndPointDummy(value: THREE.Object3D) {
        this.endPointDummy = value;

        this.curvePath.v2 = this.EndPointWorldPosition.clone();
    }
    get EndPointDummy(): THREE.Object3D {
        return this.endPointDummy;
    }
    get EndPointLocalPosition(): THREE.Vector3 {
        return this.endPointDummy.position.clone();
    }
    get EndPointWorldPosition(): THREE.Vector3 {
        const worldPoint = new THREE.Vector3();
        this.endPointDummy.getWorldPosition(worldPoint);
        return worldPoint;
    }

    updateGeometry(extrudeShape: THREE.Shape) {
        // 이전 생성 리소스 제거
        this.dispose();

        // 커브점 업데이트
        this.curvePath.v0 = this.StartPointWorldPosition.clone();
        this.curvePath.v1 = this.ControlPointWorldPosition.clone();
        this.curvePath.v2 = this.EndPointWorldPosition.clone();

        // 재생성
        this.geometry = new THREE.ExtrudeGeometry(extrudeShape, {
            steps: 20,
            extrudePath: this.curvePath,
        });
        this.geometry.computeBoundingSphere(); // 센터점으로 정렬을 위해 바운딩 스피어 계산

        // geometry 중심점 이동 처리
        const center = this.geometry.boundingSphere ? this.geometry.boundingSphere.center.clone() : new THREE.Vector3();
        this.geometry.translate(-center.x, -center.y, -center.z);

        // 재질
        this.material = new THREE.MeshBasicMaterial({ color: this.segmentColor });

        // 중심위치로 이동
        this.position.copy(center);
    }

    dispose() {
        (this.material as THREE.Material).dispose();
        this.geometry.dispose();
    }
}

export {
    PathSegment3D
};