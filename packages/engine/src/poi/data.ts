import * as THREE from 'three';
import * as Event from '../eventDispatcher';
import * as Interfaces from '../interfaces';
import * as Util from '../util';
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
async function updatePoiMesh() {
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

        let mergedGeometry: THREE.BufferGeometry | undefined = undefined;
        let mergedMaterial: THREE.Material[] = [];
        if (url === undefined || url === '' || url === 'undefined') {
            // 모델url이 undefined이거나 빈문자열일 경우는 구체사용
            mergedGeometry = new THREE.SphereGeometry(0.1, 32, 32);
            mergedGeometry.addGroup(0, Infinity, 0);
            mergedMaterial.push(new THREE.MeshStandardMaterial({ color: 'red' }));
        } else {
            await Util.getMergedGeometry(url).then(data => {
                mergedGeometry = data.geometry;
                mergedMaterial = [].concat(data.material as any);
            });
        }

        // 인스턴스 메시 생성
        const mesh = new THREE.InstancedMesh(mergedGeometry, mergedMaterial, currPoiArray.length);
        mesh.receiveShadow = true;
        mesh.castShadow = true;

        // 인스턴스 메시 각 요소별 트랜스폼 처리
        const dummy = new THREE.Object3D();
        currPoiArray.forEach((poi, index) => {
            dummy.position.copy(poi.WorldPosition);
            dummy.rotation.copy(poi.PointMeshData.rotation);
            dummy.scale.copy(poi.PointMeshData.scale);
            dummy.updateMatrix();

            mesh.setMatrixAt(index, dummy.matrix);

            // poi 위치점 메시 데이터에 연결
            poi.PointMeshData.meshRef = mesh;
            poi.PointMeshData.instanceIndex = index;
        });
        mesh.instanceMatrix.needsUpdate = true;

        // 씬에 추가
        pointMeshGroup.add(mesh);
        // 위치점 메시 리스트에 추가
        pointMeshStorage[url] = mesh;
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

/**
 * 모든 poi의 익스포트용 데이터 얻기
 */
function ExportAll() {
    const result: any[] = [];
    Object.values(poiDataList).forEach(poi => result.push(poi.ExportData));
    return result;
}

/**
 * poi 제거
 * @param id - 제거할 poi id값
 */
function Delete(id: string) {
    if( poiDataList.hasOwnProperty(id)){
        const poi = poiDataList[id];
        poi.dispose();

        delete poiDataList[id];

        updatePoiLine();
        updatePoiMesh();
    }
}

export {
    Export,
    ExportAll,
    Delete,
}