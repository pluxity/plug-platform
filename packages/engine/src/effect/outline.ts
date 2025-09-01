import * as THREE from 'three';
import * as Addon from 'three/addons';
import * as PoiData from '../poi/data';
import * as Interfaces from '../interfaces';
import { Engine3D } from '../engine';

let engine: Engine3D;
let outlinePass: Addon.OutlinePass;
let outlineTargets: THREE.Object3D[] = [];

const outlineObjectKeyList = new Set([]);
let transparentObjectGroup: THREE.Group = null;
const defaultOutlineOptions: Interfaces.OutlineOptions = {
    edgeStrength: 10.0,
    edgeGlow: 0.0,
    edgeThickness: 5.0,
    pulsePeriod: 0.0,
    visibleEdgeColor: 0xffffff,
    hiddenEdgeColor: 0xffffff,
};

/**
 * 외각선 기능 초기화
 * @param _engine - Engine3D 인스턴스
 */
function initialize(_engine: Engine3D) {
    engine = _engine;

    // poi용 외각선 투명 객체 그룹
    transparentObjectGroup = new THREE.Group();
    transparentObjectGroup.name = '#OutlineTransparentObjectGroup';
    engine.RootScene.add(transparentObjectGroup);

    // 외각선 렌더링 패스 등록
    const container = engine.Dom as HTMLElement;
    outlinePass = new Addon.OutlinePass(new THREE.Vector2(container.clientWidth, container.clientHeight), engine.RootScene, engine.Camera);
    outlinePass.hiddenEdgeColor = new THREE.Color('white');
    outlinePass.edgeThickness = 5.0;
    outlinePass.edgeStrength = 10.0;
    engine.Composer.addPass(outlinePass);

    // 외각선 패스 사용시 씬이 어두워 지는 이슈가 있으므로 GammaCorrectionShader를 추가한다.
    const gammaCorrectionPass = new Addon.ShaderPass(Addon.GammaCorrectionShader);
    engine.Composer.addPass(gammaCorrectionPass);
}

/**
 * 외각선 기능 메모리 해제
 */
function dispose() {
    clearOutlineObjects();

    // outlinePass.dispose(); // 각 pass의 dispose는 Engine3D.dispose()에서 처리되므로 별도로 호출하지 않는다.
    outlinePass = null;

    outlineTargets = [];
    outlineObjectKeyList.clear();

    engine = null;
}

/**
 * 외각선 대상 객체 제거
 */
function clearOutlineObjects() {

    // 투명 객체
    outlineTargets.forEach(object => {
        if (object instanceof THREE.Mesh && object.userData['needsDispose']) {
            transparentObjectGroup.remove(object);
            object.geometry.dispose();
            object.material.dispose();
        }
    });
    outlineTargets = [];
    outlineObjectKeyList.clear();

    if (outlinePass)
        outlinePass.selectedObjects = outlineTargets;
}

/**
 * 대상 객체를 외각선으로 설정
 * @param target - 대상 객체
 */
function setOutlineObjects(target: THREE.Object3D | THREE.Object3D[]) {
    outlineTargets = [];
    if (Array.isArray(target))
        outlineTargets = outlineTargets.concat(target);
    else
        outlineTargets.push(target);

    if (outlinePass)
        outlinePass.selectedObjects = outlineTargets;
}

/**
 * 대상 객체를 외각선 목록에 추가
 * @param target - 대상 객체
 */
function addOutlineObjects(target: THREE.Object3D | THREE.Object3D[]) {
    if (Array.isArray(target))
        outlineTargets = outlineTargets.concat(target);
    else
        outlineTargets.push(target);
    outlinePass.selectedObjects = outlineTargets;
}

/**
 * 외각선 대상 객체 얻기
 * @returns - 외각선 대상 객체
 */
function getOutlineTargets(): THREE.Object3D[] {
    return outlineTargets;
}

/**
 * id에 해당하는 poi의 외각선 설정
 * @param id - poi id값
 */
function SetPoiOutline(id: string | string[]) {

    // clearOutlineObjects();

    if (!Array.isArray(id))
        id = [id];

    id.forEach(item => {

        // 이미 외각선 목록에 있는지 검사
        if (!outlineObjectKeyList.has(item)) {
            const poi = PoiData.getPoiElement(item);
            if (poi) {
                // poi가 사용하는 3d모델이 인스턴스메시인경우 복제하여 처리
                if (poi.PointMeshData.instanceMeshRef) {

                    const source = poi.PointMeshData.instanceMeshRef;
                    const clonedMesh = new THREE.Mesh(source.geometry, new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.0 }));
                    clonedMesh.position.copy(poi.WorldPosition);
                    clonedMesh.rotation.copy(poi.Rotation);
                    clonedMesh.scale.copy(poi.Scale);
                    clonedMesh.userData['needsDispose'] = true;
                    clonedMesh.userData['sourcePoiId'] = item;
                    transparentObjectGroup.attach(clonedMesh);
                    outlineTargets.push(clonedMesh);
                } else {
                    outlineTargets.push(poi.PointMeshData.animMeshRef);
                }
            }

            outlineObjectKeyList.add(item);
        }


    });

    outlinePass.selectedObjects = outlineTargets;
}

/**
 * 외각선 옵션 설정
 * @param options - 옵션
 */
function SetOutlineOptions(options: Interfaces.OutlineOptions) {
    const newOption = { ...defaultOutlineOptions, ...options };
    newOption.visibleEdgeColor = new THREE.Color(newOption.visibleEdgeColor);
    newOption.hiddenEdgeColor = new THREE.Color(newOption.hiddenEdgeColor);
    Object.assign(outlinePass, newOption);
}

export {
    initialize,
    dispose,

    clearOutlineObjects,
    setOutlineObjects,
    addOutlineObjects,
    getOutlineTargets,

    SetPoiOutline,
    SetOutlineOptions,
}