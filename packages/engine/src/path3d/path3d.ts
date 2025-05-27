import * as THREE from 'three';
import * as Interfaces from '../interfaces';
import { PathSegment3D } from './pathsegment';
import { PathPoint3D } from './pathpoint';

/**
 * 경로 객체 클래스
 */
class Path3D extends THREE.Group {

    /**
     * 경로를 구성하는 각 위치점 객체 배열
     */
    private pointObjects: PathPoint3D[] = [];
    /**
     * 각 경로 구간별 객체 배열
     */
    private segments: PathSegment3D[] = [];
    /**
     * 스플라인을 따라 생성되는 도형의 기본 형태
     */
    private extrudeShape?: THREE.Shape;
    /**
     * 경로 너비
     */
    private pathWidth: number = 0.5;
    /**
     * 경로 색상
     */
    private pathColor: THREE.ColorRepresentation = 'red';

    /**
     * 생성자
     */
    constructor(color: THREE.ColorRepresentation = 'red') {
        super();

        this.pathColor = color;

        // geometry구성시 사용할 도형 형태
        const halfLength = this.pathWidth * 0.5;
        this.extrudeShape = new THREE.Shape();
        this.extrudeShape.moveTo(-halfLength, -halfLength);
        this.extrudeShape.lineTo(-halfLength, halfLength);
        this.extrudeShape.lineTo(halfLength,  halfLength);
        this.extrudeShape.lineTo(halfLength, -halfLength);
        this.extrudeShape.lineTo(-halfLength, -halfLength);
    }

    get PathColor(): THREE.ColorRepresentation {
        return this.pathColor;
    }

    get ExtrudeShape(): THREE.Shape {
        return this.extrudeShape!;
    }

    /**
     * 내보내기 데이터
     */
    get ExportData() {
        const segmentsData = this.segments.map(segment => ({
            start: new Interfaces.Vector3Custom().copy(segment.StartPoint).ExportData,
            control: new Interfaces.Vector3Custom().copy(segment.StartPoint).ExportData,
            end: new Interfaces.Vector3Custom().copy(segment.StartPoint).ExportData,
        }));

        return {
            id: this.name,
            color: this.pathColor.toString(),
            segments: segmentsData,
        };
    }

    /**
     * 메모리 해제
     */
    dispose() {
        // 구간
        this.segments.forEach(segment => {
            this.remove(segment);
            segment.dispose();
        });
        this.segments = [];

        // 위치점
        this.pointObjects.forEach(point => {
            this.remove(point);
            point.dispose();
        });
        this.pointObjects = [];
    }

    /**
     * 새 경로 구간을 전체 경로 객체에 추가
     * @param segment - 추가할 경로 구간
     */
    addSegment(segment: PathSegment3D) {
        this.segments.push(segment);
        this.attach(segment); // 월드 트랜스폼을 유지하며 현재 그룹 객체에 부착

        // 구간 추가시 각 구간의 이음부가 비어보이므로 실린더를 생성하여 각 시작/끝지점에 위치시킨다.
        const pointObj = new PathPoint3D(this.pathWidth * 0.5, this.pathWidth, this.pathColor);
        this.add(pointObj);
        pointObj.position.copy(segment.EndPoint);
        this.pointObjects.push(pointObj);
    }
}

export {
    Path3D,
}