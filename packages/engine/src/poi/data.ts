import * as THREE from 'three';
import * as Event from '../eventDispatcher';
import * as Interfaces from '../interfaces';
import { PoiElement } from './element';

const poiDataList: Record<string, PoiElement> = {};
let poiLine: THREE.LineSegments;
let poiLineGroup: THREE.Group;

Event.InternalHandler.addEventListener('onPoiSceneGroupCreated' as never, (evt: any) => {
    poiLineGroup = evt.lineGroup as THREE.Group;
});

/**
 * poi 생성 이벤트
 */
Event.InternalHandler.addEventListener('onPoiPlaced' as never, (evt: any) => {
    const data: PoiElement = evt.target as PoiElement;
    poiDataList[data.id] = data;

    updatePoiLine();
});

/**
 * poi 선 업데이트
 */
function updatePoiLine() {

    // 이전에 생성된 라인 제거
    if (poiLine !== undefined) {
        poiLineGroup.remove(poiLine);
        poiLine.geometry.dispose();
        (poiLine.material as THREE.Material).dispose();
    }

    // 라인 버텍스 수집
    const linePoints: THREE.Vector3[] = [];
    Object.values(poiDataList).forEach(element => {
        const p0 = element.WorldPosition.clone();
        const p1 = p0.clone().addScaledVector(new THREE.Vector3(0, 1, 0), element.LineHeight);

        linePoints.push(p0, p1);
    });

    // 라인 메시
    const geometry = new THREE.BufferGeometry().setFromPoints(linePoints);
    const material = new THREE.LineBasicMaterial({ color: 'red' });
    poiLine = new THREE.LineSegments(geometry, material);
    poiLine.name = '#PoiLine';
    poiLineGroup.add(poiLine);
}

/**
 * 익스포트용 poi 데이터 얻기
 * @param id - poi id값
 */
function Export(id: string) {
    if (poiDataList.hasOwnProperty(id)) {
        const poi = poiDataList[id];
        return poi.ExportData;
    }
}

export {
    Export
}