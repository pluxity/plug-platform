import * as THREE from 'three';
import * as Addon from 'three/addons';
import * as Event from '../eventDispatcher';
import * as Interfaces from '../interfaces';
import * as Placer from './placer';
import * as PoiEditor from './edit';
import * as Util from '../util';
import * as Effect from '../effect';
import { Engine3D } from '../engine';
import { PoiElement } from './element';

let engine: Engine3D;
let hoverObjects: THREE.Object3D[] = [];
// let hoverPoiList: PoiElement[] = [];
let poiEventGroup: THREE.Group;
const mouseDownPos: THREE.Vector2 = new THREE.Vector2();

/**
 * Engine3D 초기화 이벤트 콜백
 */
Event.InternalHandler.addEventListener('onEngineInitialized' as never, (evt: any) => {
    engine = evt.engine as Engine3D;

    // poi 이벤트 처리에서 사용할 그룹 객체
    poiEventGroup = new THREE.Group();
    poiEventGroup.name = '#PoiEventGroup';
    engine.RootScene.add(poiEventGroup);

    // 이벤트 등록
    engine.Dom.addEventListener('pointerdown', onPointerDown);
    engine.Dom.addEventListener('pointermove', onPointerMove);
    engine.Dom.addEventListener('pointerup', onPointerUp);
});

/**
 * Poi 생성 이벤트 처리
 */
Event.InternalHandler.addEventListener('onPoiCreate' as never, () => {
    clearHoverObjects();
});

/**
 * Poi 편집 시작 이벤트 처리
 */
Event.InternalHandler.addEventListener('onPoiStartEdit' as never, () => {
    clearHoverObjects();
});

/**
 * 호버링 객체 해제
 */
function clearHoverObjects() {
    // hoverPoiList.forEach(poi => {
    //     poi.TextVisible = false;
    // });
    // hoverPoiList = [];

    hoverObjects.forEach(item => {
        if (item instanceof THREE.Mesh) {
            poiEventGroup.remove(item);
            item.geometry.dispose();
            item.material.dispose();
        }
    });
    hoverObjects = [];
    Effect.Outline.setOutlineObjects(hoverObjects);
}

/**
 * 포인터 다운 이벤트 처리
 * @param evt - 이벤트 정보
 */
function onPointerDown(evt: PointerEvent) {

    if (Placer.Enabled || PoiEditor.Enabled)
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

    if (Placer.Enabled || PoiEditor.Enabled)
        return;

    const mousePos = new THREE.Vector2(
        (evt.offsetX / engine.Dom.clientWidth) * 2 - 1,
        -(evt.offsetY / engine.Dom.clientHeight) * 2 + 1
    );

    const rayCast = new THREE.Raycaster();
    rayCast.layers.set(Interfaces.CustomLayer.Pickable);
    rayCast.setFromCamera(mousePos, engine.Camera);

    clearHoverObjects();
    const poi = Util.getPoiFromRaycast(rayCast);
    if (poi) {
        if (poi.PointMeshData.instanceMeshRef) {
            const instanceCopyMesh = new THREE.Mesh(poi.PointMeshData.instanceMeshRef.geometry, new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.0 }));
            instanceCopyMesh.position.copy(poi.WorldPosition);
            instanceCopyMesh.rotation.copy(poi.Rotation);
            instanceCopyMesh.scale.copy(poi.Scale);
            poiEventGroup.attach(instanceCopyMesh);
            hoverObjects.push(instanceCopyMesh);
        }
        else if (poi.PointMeshData.animMeshRef)
            hoverObjects.push(poi.PointMeshData.animMeshRef);
        
        // poi.TextVisible = true;
        // hoverPoiList.push(poi);

        Effect.Outline.setOutlineObjects(hoverObjects);
    }
}

/**
 * 포인터 업 이벤트 처리
 * @param evt - 이벤트 정보
 */
function onPointerUp(evt: PointerEvent) {

    if (Placer.Enabled || PoiEditor.Enabled)
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

            const poi = Util.getPoiFromRaycast(rayCast);
            if (poi !== undefined) {
                // 이벤트 통지
                Event.ExternalHandler.dispatchEvent({
                    type: 'onPoiPointerUp',
                    target: poi.ExportData,
                    pointerEvent: evt,
                    screenPos: Util.toScreenPos(poi.WorldPosition.clone()),
                });
            }
        }
    }
}