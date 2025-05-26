import * as THREE from 'three';
import * as Interfaces from '../interfaces';
import { PathSegment3D } from './pathsegment';

/**
 * 경로 객체 클래스
 */
class Path3D extends THREE.Group {
    /**
     * 경로 데이터
     */
    private data: Interfaces.Path3DData;

    /**
     * 각 경로 구간별 객체 배열
     */
    private segments: PathSegment3D[] = [];
    /**
     * 현재 편집중인 구간
     */
    private currentSegment?: PathSegment3D;

    /**
     * 생성자
     */
    constructor() {
        super();

        // 경로 데이터 기본값으로 초기화
        this.data = {
            id: THREE.MathUtils.generateUUID(),
            color: 0x00ff00,
            segments: [],
        };
    }

    /**
     * 내보내기 데이터
     */
    get ExportData(): Interfaces.Path3DData {
        return this.data;
    }

    /**
     * 메모리 해제
     */
    dispose() {
        throw new Error('Path3D.dispose() is not implemented');
    }

    /**
     * 직선 위치점 추가
     * @param point - 경로 위치점
     */
    addStraightPoint(point: THREE.Vector3) {

        // 현재 편집중인 구간이 있다면
        if (this.currentSegment) {
            // 중심점 계산
            const lastPoint = this.currentSegment.CurveStartPoint;
            const centerPoint = new THREE.Vector3().lerpVectors(lastPoint, point, 0.5);

            // 현재 구간에 곡선점 설정
            this.currentSegment.CurveControlPoint = centerPoint;
            this.currentSegment.CurveEndPoint = point;

            // 배열에 저장
            this.segments.push(this.currentSegment);
        }

        // 없다면 구간 새로 생성후 시작점 설정
        this.currentSegment = new PathSegment3D();
        this.currentSegment.CurveStartPoint = point;

    }

    /**
     * 곡선 위치점 추가
     * @param point - 경로 위치점
     * @param control - 곡선 제어점
     */
    addCurvedPoint(point: THREE.Vector3, control: THREE.Vector3) {

    }
}

export {
    Path3D,
}