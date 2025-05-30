import * as THREE from 'three';
import * as Event from '../eventDispatcher';
import * as Interfaces from '../interfaces';
import * as PoiData from './data';
import * as Placer from './placer';
import { PoiElement } from './element';
import { Engine3D } from '../engine';

let engine: Engine3D;
const mouseDownPos: THREE.Vector2 = new THREE.Vector2();

/**
 * Engine3D 초기화 이벤트 콜백
 */
Event.InternalHandler.addEventListener('onEngineInitialized' as never, (evt: any) => {
    engine = evt.engine as Engine3D;

    // 이벤트 등록
    engine.Dom.addEventListener('pointerdown', onPointerDown);
    engine.Dom.addEventListener('pointerup', onPointerUp);
});

/**
 * 전체 poi 목록에서 마우스 레이캐스트를 위한 객체 수집
 * @returns - 레이캐스트 객체
 */
function collectPickableObjects() {
    const hasInstanceMeshRefPoiList = Object.values(PoiData.PoiDataList).filter(poi => poi.PointMeshData.instanceMeshRef !== undefined);
    const hasAnimMeshRefPoiList = Object.values(PoiData.PoiDataList).filter(poi => poi.PointMeshData.animMeshRef !== undefined);

    let resultInstanceMeshList = hasInstanceMeshRefPoiList.map(poi => poi.PointMeshData.instanceMeshRef);
    let resultAnimMeshList = hasAnimMeshRefPoiList.map(poi => poi.PointMeshData.animMeshRef);

    resultInstanceMeshList = [...new Set(resultInstanceMeshList)];
    resultAnimMeshList = [...new Set(resultAnimMeshList)];

    return {
        instanceMeshArray: resultInstanceMeshList,
        animMeshArray: resultAnimMeshList,
    }
}

/**
 * 포인터 다운 이벤트 처리
 * @param evt - 이벤트 정보
 */
function onPointerDown(evt: PointerEvent) {

    if (Placer.Enabled)
        return;

    if (evt.button === 0) {
        mouseDownPos.x = evt.offsetX;
        mouseDownPos.y = evt.offsetY;
    }
}

/**
 * 포인터 업 이벤트 처리
 * @param evt - 이벤트 정보
 */
function onPointerUp(evt: PointerEvent) {

    if (Placer.Enabled)
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

            const pickObjects = collectPickableObjects();

            // 인스턴스 메시와 레이캐스트 수행
            const instanceIntersects = rayCast.intersectObjects(pickObjects.instanceMeshArray as THREE.Object3D[], false);
            const animIntersects = rayCast.intersectObjects(pickObjects.animMeshArray as THREE.Object3D[], true);
            const combinedIntersects = instanceIntersects.concat(animIntersects);
            if (combinedIntersects.length > 0) {
                // 거리순 정렬
                combinedIntersects.sort((a, b) => { if (a.distance < b.distance) { return -1; } else if (a.distance > b.distance) { return 1; } else { return 0; } });

                // 인스턴스 메시일경우
                if (combinedIntersects[0].object instanceof THREE.InstancedMesh) {

                    // 인스턴스 메시의 uuid와 instanceId가 일치하는 poi를 찾음
                    const uuid = combinedIntersects[0].object.uuid;
                    const instanceId = combinedIntersects[0].instanceId;
                    const matchTarget = Object.values(PoiData.PoiDataList).filter(poi => {
                        if (poi.PointMeshData.instanceMeshRef) {
                            const bUUIDMatch = poi.PointMeshData.instanceMeshRef.uuid === uuid;
                            const bInstanceIdMatch = poi.PointMeshData.instanceIndex === instanceId;
                            return bUUIDMatch && bInstanceIdMatch;
                        }
                        return false;
                    });

                    // 이벤트 통지
                    Event.ExternalHandler.dispatchEvent({
                        type: 'onPoiPointerUp',
                        target: matchTarget[0].ExportData
                    });

                } else {
                    // 애니메이션 메시일 경우 메시의 자식 객체가 픽킹 되는 경우가 있으므로
                    // 픽킹된 객체로부터 계층구조 트리상 부모객체들의 uuid를 수집
                    const ancestorsUUIDs: string[] = [];
                    combinedIntersects[0].object.traverseAncestors(parent => ancestorsUUIDs.push(parent.uuid));

                    // poi의 애니메이션 메시 레퍼런스중 uuid가 매치되는것이 있는지 확인
                    const matchTarget = Object.values(PoiData.PoiDataList).filter(poi => {
                        if (poi.PointMeshData.animMeshRef) {
                            return ancestorsUUIDs.indexOf(poi.PointMeshData.animMeshRef.uuid) >= 0;
                        }
                        return false;
                    });

                    // 이벤트 통지
                    Event.ExternalHandler.dispatchEvent({
                        type: 'onPoiPointerUp',
                        target: matchTarget[0].ExportData
                    });
                }
            }

        }
    }
}