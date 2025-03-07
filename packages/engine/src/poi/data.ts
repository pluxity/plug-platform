import * as THREE from 'three';
import * as Event from '../eventDispatcher';
import * as Interfaces from '../interfaces';
import { PoiElement } from './element';

const poiDataList: Record<string, PoiElement> = {};
let poiLine: THREE.LineSegments;
let poiLineGroup: THREE.Group;
let pointMeshGroup: THREE.Group;
let pointMeshStorage: Record<string, THREE.InstancedMesh> = {};

/**
 * Poi 씬그룹 초기화 이벤트 처리
 */
Event.InternalHandler.addEventListener('onPoiSceneGroupCreated' as never, (evt: any) => {
    poiLineGroup = evt.lineGroup as THREE.Group;
    pointMeshGroup = evt.pointMeshGroup as THREE.Group;
});

/**
 * poi 생성 이벤트
 */
Event.InternalHandler.addEventListener('onPoiPlaced' as never, (evt: any) => {
    const data: PoiElement = evt.target as PoiElement;
    poiDataList[data.id] = data;

    updatePoiLine();
    updatePoiMesh();
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
 * poi 위치점 객체 업데이트
 */
function updatePoiMesh() {
    // 이전에 생성된 위치점 메시 객체들 제거
    Object.values(pointMeshStorage).forEach(mesh => {
        mesh.geometry.dispose();
        if (Array.isArray(mesh.material)) {
            mesh.material.forEach(material => {
                (material as any).map?.dispose();
                material.dispose();
            });
        } else {
            (mesh.material as any).map?.dispose();
            mesh.material.dispose();
        }
        pointMeshGroup.remove(mesh);
    });
    pointMeshStorage = {};

    // poi의 모델파일 url기준으로 수집
    const collect: Record<string, PoiElement[]> = {};
    Object.values(poiDataList).forEach(poi => {
        const modelUrl: string = poi.modelUrl as string;
        if (collect.hasOwnProperty(modelUrl) === false)
            collect[modelUrl] = [];

        collect[modelUrl].push(poi);
    });

    // url 기준으로 수집한 정보로 인스턴스 메시 생성
    for (let url in collect) {
        const currPoiArray = collect[url];

        let mergedGeometry: THREE.BufferGeometry;
        let mergedMaterial: THREE.Material[] = [];
        if (url === undefined || url === '') {
            // 모델url이 undefined이거나 빈문자열일 경우는 구체사용
            mergedGeometry = new THREE.SphereGeometry(0.1, 32, 32);
            mergedMaterial.push(new THREE.MeshStandardMaterial({ color: 'red' }));
        } else {
            
        }
    }
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