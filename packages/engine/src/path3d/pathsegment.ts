import * as THREE from 'three';

/**
 * 3d경로 표현 클래스
 */
class PathSegment3D extends THREE.Object3D {
    CurveStartPoint: any;
    CurveControlPoint: any;
    CurveEndPoint: any;

    // private curvePath?: THREE.Curve<THREE.Vector3>;
    // private extrudeBaseShape?: THREE.Shape; // 스플라인을 따라 생성되는 도형의 기본 형태

    // // 3d 리소스들
    // private extrudeGeometry?: THREE.ExtrudeGeometry;
    // private extrudeMaterial?: THREE.MeshBasicMaterial;
    // private extrudeMesh?: THREE.Mesh;

    /**
     * PathSegment 생성자
     */
    constructor() {
        super();

        //this.defineExtrudeBaseShape(1.0); // 기본 사각형 형태 정의
    }

    // /**
    //  * 스플라인을 따라 생성되는 도형의 기본 형태 정의(사각형태)
    //  * @param length - 도형의 길이
    //  */
    // defineExtrudeBaseShape(length: number) {
        
    //     const halfLength = length * 0.5;

    //     // 사각형 형태 정의
    //     this.extrudeBaseShape = new THREE.Shape();
    //     this.extrudeBaseShape.moveTo(-halfLength, -halfLength);
    //     this.extrudeBaseShape.lineTo(-halfLength, halfLength);
    //     this.extrudeBaseShape.lineTo(halfLength,  halfLength);
    //     this.extrudeBaseShape.lineTo(halfLength, -halfLength);
    //     this.extrudeBaseShape.lineTo(-halfLength, -halfLength);
    // }

    // /**
    //  * 커브객체 위치점 설정
    //  * @param start - 시작점 좌표
    //  * @param control - 제어점 좌표
    //  * @param end - 끝점 좌표
    //  */
    // setCurvePoints(start: THREE.Vector3, control: THREE.Vector3, end: THREE.Vector3) {        
    //     this.curvePath = new THREE.QuadraticBezierCurve3(start, control, end);
    // }

    // /**
    //  * geometry 업데이트
    //  */
    // updateVisuals() {
    //     // 이전 생성된 리소스 제거
    //     this.dispose();

    //     // 재생성
    //     this.extrudeGeometry = new THREE.ExtrudeGeometry(this.extrudeBaseShape, {
    //         steps: 20,
    //         extrudePath: this.curvePath,
    //     });
    //     this.extrudeGeometry.computeBoundingSphere(); // 센터점으로 정렬을 위해 바운딩 스피어 계산

    //     // geometry 중심점 정렬 처리
    //     const center = this.extrudeGeometry.boundingSphere ? this.extrudeGeometry.boundingSphere.center : new THREE.Vector3();
    //     this.extrudeGeometry.translate(-center.x, -center.y, -center.z);

    //     this.extrudeMaterial = new THREE.MeshBasicMaterial({ color: 'red' });
    //     this.extrudeMesh = new THREE.Mesh(this.extrudeGeometry, this.extrudeMaterial);
    //     this.add(this.extrudeMesh);

    //     // 중심위치로 이동
    //     this.position.copy(center);
    // }

    // /**
    //  * 3d 리소스 메모리 해제
    //  */
    // dispose() {
    //     this.parent?.remove(this);
    //     if (this.extrudeMesh) {
    //         this.remove(this.extrudeMesh);
    //         this.extrudeGeometry?.dispose();
    //         this.extrudeMaterial?.dispose();
    //     }
    // }
}

export {
    PathSegment3D
};