import * as THREE from 'three';
import * as Event from '../eventDispatcher';
import * as Interfaces from '../interfaces';
import * as PoiData from './data';
import { Engine3D } from '../engine';

let engine: Engine3D;
let target: Interfaces.PoiData | undefined = undefined;
let completeCallback: Function | undefined = undefined;
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
    target = evt.target as Interfaces.PoiData;
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

        const intersects = rayCast.intersectObjects(engine.RootScene.children, true);
        if (intersects.length > 0) {
            target?.position?.copy(intersects[0].point);
            target?.iconObj?.position.copy(intersects[0].point);
        } else {
            // 배경 모델 실패시 평면과 교차 테스트 수행
            const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
            const point = new THREE.Vector3();
            if (rayCast.ray.intersectPlane(plane, point)) {
                target?.position?.copy(point);
                target?.iconObj?.position.copy(point);
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

            // poi 배치 이벤트 내부 통지
            Event.InternalHandler.dispatchEvent({
                type: 'onPoiPlaced',
                target: target,
            });

            // 배치 완료 콜백 호출
            completeCallback?.(PoiData.Export((target as Interfaces.PoiData).id));

            unRegisterPointerEvents();
        }
    }
}