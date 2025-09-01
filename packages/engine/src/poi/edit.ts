import * as THREE from 'three';
import * as Addon from 'three/addons';
import * as Interfaces from '../interfaces';
import * as PoiData from './data';
import * as Camera from '../camera';
import * as Util from '../util';
import { Engine3D } from '../engine';
import { PoiElement } from './element';

let engine: Engine3D;
let target: PoiElement;
const mouseDownPos: THREE.Vector2 = new THREE.Vector2();

let gizmo: Addon.TransformControls;
let previewObject: THREE.Object3D;
let _editMode: Addon.TransformControlsMode = 'translate';
let bPoiEditEnabled: boolean = false;
let edittedPoiList: string[] = [];

/**
 * 초기화
 */
function initialize(_engine: Engine3D) {
    engine = _engine;

    edittedPoiList = [];
}

/**
 * 메모리 해제
 */
function dispose() {

    bPoiEditEnabled = false;

    unregisterPointerEvents();
    disposePreviewObject();

    if (gizmo) {
        const helper = gizmo.getHelper();
        engine.RootScene.remove(helper);
        gizmo.dispose();
        gizmo = null;
    }

    target?.dispose();
    target = null;

    previewObject = null;
    _editMode = 'translate';
    bPoiEditEnabled = false;

    edittedPoiList = [];

    engine = null;
}

/**
 * 포인터 다운 이벤트 처리
 * @param event - 포인터 다운 이벤트 정보
 */
function onPointerDown(evt: MouseEvent) {

    if (evt.button === 0) {
        mouseDownPos.x = evt.offsetX;
        mouseDownPos.y = evt.offsetY;
    }
}

/**
 * 포인터 업 이벤트 처리
 * @param event - 포인터 업 이벤트 정보
 */
function onPointerUp(evt: MouseEvent) {

    if (evt.button === 0) {
        const currMousePos: THREE.Vector2 = new THREE.Vector2(evt.offsetX, evt.offsetY);
        if (currMousePos.distanceTo(mouseDownPos) < 5.0) {

            const mousePos = new THREE.Vector2(
                (evt.offsetX / engine.Dom.clientWidth) * 2 - 1,
                -(evt.offsetY / engine.Dom.clientHeight) * 2 + 1
            );

            const rayCast = new THREE.Raycaster();
            rayCast.layers.set(Interfaces.CustomLayer.Pickable);
            rayCast.setFromCamera(mousePos, engine.Camera);

            const result = Util.getPoiFromRaycast(rayCast);
            if (result) {
                target = result.poi;
                createEditPreviewObject();
                unregisterPointerEvents();
            }
        }
    }
}

/**
 * 포인터 이벤트 등록
 */
function registerPointerEvents() {
    engine.Dom.addEventListener('pointerdown', onPointerDown);
    engine.Dom.addEventListener('pointerup', onPointerUp);
}

/**
 * 포인터 이벤트 등록 해제
 */
function unregisterPointerEvents() {
    engine.Dom.removeEventListener('pointerdown', onPointerDown);
    engine.Dom.removeEventListener('pointerup', onPointerUp);
}

/**
 * 미리보기 객체 메모리 해제
 */
function disposePreviewObject() {
    if (previewObject) {
        gizmo.detach();
        engine.RootScene.remove(previewObject);
        previewObject.traverse(child => {
            if (child instanceof THREE.Mesh) {
                child.geometry.dispose();
                if (Array.isArray(child.material)) {
                    child.material.forEach(mat => {
                        mat.map?.dispose();
                        mat.dispose();
                    });
                } else {
                    child.material.map?.dispose();
                    child.material.dispose();
                }
            }
        });
    }
}

/**
 * 대상객체를 편집객체임을 표현하기 위해 재질을 붉은색 반투명 객체로 변경
 * @param target - 대상 객체
 */
function setObjectRedTransparent(target: THREE.Object3D) {
    const redMaterial = new THREE.MeshBasicMaterial({ color: 'red', transparent: true, opacity: 0.5 });
    target.renderOrder = 1;
    target.traverse(child => {
        if (child instanceof THREE.Mesh) {
            if (Array.isArray(child.material)) {
                child.material.forEach(mat => {
                    mat.map?.dispose();
                    mat.dispose();
                });
            } else {
                child.material.map?.dispose();
                child.material.dispose();
            }
            child.material = redMaterial;
            child.renderOrder = 1;
        }
    });
}

/**
 * poi 편집 시작
 * @param id - poi id값
 * @param editMode - 편집모드 ("translate" | "rotate" | "scale")
 */
async function createEditPreviewObject() {

    // 이전에 생성된 미리보기 객체 메모리 해제
    disposePreviewObject();

    // 편집 대상 poi의 modelUrl을 기준으로 편집용 임시 객체를 생성한다.
    if (target.modelUrl) {
        const loader = new Addon.GLTFLoader();
        const gltf = await loader.loadAsync(target.modelUrl);

        // 현재 poi의 상태를 적용
        previewObject = gltf.scene;
        engine.RootScene.add(previewObject);

        previewObject.position.copy(target.position);
        previewObject.rotation.copy(target.PointMeshData.rotation);
        previewObject.scale.copy(target.PointMeshData.scale);
    } else {
        const geometry = new THREE.SphereGeometry(0.1, 32, 32);
        const material = new THREE.MeshStandardMaterial({ color: 'red' });
        previewObject = new THREE.Mesh(geometry, material);
        engine.RootScene.add(previewObject);

        previewObject.position.copy(target.position);
        previewObject.rotation.copy(target.PointMeshData.rotation);
        previewObject.scale.copy(target.PointMeshData.scale);
    }

    // 재질 변경
    setObjectRedTransparent(previewObject);

    // 기즈모 생성
    gizmo = new Addon.TransformControls(engine.Camera, engine.CSSRenderer.domElement);
    gizmo.setMode(_editMode); // "translate" | "rotate" | "scale"
    gizmo.addEventListener('dragging-changed', (event) => {
        Camera.SetEnabled(!event.value);
    });
    gizmo.addEventListener('mouseUp', (event) => {
        target.WorldPosition = previewObject.position.clone();
        target.Rotation = previewObject.rotation.clone();
        target.Scale = previewObject.scale.clone();

        PoiData.updatePoiMesh();

        // 기즈모에서 버튼업 이벤트 발생시 편집했던 Poi의 id값을 저장
        if (edittedPoiList.indexOf(target.id) === -1)
            edittedPoiList.push(target.id);

        // 외부 이벤트 통지
        engine.EventHandler.dispatchEvent({
            type: 'onPoiTransformChange',
            target: target.ExportData
        });
    });
    gizmo.attach(previewObject);

    const helper = gizmo.getHelper();
    engine.RootScene.add(helper);
}

/**
 * poi 편집 시작
 * @param editMode - 편집모드 'translate', 'rotate', 'scale' 택1
 */
function StartEdit(editMode: string) {
    FinishEdit();

    _editMode = editMode as Addon.TransformControlsMode;

    registerPointerEvents();

    bPoiEditEnabled = true;

    engine.EventHandler.dispatchEvent({
        type: 'onPoiStartEdit',
    });

    edittedPoiList = [];
}

/**
 * poi 편집 종료
 */
function FinishEdit() {

    bPoiEditEnabled = false;

    unregisterPointerEvents();
    disposePreviewObject();

    // 외부 이벤트 통지
    const result: any[] = [];
    edittedPoiList.forEach(id => result.push(PoiData.Export(id)));

    engine.EventHandler.dispatchEvent({
        type: 'onPoiFinishEdit',
        targets: result,
    });

    if (gizmo) {
        const helper = gizmo.getHelper();
        engine.RootScene.remove(helper);
        gizmo.dispose();
    }

    edittedPoiList = [];
}

export {

    bPoiEditEnabled as Enabled,

    initialize,
    dispose,

    StartEdit,
    FinishEdit,
}