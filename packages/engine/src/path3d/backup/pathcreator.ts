import * as THREE from 'three';
import * as Interfaces from '../../interfaces';
import * as Event from '../../eventDispatcher';
import * as Camera from '../../camera';
import * as PathData from './data';
import * as Util from '../../util';
import { PathSegment3D } from './pathsegment';
import { Path3D } from './path3d';
import { Engine3D } from '../../engine';

let engine: Engine3D;
let cursor: THREE.Mesh;
let pathGroup: THREE.Group;
let currentPath: Path3D;
let workingSegment: PathSegment3D;
let mouseState: Interfaces.PathCreatorMouseState = Interfaces.PathCreatorMouseState.Default;
let bLeftBtnDown: boolean = false; // 마우스 왼쪽 버튼이 눌렸는지 여부
// const curveControlPoint: THREE.Vector3 = new THREE.Vector3();
const mouseDownPos: THREE.Vector2 = new THREE.Vector2();
const rayCast: THREE.Raycaster = new THREE.Raycaster();
// enum MouseState { None = 0, SetStartPoint, SetEndPoint };

/**
 * Engine3D 초기화 이벤트 콜백
 */
Event.InternalHandler.addEventListener('onEngineInitialized' as never, (evt: any) => {
    engine = evt.engine as Engine3D;

    // 경로 객체 그룹
    pathGroup = new THREE.Group();
    pathGroup.name = '#PathGroup';
    engine.RootScene.add(pathGroup);

    // 커서
    cursor = new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 32, 32),
        new THREE.MeshBasicMaterial({ color: 'red' })
    );
    cursor.name = '#Cursor';
    cursor.layers.set(Interfaces.CustomLayer.Invisible);
    pathGroup.add(cursor);

    rayCast.layers.set(Interfaces.CustomLayer.Pickable);
});

/**
 * 마우스 좌표에 대해 공간상의 픽킹 좌표 계산
 * @param mousePos - 마우스 좌표
 * @returns - 공간상의 픽킹 위치
 */
function getPickPoint(mousePos: THREE.Vector2) {

    // 마우스 좌표를 뷰포트 공간으로
    mousePos.x = (mousePos.x / engine.Dom.clientWidth) * 2 - 1;
    mousePos.y = -(mousePos.y / engine.Dom.clientHeight) * 2 + 1;

    // 마우스 위치를 기준으로 레이캐스트 생성
    rayCast.setFromCamera(mousePos, engine.Camera);

    // 씬에서 충돌하는 객체 찾기
    const intersects = rayCast.intersectObjects(engine.RootScene.children, true);

    // 충돌한 객체가 있으면 첫번째 객체의 위치 반환
    if (intersects.length > 0) {

        // 픽킹좌표를 층기준 로컬 좌표로 전환
        const floorObject = Util.getFloorObject(intersects[0].object);
        const pickedPointLocal = floorObject.worldToLocal(intersects[0].point.clone());

        return {
            worldPoint: intersects[0].point,
            localPoint: pickedPointLocal,
            pickedFloor: floorObject,
        };
    } else {
        // 배경 모델과 충돌하지 않는 경우 평면과 교차 테스트
        const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
        const point = new THREE.Vector3();
        if (rayCast.ray.intersectPlane(plane, point)) {
            const floorObject = Util.getFloorObject();
            const pickedPointLocal = floorObject.worldToLocal(point.clone());

            return {
                worldPoint: point,
                localPoint: pickedPointLocal,
                pickedFloor: floorObject,
            };
        }
    }

    return undefined;
}

/**
 * 마우스 좌표에 대해 공간상의 평면 픽킹 좌표 계산
 * @param mousePos - 마우스 좌표
 * @param planeBasePoint - 평면의 기준점 (기본값: 원점)
 * @returns - 평면과 교차하는 픽킹 위치
 */
function getPickPointFromPlane(mousePos: THREE.Vector2, planeBasePoint: THREE.Vector3) {
    // 마우스 좌표를 뷰포트 공간으로
    mousePos.x = (mousePos.x / engine.Dom.clientWidth) * 2 - 1;
    mousePos.y = -(mousePos.y / engine.Dom.clientHeight) * 2 + 1;

    // 마우스 위치를 기준으로 레이캐스트 생성
    rayCast.setFromCamera(mousePos, engine.Camera);

    // 평면과 교차 테스트
    const plane = new THREE.Plane().setFromNormalAndCoplanarPoint(new THREE.Vector3(0, 1, 0), planeBasePoint);
    const point = new THREE.Vector3();
    if (rayCast.ray.intersectPlane(plane, point)) {
        const floorObject = Util.getFloorObject();
        const pickedPointLocal = floorObject.worldToLocal(point.clone());

        return {
            worldPoint: point,
            localPoint: pickedPointLocal,
            pickedFloor: floorObject,
        };
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
                let pickData = getPickPoint(mouseDownPos);

                if (!pickData) {
                    console.warn('경로 생성 실패: 픽킹 좌표를 찾을 수 없습니다.');
                    return;
                }

                const endPointDummy = new THREE.Object3D();
                endPointDummy.position.copy(pickData.worldPoint);
                pickData.pickedFloor.attach(endPointDummy);

                workingSegment.EndPointDummy = endPointDummy;
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
        const currMousePos = new THREE.Vector2(event.offsetX, event.offsetY);
        let pickData = getPickPoint(currMousePos);

        if (!pickData) {
            console.warn('경로 생성 실패: 픽킹 좌표를 찾을 수 없습니다.');
            return;
        }

        cursor.position.copy(pickData.worldPoint);

        if (bLeftBtnDown) {
            // 곡선
            // 곡선의 경우 픽킹점을 평면에 대해 처리한다.
            pickData = getPickPointFromPlane(new THREE.Vector2(event.offsetX, event.offsetY), workingSegment.EndPointWorldPosition.clone());
            const distance = workingSegment.EndPointWorldPosition.distanceTo(pickData?.worldPoint as THREE.Vector3);
            const direction = new THREE.Vector3().subVectors(workingSegment.EndPointWorldPosition, pickData?.worldPoint as THREE.Vector3).normalize();
            const controlPoint = workingSegment.EndPointWorldPosition.clone().addScaledVector(direction, distance);

            // 더미 객체 생성
            debugger; // 마우스 이동시마다 더미 생성됨 수정요망
            const controlPointDummy = new THREE.Object3D();
            controlPointDummy.position.copy(controlPoint);
            workingSegment.EndPointDummy.parent?.add(controlPointDummy); // EndPointDummy가 있는 층객체에 더미 객체를 부착

            workingSegment.ControlPointDummy = controlPointDummy;

            workingSegment.updateGeometry(currentPath.ExtrudeShape);
            cursor.position.copy(pickData?.worldPoint as THREE.Vector3);
        } else {
            // 직선
            const controlPoint = new THREE.Vector3().lerpVectors(workingSegment.StartPointWorldPosition, pickData.worldPoint, 0.5);

            // 더미 객체 생성
            const endPointDummy = new THREE.Object3D();
            endPointDummy.position.copy(pickData.worldPoint);
            pickData.pickedFloor.attach(endPointDummy);

            const controlPointDummy = new THREE.Object3D();
            controlPointDummy.position.copy(controlPoint);
            pickData.pickedFloor.attach(controlPointDummy);

            workingSegment.ControlPointDummy = controlPointDummy;
            workingSegment.EndPointDummy = endPointDummy;

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
        const pickData = getPickPoint(mouseUpPos);

        if (!pickData) {
            console.warn('경로 생성 실패: 픽킹 좌표를 찾을 수 없습니다.');
            return;
        }

        switch (mouseState) {
            case Interfaces.PathCreatorMouseState.SetStartPoint: {

                // 픽킹 지점에 더미 객체를 생성하여 층객체로 부착시킨다.
                const dummy = new THREE.Object3D();
                dummy.position.copy(pickData.worldPoint);
                pickData.pickedFloor.attach(dummy);

                workingSegment.StartPointDummy = dummy;

                mouseState = Interfaces.PathCreatorMouseState.SetEndPoint;
            } break;
            case Interfaces.PathCreatorMouseState.SetEndPoint: {
                // 현재 경로 객체에 구간 추가
                currentPath.addSegment(workingSegment);
                const lastWorldPoint = workingSegment.EndPointWorldPosition.clone();

                // 새 구간 생성후 시작점 설정
                workingSegment = new PathSegment3D(currentPath.PathWidth, currentPath.PathColor);
                pathGroup.add(workingSegment);

                // 새 구간의 시작점의 더미
                const dummy = new THREE.Object3D();
                dummy.position.copy(lastWorldPoint);
                pickData.pickedFloor.attach(dummy);

                workingSegment.StartPointDummy = dummy;
            } break;
        }

        bLeftBtnDown = false;
    }
}

/**
 * 키다운 이벤트 처리
 * @param event - 키다운 이벤트 정보
 */
function onKeyDown() {
}

/**
 * 키업 이벤트 처리
 * @param event - 키업 이벤트 정보
 */
function onKeyUp() {
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
function CreatePath(id: string, color: THREE.ColorRepresentation = 'red') {

    // 카메라 회전을 휠버튼으로 설정
    Camera.SetRotateButton(Interfaces.MouseButton.Middle);

    // 새 경로 객체 생성후
    currentPath = new Path3D(color);
    currentPath.name = id;
    pathGroup.add(currentPath);

    // 현재 작업중인 경로 구간 생성
    workingSegment = new PathSegment3D(currentPath.PathWidth, currentPath.PathColor);
    pathGroup.add(workingSegment); // 그리는 도중에는 전체 path그룹에 넣어놓고 나중에 path3d 자식객체로 부착 처리

    registerEventListeners();

    // 마우스 상태
    mouseState = Interfaces.PathCreatorMouseState.SetStartPoint;
    // 커서 가시화 상태
    cursor.layers.set(Interfaces.CustomLayer.Default);
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
    pathGroup.remove(workingSegment as THREE.Object3D);
    workingSegment.dispose();

    unregisterEventListeners();

    // 커서 가시화 상태
    cursor.layers.set(Interfaces.CustomLayer.Invisible);
}

/**
 * 경로 생성 작업 완료
 */
function Finish() {

    // 카메라 회전 버튼값 복구
    Camera.SetRotateButton(Interfaces.MouseButton.Left);

    // 작업중 구간 메모리 해제
    pathGroup.remove(workingSegment as THREE.Object3D);
    workingSegment.dispose();

    // 생성 객체 추가
    PathData.addPathObject(currentPath);

    // 이벤트 등록 해제
    unregisterEventListeners();
    // 커서 가시화 상태
    cursor.layers.set(Interfaces.CustomLayer.Invisible);

    return currentPath.ExportData;
}

export {
    CreatePath,
    Cancel,
    Finish,
}