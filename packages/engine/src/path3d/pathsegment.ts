import * as THREE from 'three';

/**
 * 3d경로 표현 클래스
 */
class PathSegment3D extends THREE.Mesh {

    private curvePath: THREE.QuadraticBezierCurve3= new THREE.QuadraticBezierCurve3();
    
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

    get StartPoint(): THREE.Vector3 {
        return this.curvePath.v0;
    }

    set StartPoint(value: THREE.Vector3) {
        this.curvePath.v0 = value;
    }

    get ControlPoint(): THREE.Vector3 {
        return this.curvePath.v1;
    }

    set ControlPoint(value: THREE.Vector3) {
        this.curvePath.v1 = value;
    }

    get EndPoint(): THREE.Vector3 {
        return this.curvePath.v2;
    }

    set EndPoint(value: THREE.Vector3) {
        this.curvePath.v2 = value;
    }

    updateGeometry(extrudeShape: THREE.Shape) {
        // 이전 생성 리소스 제거
        this.dispose();

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