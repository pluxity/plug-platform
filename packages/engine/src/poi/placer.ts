import * as THREE from 'three';
import * as Addon from 'three/addons';
import * as Interfaces from '../interfaces';
import * as PoiData from './data';
import * as ModelInternal from '../model/model';
import * as Util from '../util'
import { Engine3D } from '../engine';
import { PoiElement } from './element';

let engine: Engine3D;
let target: PoiElement;
let previewPointMesh: THREE.Object3D;
let completeCallback: Function;
let currentPicktarget: THREE.Object3D;
let bPlacerEnabled: boolean = false;
const mouseDownPos: THREE.Vector2 = new THREE.Vector2();

/**
 * 초기화
 */
function initialize(_engine: Engine3D) {
    engine = _engine;

    // 이벤트
    engine.EventHandler.addEventListener('onPoiCreate' as never, onPoiCreate);
}

/**
 * 메모리 해제
 */
function dispose() {
    engine.EventHandler.removeEventListener('onPoiCreate' as never, onPoiCreate);

    // 이벤트 등록 해제
    unRegisterPointerEvents();

    target?.dispose();
    target = null;

    previewPointMesh = null;
    completeCallback = null;
    currentPicktarget = null;
    bPlacerEnabled = false;
    engine = null;
}


/**
 * poi 데이터 추가 이벤트 콜백
 */
async function onPoiCreate(evt: any) {
    target = evt.target as PoiElement;
    completeCallback = evt.onCompleteCallback;

    // 미리보기용 위치점 메시
    if (target.modelUrl) {
        const loader = new Addon.GLTFLoader();
        const gltf = await loader.loadAsync(target.modelUrl);
        previewPointMesh = gltf.scene;
        engine.RootScene.add(previewPointMesh);
    } else {
        // modelurl이 유효하지 않으면 구체로 처리
        const geometry = new THREE.SphereGeometry(0.1, 32, 32);
        const material = new THREE.MeshStandardMaterial({ color: 'red' });
        previewPointMesh = new THREE.Mesh(geometry, material);
        previewPointMesh.name = '#PoiPlacerPreviewPointMesh';
        engine.RootScene.add(previewPointMesh);
    }

    registerPointerEvents();
}

/**
 * 포인터 이벤트 등록
 */
function registerPointerEvents() {
    engine.Dom.addEventListener('pointerdown', onPointerDown);
    engine.Dom.addEventListener('pointermove', onPointerMove);
    engine.Dom.addEventListener('pointerup', onPointerUp);

    bPlacerEnabled = true;
}

/**
 * 포인터 이벤트 등록 해제
 */
function unRegisterPointerEvents() {
    bPlacerEnabled = false;

    engine.Dom.removeEventListener('pointerdown', onPointerDown);
    engine.Dom.removeEventListener('pointermove', onPointerMove);
    engine.Dom.removeEventListener('pointerup', onPointerUp);
}

/**
 * 포인터 다운 이벤트 처리
 * @param evt - 이벤트 정보
 */
function onPointerDown(evt: PointerEvent) {
    if (evt.button === 0) {
        const pointerOffsetPoint = Util.getPointerOffsetPoint(evt.clientX, evt.clientY);
        mouseDownPos.x = pointerOffsetPoint.x;
        mouseDownPos.y = pointerOffsetPoint.y;
    }
}

/**
 * 포인터 이동 이벤트 처리
 * @param evt - 이벤트 정보
 */
function onPointerMove(evt: PointerEvent) {

    if (target) {
        const pointerOffsetPoint = Util.getPointerOffsetPoint(evt.clientX, evt.clientY);
        const mousePos = new THREE.Vector2(
            (pointerOffsetPoint.x / engine.Dom.clientWidth) * 2 - 1,
            -(pointerOffsetPoint.y / engine.Dom.clientHeight) * 2 + 1
        );

        const rayCast = new THREE.Raycaster();
        rayCast.layers.set(Interfaces.CustomLayer.Pickable);
        rayCast.setFromCamera(mousePos, engine.Camera);

        currentPicktarget = null;
        const intersects = rayCast.intersectObjects(engine.RootScene.children, true);
        if (intersects.length > 0) {
            // poi 위치
            target.WorldPosition = intersects[0].point.clone();

            // 미리보기 위치점 메시
            previewPointMesh.position.copy(target.WorldPosition);
            previewPointMesh.visible = true;
            previewPointMesh.layers.set(Interfaces.CustomLayer.Default);

            currentPicktarget = intersects[0].object;
        } else {
            // 배경 모델 실패시 평면과 교차 테스트 수행
            const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
            const point = new THREE.Vector3();
            if (rayCast.ray.intersectPlane(plane, point)) {
                // Poi 위치
                target.WorldPosition = point.clone();

                // 미리보기 위치점 메시
                previewPointMesh.position.copy(target.WorldPosition);
                previewPointMesh.visible = true;
                previewPointMesh.layers.set(Interfaces.CustomLayer.Default);
            }
        }
    }
}

/**
 * 포인터 업 이벤트 처리
 * @param evt - 이벤트 정보
 */
function onPointerUp(evt: PointerEvent) {
    if (evt.button === 0) {
        const currMousePos: THREE.Vector2 = Util.getPointerOffsetPoint(evt.clientX, evt.clientY);
        if (currMousePos.distanceTo(mouseDownPos) < 5.0) {

            // 층 id, 층기준 로컬좌표 값
            const floorObj = getFloorObject();
            target.FloorId = floorObj?.userData['floorId'];

            // poi 배치 이벤트 내부 통지
            engine.EventHandler.dispatchEvent({
                type: 'onPoiPlaced',
                target: target,
            });

            // 배치 완료 콜백 호출
            completeCallback?.(PoiData.Export(target.id));

            // 이벤트 등록 해제
            unRegisterPointerEvents();

            // 미리보기 위치점 메시 제거
            releasePreviewPointMesh();
        }
    }
}

/**
 * 층 id값 얻기
 * @returns - 층 id값
 */
function getFloorObject(): THREE.Object3D | undefined {

    if (currentPicktarget) {
        let floorObj: THREE.Object3D = null;
        currentPicktarget.traverseAncestors(parent => {
            if (!floorObj && parent.userData.hasOwnProperty('type')) {
                const parentType: string = parent.userData['type'];
                if (parentType.toLowerCase() === 'floor') {
                    floorObj = parent;
                }
            }
        });

        if (floorObj) {
            return floorObj;
        }
    }

    return ModelInternal.getLowestFloorObject();
}

/**
 * 위치점 메시 메모리 해제
 */
function releasePreviewPointMesh() {
    engine.RootScene.remove(previewPointMesh);
    previewPointMesh.traverse(child => {
        if (child instanceof THREE.Mesh) {
            child.geometry.dispose();

            if (Array.isArray(child.material)) {
                child.material.forEach(mat => {
                    mat.dispose();
                    mat.map?.dispose();
                });
            } else {
                child.material.dispose();
                child.material.map?.dispose();
            }
        }
    });
}

export {
    bPlacerEnabled as Enabled,

    initialize,
    dispose,
}