import * as THREE from 'three';
import * as Addon from 'three/addons';
import * as Interfaces from '../interfaces';
import * as Util from '../util';
import * as ModelInternal from '../model/model';
import * as GltfInternal from '../loader/gltf';
import { PoiElement } from './element';
import { Engine3D } from '../engine';

let engine: Engine3D;
let poiDataList: Record<string, PoiElement> = {};
let poiIconGroup: THREE.Group;
let poiHtmlObjGroup: THREE.Group;
let pointMeshGroup: THREE.Group;
let pointMeshStorage: Record<string, THREE.InstancedMesh> = {};
let iconStorage: Record<string, THREE.SpriteMaterial> = {};
let poiDummies: THREE.Object3D[] = [];
let bNeedsUpdate: boolean = false;
let htmlVisibilityCheck: boolean = true;

/**
 * 초기화
 */
function initialize(_engine: Engine3D) {
    engine = _engine;

    // 이벤트
    engine.EventHandler.addEventListener('onBeforeRender' as never, onBeforeRender);
    engine.EventHandler.addEventListener('onPoiSceneGroupCreated' as never, onPoiSceneGroupCreated);
    engine.EventHandler.addEventListener('onPoiPlaced' as never, onPoiPlaced);
    engine.EventHandler.addEventListener('onModelBeforeMove' as never, onModelBeforeMove);
    engine.EventHandler.addEventListener('onModelAfterMove' as never, onModelAfterMove);
    engine.EventHandler.addEventListener('onModelShow' as never, onModelShow);
    engine.EventHandler.addEventListener('onModelHide' as never, onModelHide);
    engine.EventHandler.addEventListener('onModelShowAll' as never, onModelShowAll);
    engine.EventHandler.addEventListener('onModelHideAll' as never, onModelHideAll);
}

/**
 * 메모리 해제
 */
function dispose() {
    engine.EventHandler.removeEventListener('onBeforeRender' as never, onBeforeRender);
    engine.EventHandler.removeEventListener('onPoiSceneGroupCreated' as never, onPoiSceneGroupCreated);
    engine.EventHandler.removeEventListener('onPoiPlaced' as never, onPoiPlaced);
    engine.EventHandler.removeEventListener('onModelBeforeMove' as never, onModelBeforeMove);
    engine.EventHandler.removeEventListener('onModelAfterMove' as never, onModelAfterMove);
    engine.EventHandler.removeEventListener('onModelShow' as never, onModelShow);
    engine.EventHandler.removeEventListener('onModelHide' as never, onModelHide);
    engine.EventHandler.removeEventListener('onModelShowAll' as never, onModelShowAll);
    engine.EventHandler.removeEventListener('onModelHideAll' as never, onModelHideAll);

    Clear();

    // 메시 객체들 제거
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

    poiDataList = {};
    poiIconGroup = null;
    poiHtmlObjGroup = null;
    pointMeshGroup = null;
    pointMeshStorage = {};
    iconStorage = {};
    poiDummies = [];
    bNeedsUpdate = false;
    engine = null;
}

/**
 * Engine3D 렌더링 전 이벤트 처리
 */
async function onBeforeRender(evt: any) {
    const deltaTime = evt.deltaTime as number;
    // 애니메이션 믹서 업데이트
    const animPoiList = Object.values(poiDataList).filter(poi => poi.Mixer !== undefined && poi.Mixer !== null);
    animPoiList.forEach(animPoi => animPoi.Mixer?.update(deltaTime));

    // Poi Html 객체 가시성 체크
    if (htmlVisibilityCheck) {
        Object.values(poiDataList).forEach(poi => {
            if (poi.Visible) {
                // 광선 방향
                const rayDir = new THREE.Vector3().subVectors(poi.TextWorldPosition, engine.Camera.position);
                const rayDistance = engine.Camera.position.distanceTo(poi.TextWorldPosition);
                rayDir.normalize();

                // 광선
                const rayCaster = new THREE.Raycaster(engine.Camera.position, rayDir, 0.1, rayDistance);
                const intersects = rayCaster.intersectObjects(ModelInternal.ModelGroup.children, true);
                if (intersects.length > 0) // 카메라투영점과 위치점에 걸리는것이 있으면 가시화 비활성화
                    poi.TextVisible = false;
                else
                    poi.TextVisible = true;
            }
        });
    }

    // 업데이트가 필요한경우
    if (bNeedsUpdate) {
        bNeedsUpdate = false;
        await updatePoiMesh();
    }
}

/**
 * Poi 씬그룹 초기화 이벤트 처리
 */
function onPoiSceneGroupCreated(evt: any) {
    poiIconGroup = evt.iconGroup as THREE.Group;
    poiHtmlObjGroup = evt.htmlObjGroup as THREE.Group;
    pointMeshGroup = evt.pointMeshGroup as THREE.Group;
}

/**
 * poi 생성 이벤트
 */
function onPoiPlaced(evt: any) {
    const data: PoiElement = evt.target as PoiElement;
    poiDataList[data.id] = data;

    bNeedsUpdate = true;
}

/**
 * 층 이동 전 이벤트 처리
 */
function onModelBeforeMove(evt: any) {
    const floorObjects: Record<string, THREE.Object3D> = evt.floorObjects;

    // 가시화 요소 숨기기
    poiIconGroup.visible = false;
    poiIconGroup.layers.set(Interfaces.CustomLayer.Invisible);

    poiHtmlObjGroup.visible = false;
    poiHtmlObjGroup.layers.set(Interfaces.CustomLayer.Invisible);

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
}

/**
 * 층 이동 후 이벤트 처리
 */
function onModelAfterMove(evt: any) {
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
    bNeedsUpdate = true;

    // 가시화 요소 보이기
    poiIconGroup.visible = true;
    poiIconGroup.layers.set(Interfaces.CustomLayer.Default);

    poiHtmlObjGroup.visible = true;
    poiHtmlObjGroup.layers.set(Interfaces.CustomLayer.Default);

    pointMeshGroup.visible = true;
    pointMeshGroup.layers.set(Interfaces.CustomLayer.Default);
}

/**
 * 특정층 가시화 이벤트 처리
 */
function onModelShow(evt: any) {
    const floorId: string = evt.floorId;
    Object.values(poiDataList).forEach(poi => {
        if (poi.FloorId === floorId) {
            poi.Visible = true;
            poi.TextVisible = true;
        }
    });

    bNeedsUpdate = true;
}

/**
 * 특정층 숨기기 이벤트 처리
 */
function onModelHide(evt: any) {
    const floorId: string = evt.floorId;
    Object.values(poiDataList).forEach(poi => {
        if (poi.FloorId === floorId) {
            poi.Visible = false;
            poi.TextVisible = false;
        }
    });

    bNeedsUpdate = true;
}

/**
 * 모든층 가시화 이벤트 처리
 */
function onModelShowAll(evt: any) {

    Object.values(poiDataList).forEach(poi => {
        poi.Visible = true;
        poi.TextVisible = true;
    });

    bNeedsUpdate = true;
}

/**
 * 모든층 숨기기 이벤트 처리
 */
function onModelHideAll(evt: any) {

    Object.values(poiDataList).forEach(poi => {
        poi.Visible = false;
        poi.TextVisible = false;
    });

    bNeedsUpdate = true;
}

/**
 * id에 해당하는 poi가 생성되어 있는지 체크
 * @param id - poi id
 */
function exists(id: string): boolean {
    return poiDataList.hasOwnProperty(id);
}

/**
 * id에 해당하는 poi 데이터 얻기
 * @param id - poi id
 * @returns - poi데이터
 */
function getPoiElement(id: string): PoiElement {
    return poiDataList[id];
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
 * Html 객체 생성
 * @param htmlString - 표시명 텍스트 문자열
 */
function createHtmlObject(htmlString: string): Addon.CSS2DObject {
    // 빈 div 생성
    const emptyDiv = document.createElement('div');
    emptyDiv.innerHTML = htmlString;

    const textObj = new Addon.CSS2DObject(emptyDiv);

    return textObj;
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
        // 정적 객체는 인스턴싱 처리
        const currPoiArray = collect[url];

        const gltfData = await GltfInternal.getGltfWithAnimation(url);
        if (gltfData.animations.length > 0) {
            // 애니메이션 객체는 인스턴싱 처리를 하지않고 개별 생성
            currPoiArray.forEach(poi => {
                // 위치점 메시 데이터에서 애니메이션 메시가 유효하지 않은 경우만 메시 초기화 및 애니메이션 클립 처리 수행
                if (!poi.PointMeshData.animMeshRef) {
                    const clonedScene = gltfData.scene.clone();
                    pointMeshGroup.add(clonedScene); // 씬에 추가
                    poi.PointMeshData.animMeshRef = clonedScene; // poi에 복제된 씬 설정
                    // 애니메이션 믹서
                    const mixer = new THREE.AnimationMixer(poi.PointMeshData.animMeshRef as THREE.Object3D);
                    poi.Mixer = mixer; // poi에 믹서 설정
                    // 애니메이션 클립 처리
                    gltfData.animations.forEach(clip => {
                        const animationName = clip.name;
                        const action = mixer.clipAction(clip);
                        action.loop = THREE.LoopOnce; // 한번 재생후 종료
                        action.clampWhenFinished = true; // 애니메이션 종료후 마지막 상태 유지
                        poi.AnimationActions[animationName] = action; // poi에 처리된 애니메이션 액션 설정
                    });
                }
                // 위치 설정
                poi.PointMeshData.animMeshRef?.position.copy(poi.WorldPosition);
                poi.PointMeshData.animMeshRef?.rotation.copy(poi.Rotation);
                poi.PointMeshData.animMeshRef?.scale.copy(poi.Scale);

                // 바운딩
                const bounds = new THREE.Box3().setFromObject(poi.PointMeshData.animMeshRef);
                bounds.getSize(poi.PointMeshData.localSize);
                poi.WorldPosition = poi.WorldPosition;

                // 레이어 설정
                Util.setObjectLayer(poi.PointMeshData.animMeshRef as THREE.Object3D, Interfaces.CustomLayer.Default | Interfaces.CustomLayer.Pickable);
            });

        } else {

            let mergedGeometry: THREE.BufferGeometry = null;
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

            mergedGeometry?.computeBoundingBox();
            mergedGeometry?.computeBoundingSphere();

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

                // 바운딩
                const bounds = mergedGeometry.boundingBox.clone();
                bounds.getSize(poi.PointMeshData.localSize);
                poi.WorldPosition = poi.WorldPosition;

                // poi 위치점 메시 데이터에 연결
                poi.PointMeshData.instanceMeshRef = mesh;
                poi.PointMeshData.instanceIndex = index;
            });
            mesh.instanceMatrix.needsUpdate = true;

            // 씬에 추가
            pointMeshGroup.add(mesh);
            // 위치점 메시 리스트에 추가
            pointMeshStorage[url] = mesh;

            // 레이어 설정
            Util.setObjectLayer(mesh as THREE.Object3D, Interfaces.CustomLayer.Default | Interfaces.CustomLayer.Pickable);
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

        const textMesh = createHtmlObject(item.htmlString);
        poiHtmlObjGroup.add(textMesh);

        // poi element 익스포트시 내보내지는 위치값은 층기준 로컬좌표이므로, 초기 생성을 위해 월드좌표로 변환한다.
        const convertedPosition = ModelInternal.convertFloorLocalToWorld(new THREE.Vector3(item.position.x, item.position.y, item.position.z), item.floorId);

        const element = new PoiElement({
            id: item.id,
            iconUrl: item.iconUrl,
            modelUrl: item.modelUrl,
            htmlString: item.htmlString,
            property: item.property,
        });
        element.position = new Interfaces.Vector3Custom();
        element.IconObject = iconObj;
        element.TextObject = textMesh;
        element.FloorId = item.floorId;
        element.WorldPosition = convertedPosition;//new THREE.Vector3(item.position.x, item.position.y, item.position.z);
        element.PointMeshData.rotation.set(item.rotation.x, item.rotation.y, item.rotation.z);
        element.PointMeshData.scale.copy(item.scale);

        poiDataList[item.id] = element;
    });

    // 업데이트
    bNeedsUpdate = true;
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

        bNeedsUpdate = true;
    }
}

/**
 * poi 모두 제거
 */
function Clear(bUpdateVisuals: boolean = true) {
    Object.values(poiDataList).forEach(poi => poi.dispose());
    poiDataList = {};

    if (bUpdateVisuals) {
        bNeedsUpdate = true;
    }
}

/**
 * poi 보기
 * @param id - poi id값
 */
function Show(id: string) {
    if (poiDataList.hasOwnProperty(id)) {
        poiDataList[id].Visible = true;

        bNeedsUpdate = true;
    }
}

/**
 * poi 숨기기
 * @param id - poi id값
 */
function Hide(id: string) {
    if (poiDataList.hasOwnProperty(id)) {
        poiDataList[id].Visible = false;

        bNeedsUpdate = true;
    }
}

/**
 * 모든 poi 보기
 */
function ShowAll() {
    Object.values(poiDataList).forEach(poi => {
        poi.Visible = true;
    });

    bNeedsUpdate = true;
}

/**
 * 모든 poi 숨기기
 */
function HideAll() {
    Object.values(poiDataList).forEach(poi => {
        poi.Visible = false;
    });

    bNeedsUpdate = true;
}

/**
 * poi html 객체 보이기
 * @param id - poi id값
 */
function ShowHtmlObject(id: string) {
    if (poiDataList.hasOwnProperty(id))
        poiDataList[id].TextVisible = true;
}

/**
 * poi 표시명 숨기기
 * @param id - poi id값
 */
function HideHtmlObject(id: string) {
    if (poiDataList.hasOwnProperty(id))
        poiDataList[id].TextVisible = false;
}

/**
 * 모든 poi 표시명 보이기
 */
function ShowAllHtmlObject() {
    Object.values(poiDataList).forEach(poi => poi.TextVisible = true);
}

/**
 * 모든 poi 표시명 숨기기
 */
function HideAllHtmlObject() {
    Object.values(poiDataList).forEach(poi => poi.TextVisible = false);
}

/**
 * poi 표시명 텍스트 변경
 * @param id - 변경할 poi id값
 * @param text - 표시명 텍스트
 */
function SetTextInnerHtml(id: string, htmlString: string) {
    if (poiDataList.hasOwnProperty(id)) {
        const poi = poiDataList[id];

        poi.htmlString = htmlString;
        poi.TextObject.element.innerHTML = htmlString;
        //poi.WorldPosition = poi.WorldPosition;
    }
}

/**
 * id에 해당하는 poi가 가지고 있는 애니메이션 목록을 얻음
 * @param id - poi id값
 */
function GetAnimationList(id: string) {
    if (poiDataList.hasOwnProperty(id)) {
        const poi = poiDataList[id];
        return Object.keys(poi.AnimationActions);
    }
}

/**
 * poi의 애니메이션을 재생한다.
 * @param id - poi id값
 * @param animName - 애니메이션 이름
 */
function PlayAnimation(id: string, animName: string) {
    if (poiDataList.hasOwnProperty(id)) {
        const poi = poiDataList[id];
        poi.playAnimation(animName);
    }
}

/**
 * 재생중인 poi의 애니메이션을 중지한다.
 * @param id - poi id값
 */
function StopAnimation(id: string) {
    if (poiDataList.hasOwnProperty(id)) {
        const poi = poiDataList[id];
        poi.stopAnimation();
    }
}

/**
 * Html 가시성 체크 여부 설정
 * @param newCheckState - Html 가시성 체크 여부
 */
function SetHtmlObjectVisibilityCheck(newCheckState: boolean) {
    htmlVisibilityCheck = newCheckState;

    // false인경우 각 poi 가시화 상태에 따라 html 객체 가시화 설정
    if (!htmlVisibilityCheck) {
        Object.values(poiDataList).forEach(poi => poi.TextVisible = poi.Visible);
    }
}

export {
    poiDataList as PoiDataList,

    initialize,
    dispose,

    getIcon,
    createHtmlObject,
    exists,
    getPoiElement,
    updatePoiMesh,

    Export,
    ExportAll,
    Import,
    Delete,
    Clear,

    Show,
    Hide,
    ShowAll,
    HideAll,

    ShowHtmlObject,
    HideHtmlObject,
    ShowAllHtmlObject,
    HideAllHtmlObject,

    SetTextInnerHtml,

    GetAnimationList,
    PlayAnimation,
    StopAnimation,
    SetHtmlObjectVisibilityCheck,
}