import * as THREE from 'three';
import * as Interfaces from '../interfaces';
import * as Event from '../eventDispatcher';
import * as Camera from '../camera';
import { PathSegment3D } from './pathsegment';
import { Path3D } from './path3d';
import { Engine3D } from '../engine';

let engine: Engine3D;
let pathGroup: THREE.Group;
let currentPath: Path3D;
let workingSegment: PathSegment3D;
let mouseState: Interfaces.PathCreatorMouseState = Interfaces.PathCreatorMouseState.Default;
let bLeftBtnDown: boolean = false; // 마우스 왼쪽 버튼이 눌렸는지 여부
const curveControlPoint: THREE.Vector3 = new THREE.Vector3();
const mouseDownPos: THREE.Vector2 = new THREE.Vector2();
const rayCast: THREE.Raycaster = new THREE.Raycaster();
enum MouseState { None = 0, SetStartPoint, SetEndPoint };

/**
 * Engine3D 초기화 이벤트 콜백
 */
Event.InternalHandler.addEventListener('onEngineInitialized' as never, (evt: any) => {
    engine = evt.engine as Engine3D;

    pathGroup = new THREE.Group();
    pathGroup.name = '#PathGroup';
    engine.RootScene.add(pathGroup);

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
        bLeftBtnDown = true;

        switch (mouseState) {
            case Interfaces.PathCreatorMouseState.SetEndPoint: {
                workingSegment.EndPoint = getPickPoint(mouseDownPos) as THREE.Vector3;
            } break;
        }
    }
}

/**
 * 포인터 이동 이벤트 처리
 * @param event - 포인터 이동 이벤트 정보
 */
function onPointerMove(event: MouseEvent) {

    if (mouseState === Interfaces.PathCreatorMouseState.SetEndPoint) {
        const mouseUpPos = new THREE.Vector2(event.offsetX, event.offsetY);
        let pickPoint = getPickPoint(mouseUpPos) as THREE.Vector3;
        
        if (bLeftBtnDown) {
            // 곡선
            const distance = workingSegment.EndPoint.distanceTo(pickPoint);
            const direction = new THREE.Vector3().subVectors(workingSegment.EndPoint, pickPoint).normalize();
            const controlPoint = workingSegment.EndPoint.clone().addScaledVector(direction, distance);
            workingSegment.ControlPoint = controlPoint;
            workingSegment.updateGeometry(currentPath.ExtrudeShape);
        } else {
            // 직선
            const controlPoint = new THREE.Vector3().lerpVectors(workingSegment.StartPoint, pickPoint, 0.5);
            workingSegment.ControlPoint = controlPoint;
            workingSegment.EndPoint = pickPoint;
            workingSegment.updateGeometry(currentPath.ExtrudeShape);
        }
    }

}

/**
 * 포인터 업 이벤트 처리
 * @param event - 포인터 업 이벤트 정보
 */
function onPointerUp(event: MouseEvent) {
    if (event.button === 0) {
        const mouseUpPos = new THREE.Vector2(event.offsetX, event.offsetY);
        const mouseDistance = mouseUpPos.clone().sub(mouseDownPos);
        const pickPoint = getPickPoint(mouseUpPos) as THREE.Vector3;

        switch (mouseState) {
            case Interfaces.PathCreatorMouseState.SetStartPoint: {
                workingSegment.StartPoint = pickPoint;
                mouseState = Interfaces.PathCreatorMouseState.SetEndPoint;
            } break;
            case Interfaces.PathCreatorMouseState.SetEndPoint: {
                // 현재 경로 객체에 구간 추가
                currentPath.addSegment(workingSegment);
                const lastPoint = workingSegment.EndPoint.clone();

                // 새 구간 생성후 시작점 설정
                workingSegment = new PathSegment3D();
                pathGroup.add(workingSegment);
                workingSegment.StartPoint = lastPoint;
            } break;
        }

        bLeftBtnDown = false;
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

    // 새 경로 객체 생성후
    currentPath = new Path3D();
    currentPath.name = id;
    pathGroup.add(currentPath);

    // 현재 작업중인 경로 구간 생성
    workingSegment = new PathSegment3D();
    pathGroup.add(workingSegment); // 그리는 도중에는 전체 path그룹에 넣어놓고 나중에 path3d 자식객체로 부착 처리

    registerEventListeners();

    // 마우스 상태
    mouseState = Interfaces.PathCreatorMouseState.SetStartPoint;
}

/**
 * 경로 생성 작업 중지
 */
function Cancel() {

    // 카메라 회전 버튼값 복구
    Camera.SetRotateButton(Interfaces.MouseButton.Left);

    // 메모리 해제 및 이벤트 리스너 등록 해제
    // 경로
    pathGroup.remove(currentPath as THREE.Object3D);
    currentPath.dispose();

    // 작업중 구간
    workingSegment.dispose();
    pathGroup.remove(workingSegment as THREE.Object3D);

    unregisterEventListeners();
}

/**
 * 경로 생성 작업 완료
 */
function Finish(): Object {

    // 카메라 회전 버튼값 복구
    Camera.SetRotateButton(Interfaces.MouseButton.Left);

    // // 반환값
    // const pathData = currentPath?.ExportData;

    // // 메모리 해제 및 이벤트 리스너 등록 해제
    // currentPath.dispose();
    unregisterEventListeners();

    return {};
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