import * as THREE from 'three';
import * as Event from '../eventDispatcher';
import * as Interfaces from '../interfaces';
import * as PoiData from './data';
import { Engine3D } from '../engine';
import { PoiElement } from './element';

let engine: Engine3D;
let target: PoiElement;
let completeCallback: Function | undefined = undefined;
let currentPicktarget: THREE.Object3D | undefined;
const mouseDownPos: THREE.Vector2 = new THREE.Vector2();

/**
 * Engine3D 초기화 이벤트 콜백
 */
Event.InternalHandler.addEventListener('onEngineInitialized' as never, (evt: any) => {
    engine = evt.engine as Engine3D;
});

/**
 * poi 데이터 추가 이벤트 콜백
 */
Event.InternalHandler.addEventListener('onPoiCreate' as never, (evt: any) => {
    target = evt.target as PoiElement;
    completeCallback = evt.onCompleteCallback;

    registerPointerEvents();
});

/**
 * 포인터 이벤트 등록
 */
function registerPointerEvents() {
    engine.Dom.addEventListener('pointerdown', onPointerDown);
    engine.Dom.addEventListener('pointermove', onPointerMove);
    engine.Dom.addEventListener('pointerup', onPointerUp);
}

/**
 * 포인터 이벤트 등록 해제
 */
function unRegisterPointerEvents() {
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
        mouseDownPos.x = evt.offsetX;
        mouseDownPos.y = evt.offsetY;
    }
}

/**
 * 포인터 이동 이벤트 처리
 * @param evt - 이벤트 정보
 */
function onPointerMove(evt: PointerEvent) {

    if (target !== undefined) {
        const mousePos = new THREE.Vector2(
            (evt.offsetX / engine.Dom.clientWidth) * 2 - 1,
            -(evt.offsetY / engine.Dom.clientHeight) * 2 + 1
        );

        const rayCast = new THREE.Raycaster();
        rayCast.layers.set(Interfaces.CustomLayer.Pickable);
        rayCast.setFromCamera(mousePos, engine.Camera);

        currentPicktarget = undefined;
        const intersects = rayCast.intersectObjects(engine.RootScene.children, true);
        if (intersects.length > 0) {
            target.WorldPosition = intersects[0].point.clone();
            currentPicktarget = intersects[0].object;
        } else {
            // 배경 모델 실패시 평면과 교차 테스트 수행
            const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
            const point = new THREE.Vector3();
            if (rayCast.ray.intersectPlane(plane, point)) {
                target.WorldPosition = point.clone();
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
        const currMousePos: THREE.Vector2 = new THREE.Vector2(evt.offsetX, evt.offsetY);
        if (currMousePos.distanceTo(mouseDownPos) < 5.0) {

            // 층 id, 층기준 로컬좌표 값
            const floorObj = getFloorObject();
            target.FloorId = floorObj?.userData['floorId'];

            // poi 배치 이벤트 내부 통지
            Event.InternalHandler.dispatchEvent({
                type: 'onPoiPlaced',
                target: target,
            });

            // 배치 완료 콜백 호출
            completeCallback?.(PoiData.Export(target.id));

            unRegisterPointerEvents();
        }
    }
}

/**
 * 층 id값 얻기
 * @returns - 층 id값
 */
function getFloorObject(): THREE.Object3D | undefined {

    if (currentPicktarget !== undefined) {
        let floorObj: THREE.Object3D | undefined = undefined;
        currentPicktarget.traverseAncestors(parent => {
            if (floorObj === undefined && parent.userData.hasOwnProperty('type')) {
                const parentType: string = parent.userData['type'];
                if (parentType.toLowerCase() === 'floor') {
                    floorObj = parent;
                }
            }
        });

        if (floorObj !== undefined) {
            return floorObj;
        }
    }

    return undefined;
}