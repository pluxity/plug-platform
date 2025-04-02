import * as THREE from 'three';
import * as Event from '../eventDispatcher';
import * as Interfaces from '../interfaces';
import * as Util from '../util';
import { PoiElement } from './element';
import { Engine3D } from '../engine';

let engine: Engine3D;
let poiDataList: Record<string, PoiElement> = {};
let poiLine: THREE.LineSegments;
let poiIconGroup: THREE.Group;
let poiTextGroup: THREE.Group;
let poiLineGroup: THREE.Group;
let pointMeshGroup: THREE.Group;
let pointMeshStorage: Record<string, THREE.InstancedMesh> = {};
let iconStorage: Record<string, THREE.SpriteMaterial> = {};
let sharedTextGeometry: THREE.PlaneGeometry;
let poiDummies: THREE.Object3D[] = [];

/**
 * Engine3D 초기화 이벤트 콜백
 */
Event.InternalHandler.addEventListener('onEngineInitialized' as never, (evt: any) => {
    engine = evt.engine as Engine3D;

    // 공용 텍스트 geometry
    sharedTextGeometry = new THREE.PlaneGeometry(1, 2.5, 1, 1);
    sharedTextGeometry.translate(0, 2.0, 0);

    (sharedTextGeometry.attributes.uv as THREE.BufferAttribute).setY(0, 1.5);
    (sharedTextGeometry.attributes.uv as THREE.BufferAttribute).setY(1, 1.5);
    (sharedTextGeometry.attributes.uv as THREE.BufferAttribute).setY(2, -1.0);
    (sharedTextGeometry.attributes.uv as THREE.BufferAttribute).setY(3, -1.0);
});

/**
 * Poi 씬그룹 초기화 이벤트 처리
 */
Event.InternalHandler.addEventListener('onPoiSceneGroupCreated' as never, (evt: any) => {
    poiIconGroup = evt.iconGroup as THREE.Group;
    poiTextGroup = evt.textGroup as THREE.Group;
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
 * 층 이동 전 이벤트 처리
 */
Event.InternalHandler.addEventListener('onModelBeforeMove' as never, (evt: any) => {
    const floorObjects: Record<string, THREE.Object3D> = evt.floorObjects;

    // 가시화 요소 숨기기
    poiIconGroup.visible = false;
    poiIconGroup.layers.set(Interfaces.CustomLayer.Invisible);

    poiTextGroup.visible = false;
    poiTextGroup.layers.set(Interfaces.CustomLayer.Invisible);

    poiLineGroup.visible = false;
    poiLineGroup.layers.set(Interfaces.CustomLayer.Invisible);

    pointMeshGroup.visible = false;
    pointMeshGroup.layers.set(Interfaces.CustomLayer.Invisible);

    // Poi<=>층별 더미객체 생성
    Object.values(poiDataList).forEach(poi => {

        // 층 객체 찾아 더미 생성 후 부착
        if (floorObjects.hasOwnProperty(poi.FloorId)) {

            const dummy = new THREE.Object3D();
            dummy.name = `${poi.id}.Dummy`;
            dummy.userData['targetPoiElement'] = poi;
            dummy.position.copy(poi.WorldPosition);

            const targetFloor = floorObjects[poi.FloorId];
            targetFloor.attach(dummy);

            poiDummies.push(dummy);
        }
    });
});

/**
 * 층 이동 후 이벤트 처리
 */
Event.InternalHandler.addEventListener('onModelAfterMove' as never, (evt: any) => {
    const floorObjects: Record<string, THREE.Object3D> = evt.floorObjects;

    // 이동된 더미객체의 위치값을 poi에 적용시킨다.
    poiDummies.forEach(dummy => {
        const worldPos = new THREE.Vector3();
        dummy.getWorldPosition(worldPos);

        const targetPoi = dummy.userData['targetPoiElement'];
        targetPoi.WorldPosition = worldPos;

        // 원래 층객체로부터 분리
        dummy.parent?.remove(dummy);
    });
    poiDummies = [];

    // poi선, 위치점메시 업데이트
    updatePoiLine();
    updatePoiMesh();

    // 가시화 요소 보이기
    poiIconGroup.visible = true;
    poiIconGroup.layers.set(Interfaces.CustomLayer.Default);

    poiTextGroup.visible = true;
    poiTextGroup.layers.set(Interfaces.CustomLayer.Default);

    poiLineGroup.visible = true;
    poiLineGroup.layers.set(Interfaces.CustomLayer.Default);

    pointMeshGroup.visible = true;
    pointMeshGroup.layers.set(Interfaces.CustomLayer.Default);
});

/**
 * id에 해당하는 poi가 생성되어 있는지 체크
 * @param id - poi id
 */
function exists(id: string): boolean {
    return poiDataList.hasOwnProperty(id);
}

/**
 * url주소로 아이콘 재질 얻기
 * @param url - 아이콘 url 주소
 */
function getIcon(url: string): THREE.SpriteMaterial {

    if (iconStorage.hasOwnProperty(url) === false) {
        iconStorage[url] = new THREE.SpriteMaterial({
            map: new THREE.TextureLoader().load(url),
            sizeAttenuation: false,
            toneMapped: false,
        });
    }

    return iconStorage[url];
}

/**
 * 텍스트 문자열을 three.js 메시로 생성
 * @param displayText - 표시명 텍스트 문자열
 */
function createTextMesh(displayText: string): THREE.Mesh {
    const textSize = new THREE.Vector2();
    const textMaterial = Util.createTextMaterial(displayText, textSize);
    const textMesh = new THREE.Mesh(sharedTextGeometry, textMaterial);
    textMesh.scale.set(textSize.x * 0.0015, textSize.y * 0.0015, 1);

    return textMesh;
}

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
        if (element.Visible) {
            const p0 = element.WorldPosition.clone();
            const p1 = p0.clone().addScaledVector(new THREE.Vector3(0, 1, 0), element.LineHeight);

            linePoints.push(p0, p1);
        }
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
            mergedMaterial.push(new THREE.MeshStandardMaterial({ color: 'red', envMap: engine.GeneratedCubeRenderTarget.texture, envMapIntensity: 0.1 }));
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
            dummy.scale.copy(poi.Visible ? poi.PointMeshData.scale : new THREE.Vector3(0, 0, 0));
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
 * poi 데이터 임포트
 * @param data - 임포트 데이터
 */
function Import(data: Interfaces.PoiImportOption | Interfaces.PoiImportOption[] | string) {
    console.log('data.ts Import Called.', data);

    // 비주얼 리소스 업데이트 없이 이전의 생성 요소 제거
    Clear(false);

    // 파라미터가 문자열이면 object로 전환
    if (typeof data === 'string')
        data = JSON.parse(data);

    // 배열로 전환
    if (Array.isArray(data) === false)
        data = [data as Interfaces.PoiImportOption];

    // 데이터 배열 순회하며 poi 생성
    data.forEach(item => {
        if (exists(item.id)) {
            console.warn(`${item.id} has already exists.`);
            return;
        }

        const iconMaterial = getIcon(item.iconUrl);
        const iconObj = new THREE.Sprite(iconMaterial);
        iconObj.center.set(0.5, 0.0);
        iconObj.scale.setScalar(0.05);
        poiIconGroup.add(iconObj);

        const textMesh = createTextMesh(item.displayText);
        poiTextGroup.add(textMesh);

        const element = new PoiElement({
            id: item.id,
            iconUrl: item.iconUrl,
            modelUrl: item.modelUrl,
            displayText: item.displayText,
            property: item.property,
        });
        element.position = new Interfaces.Vector3Custom();
        element.IconObject = iconObj;
        element.TextObject = textMesh;
        element.FloorId = item.floorId;
        element.WorldPosition = new THREE.Vector3(item.position.x, item.position.y, item.position.z);
        element.PointMeshData.rotation.set(item.rotation.x, item.rotation.y, item.rotation.z);
        element.PointMeshData.scale.copy(item.scale);

        poiDataList[item.id] = element;
    });

    // 업데이트
    updatePoiLine();
    updatePoiMesh();
}

/**
 * poi 제거
 * @param id - 제거할 poi id값
 */
function Delete(id: string) {
    if (poiDataList.hasOwnProperty(id)) {
        const poi = poiDataList[id];
        poi.dispose();

        delete poiDataList[id];

        updatePoiLine();
        updatePoiMesh();
    }
}

/**
 * poi 모두 제거
 */
function Clear(bUpdateVisuals: boolean = true) {
    Object.values(poiDataList).forEach(poi => poi.dispose());
    poiDataList = {};

    if (bUpdateVisuals) {
        updatePoiLine();
        updatePoiMesh();
    }
}

/**
 * poi 보기
 * @param id - poi id값
 */
function Show(id: string) {
    if (poiDataList.hasOwnProperty(id)) {
        poiDataList[id].Visible = true;

        updatePoiLine();
        updatePoiMesh();
    }
}

/**
 * poi 숨기기
 * @param id - poi id값
 */
function Hide(id: string) {
    if (poiDataList.hasOwnProperty(id)) {
        poiDataList[id].Visible = false;

        updatePoiLine();
        updatePoiMesh();
    }
}

/**
 * 모든 poi 보기
 */
function ShowAll() {
    Object.values(poiDataList).forEach(poi => {
        poi.Visible = true;
    });

    updatePoiLine();
    updatePoiMesh();
}

/**
 * 모든 poi 숨기기
 */
function HideAll() {
    Object.values(poiDataList).forEach(poi => {
        poi.Visible = false;
    });

    updatePoiLine();
    updatePoiMesh();
}

export {
    getIcon,
    createTextMesh,
    exists,

    Export,
    ExportAll,
    Import,
    Delete,
    Clear,
    Show,
    Hide,
    ShowAll,
    HideAll,
}