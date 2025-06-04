import * as THREE from 'three';
import * as Event from '../eventDispatcher';
import * as Interfaces from '../interfaces';
import * as Effect from '../effect';
import * as PathData from '../path3d/data';
import * as Util from '../util';
import { Engine3D } from '../engine';
import { Path3DObject } from '../path3d/path3dobject';

let engine: Engine3D;
let createOption: Interfaces.SubwayCreateOption;
let mouseState: Interfaces.SubwayCreateMouseState = Interfaces.SubwayCreateMouseState.Default;
let headModelSrc: THREE.Group;
let bodyModelSrc: THREE.Group;
const mouseDownPos: THREE.Vector2 = new THREE.Vector2();

/**
 * Engine3D 초기화 이벤트 콜백
 * 
 */
Event.InternalHandler.addEventListener('onEngineInitialized' as never, (evt: any) => {
    engine = evt.engine as Engine3D;
});

/**
 * 머리 모델 로드 완료 이벤트 처리
 */
Event.InternalHandler.addEventListener('onSubwayModelLoader_HeadModelLoaded' as never, (evt: any) => {
    headModelSrc = evt.target;
});

/**
 * 몸체 모델 로드 완료 이벤트 처리
 */
Event.InternalHandler.addEventListener('onSubwayModelLoader_BodyModelLoaded' as never, (evt: any) => {
    bodyModelSrc = evt.target;
});

/**
 * 대상 객체의 부모 객체를 탐색하여 경로 객체를 찾아 반환
 * @param target - 대상 객체
 * @returns - 찾은 경로 객체
 */
function findPath3DObject(target: THREE.Object3D): Path3DObject | undefined {
    let result;

    target.traverseAncestors(parent => {
        if (parent instanceof Path3DObject) {
            result = parent;
        }
    });

    return result;
}

function registerPointerEvents() {
    engine.Dom.addEventListener('pointerdown', onPointerDown);
    engine.Dom.addEventListener('pointermove', onPointerMove);
    engine.Dom.addEventListener('pointerup', onPointerUp);
}

function unregisterPointerEvents() {
    engine.Dom.removeEventListener('pointerdown', onPointerDown);
    engine.Dom.removeEventListener('pointermove', onPointerMove);
    engine.Dom.removeEventListener('pointerup', onPointerUp);
}

function onPointerDown(evt: PointerEvent) {

    if (evt.button === 0) {
        mouseDownPos.x = evt.offsetX;
        mouseDownPos.y = evt.offsetY;
    }
}

function onPointerMove(evt: PointerEvent) {

    const mousePos = new THREE.Vector2(
        (evt.offsetX / engine.Dom.clientWidth) * 2 - 1,
        -(evt.offsetY / engine.Dom.clientHeight) * 2 + 1
    );

    const rayCast = new THREE.Raycaster();
    rayCast.layers.set(Interfaces.CustomLayer.Pickable);
    rayCast.setFromCamera(mousePos, engine.Camera);

    switch (mouseState) {
        case Interfaces.SubwayCreateMouseState.SelectPath: {
            Effect.Outline.clearOutlineObjects();
            const intersects = rayCast.intersectObjects(PathData.getPathObjects(), true);
            if (intersects.length > 0) {
                const path3dTarget = findPath3DObject(intersects[0].object);
                if (path3dTarget) {
                    Effect.Outline.setOutlineObjects(path3dTarget);
                }
            }
        } break;
    }
}

function onPointerUp(evt: PointerEvent) {

    if (evt.button === 0) {
        const currMousePos: THREE.Vector2 = new THREE.Vector2(evt.offsetX, evt.offsetY);
        if (currMousePos.distanceTo(mouseDownPos) < 5.0) {
            switch (mouseState) {
                case Interfaces.SubwayCreateMouseState.SelectPath: {
                    // 외각선 대상이 되는 경로 객체만 가시화 처리
                    const outlineObjects = Effect.Outline.getOutlineTargets();
                    if (outlineObjects.length > 0) {
                        const targetPath = outlineObjects[0] as Path3DObject;
                        Effect.Outline.clearOutlineObjects();
                        PathData.HideAll();
                        PathData.Show(targetPath.name);

                        // 기차 생성
                        console.error('기차 생성');

                        // 마우스 상태 변경
                        mouseState = Interfaces.SubwayCreateMouseState.SetEntranceLocation;
                    }
                } break;
            }
        }
    }
}

/**
 * 지하철 생성
 * @param option - 생성 옵션
 * @param onCreate - 생성 완료 후 호출 콜백
 */
function Create(option: Interfaces.SubwayCreateOption, onCreate?: Function) {

    if( PathData.getPathObjects().length === 0 ) {
        console.error('경로가 생성되어 있지 않음');
        return;
    }

    if( !headModelSrc || !bodyModelSrc ) {
        console.error('지하철 모델이 로드되지 않음');
        return;
    }

    Effect.Outline.clearOutlineObjects();

    // 경로 객체들을 레이캐스트 가능한 객체로 변경
    PathData.getPathObjects().forEach(path => Util.setObjectLayer(path, Interfaces.CustomLayer.Default | Interfaces.CustomLayer.Pickable));

    // 옵션 체크
    option.bodyCount = THREE.MathUtils.clamp(option.bodyCount, 4, option.bodyCount); // 최소 4량이상으로 처리

    createOption = option;
    mouseState = Interfaces.SubwayCreateMouseState.SelectPath;

    registerPointerEvents();
}

/**
enum SubwayCreateMouseState {
    Default = 0,
    SelectPath,
    SetEntranceLocation,
    SetStopLocation,
    SetEndLocation,
}
*/

export {
    Create,
}