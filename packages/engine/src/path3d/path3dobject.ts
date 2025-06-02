import * as THREE from 'three';
import { Path3DPointObject } from './path3dpointobject';
import { Path3DLineObject } from './path3dlineobject';

/**
 * 경로 객체
 */
class Path3DObject extends THREE.Group {

    private pathWidth: number = 0.25;
    private pathColor: THREE.Color;

    private pointObjects: Path3DPointObject[] = [];
    private lineObjects: Path3DLineObject[] = [];
    private lineExtrudeShape: THREE.Shape;

    /**
     * 생성자
     * @param color - 경로 색상
     */
    constructor(color: THREE.ColorRepresentation) {
        super();

        this.pathColor = new THREE.Color(color);

        // geometry구성시 사용할 도형 형태
        const halfLength = this.pathWidth * 0.5;
        this.lineExtrudeShape = new THREE.Shape();
        this.lineExtrudeShape.moveTo(-halfLength, -halfLength);
        this.lineExtrudeShape.lineTo(-halfLength, halfLength);
        this.lineExtrudeShape.lineTo(halfLength, halfLength);
        this.lineExtrudeShape.lineTo(halfLength, -halfLength);
        this.lineExtrudeShape.lineTo(-halfLength, -halfLength);
    }

    /**
     * 메모리 해제
     */
    dispose() {
        // 위치점
        this.pointObjects.forEach(pointObj => {
            pointObj.dispose();
        });
        this.pointObjects = [];

        // 선
        this.lineObjects.forEach(lineObj => {
            this.remove(lineObj);
            lineObj.dispose();
        });
        this.lineObjects = [];
    }

    get ExportData(): boolean {
        return false;
    }

    /**
     * 경로의 마지막점
     */
    get LastPoint(): Path3DPointObject | undefined {
        if (this.pointObjects.length > 0)
            return this.pointObjects[this.pointObjects.length - 1];
        else
            return undefined;
    }

    get PathWidth(): number {
        return this.pathWidth;
    }

    get PathColor(): THREE.Color {
        return this.pathColor;
    }

    get ExtrudeShape(): THREE.Shape {
        return this.lineExtrudeShape;
    }

    /**
     * 경로객체 위치점 추가
     * @param worldPoint - 월드좌표
     * @param floor - 레이캐스트된 층 객체
     */
    addPathPoint(worldPoint: THREE.Vector3, floor: THREE.Object3D) {
        // 새 위치점 생성
        const newPointObj = new Path3DPointObject(this.pathWidth, this.pathColor);
        newPointObj.name = THREE.MathUtils.generateUUID();
        newPointObj.position.copy(worldPoint);
        newPointObj.userData['floorId'] = floor.userData['floorId'];
        floor.attach(newPointObj);

        this.pointObjects.push(newPointObj);
    }

    /**
     * 커브 위치점 추가
     * @param controlPoint - 제어점(월드좌표)
     * @param endPoint - 종료점(월드좌표)
     * @param floor - 층객체
     * @param isStraightLine - 직선여부
     */
    addCurvePoint(controlPoint: THREE.Vector3, endPoint: THREE.Vector3, floor: THREE.Object3D, isStraightLine: boolean) {
        // 새 위치점 - 제어점
        const controlPointObj = new Path3DPointObject(this.pathWidth, this.pathColor);
        controlPointObj.name = THREE.MathUtils.generateUUID();
        controlPointObj.position.copy(controlPoint);
        controlPointObj.userData['floorId'] = floor.userData['floorId'];
        floor.attach(controlPointObj);
        this.pointObjects.push(controlPointObj);

        // 새 위치점 - 종료점
        const endPointObj = new Path3DPointObject(this.pathWidth, this.pathColor);
        endPointObj.name = THREE.MathUtils.generateUUID();
        endPointObj.position.copy(endPoint);
        endPointObj.userData['floorId'] = floor.userData['floorId'];
        floor.attach(endPointObj);
        this.pointObjects.push(endPointObj);

        // 제어점 직선 여부 및 필요 객체 할당
        controlPointObj.userData['isStraightLine'] = isStraightLine;
        controlPointObj.userData['startPointObj'] = this.pointObjects[this.pointObjects.length - 3];
        controlPointObj.userData['endPointObj'] = endPointObj;

        this.updateLine();
    }

    /**
     * 선 객체 업데이트
     */
    updateLine() {
        // 이전 생성된 선객체 제거
        this.lineObjects.forEach(lineObj => {
            this.remove(lineObj);
            lineObj.dispose();
        });
        this.lineObjects = [];

        // 순회하며 생성
        if (this.pointObjects.length > 2) {
            for (let i = 0; i < this.pointObjects.length - 2; i += 2) {
                const startPoint = this.pointObjects[i + 0];
                const controlPoint = this.pointObjects[i + 1];
                const endPoint = this.pointObjects[i + 2];

                const lineObj = new Path3DLineObject(
                    startPoint.WorldPosition,
                    controlPoint.WorldPosition,
                    endPoint.WorldPosition,
                    this.lineExtrudeShape,
                    this.pathWidth,
                    this.pathColor
                );
                lineObj.setPointObjects(startPoint, controlPoint, endPoint);
                lineObj.updateGeometry();
                lineObj.name = THREE.MathUtils.generateUUID();
                this.attach(lineObj);
                this.lineObjects.push(lineObj);
            }
        }
    }

    showLine(floorId: string) {
        this.lineObjects.forEach(lineObj => {
            const isMatch = lineObj.checkFloorIdMatch(floorId);
            if (isMatch) {
                lineObj.visible = true;
            }
        });
    }

    hideLine(floorId: string) {
        this.lineObjects.forEach(lineObj => {
            const isMatch = lineObj.checkFloorIdMatch(floorId);
            if (isMatch) {
                lineObj.visible = false;
            }
        });
    }

    showAllLine() {
        this.lineObjects.forEach(lineObj => {
            lineObj.visible = true;
        });
    }

    hideAllLine() {
        this.lineObjects.forEach(lineObj => {
            lineObj.visible = false;
        });
    }
}

export {
    Path3DObject
}