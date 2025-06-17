import * as THREE from 'three';
import * as Addon from 'three/addons';
import * as Event from '../eventDispatcher';
import * as Interfaces from '../interfaces';
import * as LabelCreator from './create';
import * as LabelEditor from './edit';
import * as LabelData from './data';
import * as Util from '../util';
import * as Effect from '../effect';
import { Engine3D } from '../engine';
import { Label3DElement } from './element';

let engine: Engine3D;
let hoverObjects: THREE.Object3D[] = [];
let labelEventGroup: THREE.Group;
const mouseDownPos: THREE.Vector2 = new THREE.Vector2();

/**
 * Engine3D 초기화 이벤트 콜백
 */
Event.InternalHandler.addEventListener('onEngineInitialized' as never, (evt: any) => {
    engine = evt.engine as Engine3D;

    // label3d 이벤트 처리에서 사용할 그룹 객체
    labelEventGroup = new THREE.Group();
    labelEventGroup.name = '#PoiEventGroup';
    engine.RootScene.add(labelEventGroup);

    // 이벤트 등록
    engine.Dom.addEventListener('pointerdown', onPointerDown);
    engine.Dom.addEventListener('pointermove', onPointerMove);
    engine.Dom.addEventListener('pointerup', onPointerUp);
});

/**
 * 라벨 생성 시작 이벤트 처리
 */
Event.InternalHandler.addEventListener('onLabel3DCreateStarted' as never, () => {
    clearHoverObjects();
});

/**
 * 라벨 편집 시작 이벤트 처리
 */
Event.InternalHandler.addEventListener('onLabel3DEditStarted' as never, () => {
    clearHoverObjects();
});

/**
 * 호버링 객체 해제
 */
function clearHoverObjects() {
    hoverObjects = [];
    Effect.Outline.setOutlineObjects(hoverObjects);
}

/**
 * 포인터 다운 이벤트 처리
 * @param evt - 이벤트 정보
 */
function onPointerDown(evt: PointerEvent) {

    if (LabelCreator.Enabled || LabelEditor.Enabled)
        return;

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

    if (LabelCreator.Enabled || LabelEditor.Enabled)
        return;

    const mousePos = new THREE.Vector2(
        (evt.offsetX / engine.Dom.clientWidth) * 2 - 1,
        -(evt.offsetY / engine.Dom.clientHeight) * 2 + 1
    );

    const rayCast = new THREE.Raycaster();
    rayCast.layers.set(Interfaces.CustomLayer.Pickable);
    rayCast.setFromCamera(mousePos, engine.Camera);

    clearHoverObjects();
    const labels: Label3DElement[] = LabelData.getPickableObjects();
    labels.forEach(label => Util.setObjectLayer(label, Interfaces.CustomLayer.Default | Interfaces.CustomLayer.Pickable));
    const intersects = rayCast.intersectObjects(labels, false);
    if (intersects.length > 0) {
        hoverObjects.push(intersects[0].object);
        Effect.Outline.setOutlineObjects(hoverObjects);
    }
    labels.forEach(label => Util.setObjectLayer(label, Interfaces.CustomLayer.Default | Interfaces.CustomLayer.Pickable));
}

/**
 * 포인터 업 이벤트 처리
 * @param evt - 이벤트 정보
 */
function onPointerUp(evt: PointerEvent) {

    if (LabelCreator.Enabled || LabelEditor.Enabled)
        return;

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

            const labels: Label3DElement[] = LabelData.getPickableObjects();
            const intersects = rayCast.intersectObjects(labels, false);
            if (intersects.length > 0) {
                const target: Label3DElement = intersects[0].object as Label3DElement;

                // 이벤트 통지
                Event.ExternalHandler.dispatchEvent({
                    type: 'onLabel3DPointerUp',
                    target: target.ExportData,
                    pointerEvent: evt,
                    screenPos: Util.toScreenPos(target.position.clone()),
                });
            }
        }
    }
}