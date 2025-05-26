import * as THREE from 'three';
import * as Interfaces from '../interfaces';
import * as Event from '../eventDispatcher';
import * as Camera from '../camera';
import { Path3D } from './path3d';
import { Engine3D } from '../engine';

let engine: Engine3D;
let currentPath: Path3D | undefined;
const curveControlPoint: THREE.Vector3 = new THREE.Vector3();
const mouseDownPos: THREE.Vector2 = new THREE.Vector2();
const rayCast: THREE.Raycaster = new THREE.Raycaster();

/**
 * Engine3D 초기화 이벤트 콜백
 */
Event.InternalHandler.addEventListener('onEngineInitialized' as never, (evt: any) => {
    engine = evt.engine as Engine3D;

    rayCast.layers.set(Interfaces.CustomLayer.Pickable);
});

/**
 * 마우스 좌표에 대해 공간상의 픽킹 좌표 계산
 * @param mousePos - 마우스 좌표
 * @returns - 공간상의 픽킹 위치
 */
function getPickPoint(mousePos: THREE.Vector2): THREE.Vector3 | undefined {

    // 마우스 좌표를 뷰포트 공간으로
    mousePos.x = (mousePos.x / engine.Dom.clientWidth) * 2 - 1;
    mousePos.y = -(mousePos.y / engine.Dom.clientHeight) * 2 + 1;

    // 마우스 위치를 기준으로 레이캐스트 생성
    rayCast.setFromCamera(mousePos, engine.Camera);
    
    // 씬에서 충돌하는 객체 찾기
    const intersects = rayCast.intersectObjects(engine.RootScene.children, true);
    
    // 충돌한 객체가 있으면 첫번째 객체의 위치 반환
    if (intersects.length > 0) {
        return intersects[0].point;
    } else {
        // 배경 모델과 충돌하지 않는 경우 평면과 교차 테스트
        const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
        const point = new THREE.Vector3();
        if (rayCast.ray.intersectPlane(plane, point)) {
            return point;
        }
    }
    
    return undefined;
}

/**
 * 포인터 다운 이벤트 처리
 * @param event - 포인터 다운 이벤트 정보
 */
function onPointerDown(event: MouseEvent) {
    if (event.button === 0) {
        mouseDownPos.x = event.offsetX;
        mouseDownPos.y = event.offsetY;
    }
}

/**
 * 포인터 이동 이벤트 처리
 * @param event - 포인터 이동 이벤트 정보
 */
function onPointerMove(event: MouseEvent) {
}

/**
 * 포인터 업 이벤트 처리
 * @param event - 포인터 업 이벤트 정보
 */
function onPointerUp(event: MouseEvent) {
    if (event.button === 0) {
        const mouseUpPos = new THREE.Vector2(event.offsetX, event.offsetY);
        const delta = mouseUpPos.clone().sub(mouseDownPos);
        const pickPoint = getPickPoint(mouseUpPos);

        // 마우스 버튼업 위치가 눌린 위치와 5픽셀 미만이면 직선으로 처리
        if (delta.length() < 5) {
            // 점추가
            currentPath?.addStraightPoint(pickPoint as THREE.Vector3);
        } else {
            // 5픽셀 이상인경우 곡선으로 처리
            currentPath?.addCurvedPoint(pickPoint as THREE.Vector3, curveControlPoint);
        }
    }
}

/**
 * 키다운 이벤트 처리
 * @param event - 키다운 이벤트 정보
 */
function onKeyDown(event: KeyboardEvent) {
}

/**
 * 키업 이벤트 처리
 * @param event - 키업 이벤트 정보
 */
function onKeyUp(event: KeyboardEvent) {
}

/**
 * 포인터, 키보드 이벤트 등록
 */
function registerEventListeners() {
    engine.Dom.addEventListener('pointerdown', onPointerDown);
    engine.Dom.addEventListener('pointermove', onPointerMove);
    engine.Dom.addEventListener('pointerup', onPointerUp);
    engine.Dom.addEventListener('keydown', onKeyDown);
    engine.Dom.addEventListener('keyup', onKeyUp);
}

/**
 * 포인터, 키보드 이벤트 등록 해제
 */
function unregisterEventListeners() {
    engine.Dom.removeEventListener('pointerdown', onPointerDown);
    engine.Dom.removeEventListener('pointermove', onPointerMove);
    engine.Dom.removeEventListener('pointerup', onPointerUp);
    engine.Dom.removeEventListener('keydown', onKeyDown);
    engine.Dom.removeEventListener('keyup', onKeyUp);
}

/**
 * 경로 생성 작업 시작
 * @param id - 경로 ID
 */
function CreatePath(id: string) {

    // 카메라 회전을 휠버튼으로 설정
    Camera.SetRotateButton(Interfaces.MouseButton.Middle);

    // 새 경로 객체 생성후 이벤트 처리기 등록
    currentPath = new Path3D();
    currentPath.name = id;

    registerEventListeners();
}

/**
 * 경로 생성 작업 중지
 */
function Cancel() {

    // 카메라 회전 버튼값 복구
    Camera.SetRotateButton(Interfaces.MouseButton.Left);

    // 메모리 해제 및 이벤트 리스너 등록 해제
    currentPath?.dispose();
    currentPath = undefined;
    unregisterEventListeners();
}

/**
 * 경로 생성 작업 완료
 */
function Finish(): Interfaces.Path3DData | undefined {

    // 카메라 회전 버튼값 복구
    Camera.SetRotateButton(Interfaces.MouseButton.Left);

    // 반환값
    const pathData = currentPath?.ExportData;
    
    // 메모리 해제 및 이벤트 리스너 등록 해제
    currentPath?.dispose();
    unregisterEventListeners();

    return pathData;
}

/**
 * 경로 생성 작업 되돌리기
 */
function Undo() {

}

/**
 * 경로 생성 작업 다시실행
 */
function Redo() {

}

export {
    CreatePath,
    Cancel,
    Finish,
    Undo,
    Redo,
}