import * as THREE from 'three';
import * as Event from './eventDispatcher';
import * as Interfaces from './interfaces';
import { Engine3D } from './engine';
import * as TWEEN from '@tweenjs/tween.js';

let engine: Engine3D;
let cursor: THREE.Object3D;
let rayCast: THREE.Raycaster;
let enabled: boolean = false;
let pickPoint: THREE.Vector3 | undefined = new THREE.Vector3();
let rotateSmoothingFactor: number = 0.6;
let panSmoothingFactor: number = 0.7;
let zoomIntervalFactor: number = 1.0;
let posTween: TWEEN.Tween | undefined = undefined;
let rotTween: TWEEN.Tween | undefined = undefined;
const rotateDelta: THREE.Vector2 = new THREE.Vector2();
const panDelta: THREE.Vector3 = new THREE.Vector3();
const groundPlane: THREE.Plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
const screenPlane: THREE.Plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
const rotateBtnId: number = Interfaces.MouseButton.Left;
const panBtnId: number = Interfaces.MouseButton.Right;
const dragZoomBtnId: number = Interfaces.MouseButton.Middle;
const screenPanKey: string = Interfaces.ModifyKey.Shift;
const mouseDownPos: Record<string, THREE.Vector2> = {
    'rotate': new THREE.Vector2(),
    'pan': new THREE.Vector2(),
    'dragZoom': new THREE.Vector2(),
};
const mouseBtnState: Record<string, boolean> = { 'rotate': false, 'pan': false, 'dragZoom': false };

/**
 * Engine3D 초기화 이벤트 콜백
 * 
 */
Event.InternalHandler.addEventListener('onEngineInitialized' as never, (evt: any) => {
    engine = evt.engine as Engine3D;

    // 포인터 클릭시 표시할 커서 객체
    const geometry = new THREE.SphereGeometry(0.1, 32, 23);
    const material = new THREE.MeshStandardMaterial({ color: 'red' });
    cursor = new THREE.Mesh(geometry, material);
    cursor.name = '#CameraPivot';
    cursor.visible = false;
    cursor.layers.set(Interfaces.CustomLayer.Invisible);
    engine.RootScene.add(cursor);

    // 레이캐스터 초기화
    rayCast = new THREE.Raycaster();
    rayCast.layers.set(Interfaces.CustomLayer.Pickable);

    // 이벤트 등록
    SetEnabled(true);
});

/**
 * 렌더링 전 이벤트 콜백
 */
Event.InternalHandler.addEventListener('onBeforeRender' as never, (evt: any) => {
    const deltaTime = evt.deltaTime;

    // 현재 카메라 방향 얻기
    const dirCamLook = new THREE.Vector3(0, 0, -1);
    dirCamLook.applyQuaternion(engine.Camera.quaternion);

    // 카메라가 바라보는 방향에 대해 회전각에 제한을 설정
    const angleUp = dirCamLook.angleTo(new THREE.Vector3(0, 1, 0));
    if (angleUp - rotateDelta.y < Math.PI * 0.01 || Math.PI < angleUp - rotateDelta.y)
        rotateDelta.y = 0.0;

    // 픽킹지점에서 카메라위치까지의 방향(크기포함)
    const dirToCamWithForce = engine.Camera.position.clone();
    if (pickPoint)
        dirToCamWithForce.sub(pickPoint);

    // 가로 회전
    const matRotHorizontal = new THREE.Matrix4();
    matRotHorizontal.makeRotationAxis(new THREE.Vector3(0, 1, 0), rotateDelta.x);

    // 세로 회전
    const camRight = new THREE.Vector3(1, 0, 0);
    camRight.applyQuaternion(engine.Camera.quaternion);

    const matRotVertical = new THREE.Matrix4();
    matRotVertical.makeRotationAxis(camRight, rotateDelta.y);

    // 회전 적용
    const matCombine = new THREE.Matrix4().multiplyMatrices(matRotHorizontal, matRotVertical);
    dirToCamWithForce.applyMatrix4(matCombine);

    if (pickPoint)
        engine.Camera.position.copy(pickPoint).add(dirToCamWithForce);

    // 카메라 시선 처리
    dirCamLook.applyMatrix4(matCombine);
    dirCamLook.add(engine.Camera.position);
    engine.Camera.lookAt(dirCamLook);

    rotateDelta.x *= rotateSmoothingFactor;
    rotateDelta.y *= rotateSmoothingFactor;

    // 패닝
    const mat_translate = new THREE.Matrix4().makeTranslation(panDelta.x, panDelta.y, panDelta.z);
    engine.Camera.position.applyMatrix4(mat_translate);
    panDelta.multiplyScalar(panSmoothingFactor);
});

/**
 * 카메라 컨트롤러 활성화 상태 지정
 * @param isEnabled - 활성화 상태
 */
function SetEnabled(isEnabled: boolean) {
    enabled = isEnabled;

    if (enabled) {
        engine.Dom.addEventListener('pointerdown', onPointerDown);
        engine.Dom.addEventListener('pointermove', onPointerMove);
        engine.Dom.addEventListener('pointerup', onPointerUp);

        engine.Dom.addEventListener('wheel', onMouseWheel);

        engine.Dom.addEventListener('contextmenu', onContextMenu);
    } else {
        engine.Dom.removeEventListener('pointerdown', onPointerDown);
        engine.Dom.removeEventListener('pointermove', onPointerMove);
        engine.Dom.removeEventListener('pointerup', onPointerUp);

        engine.Dom.removeEventListener('wheel', onMouseWheel);

        engine.Dom.removeEventListener('contextmenu', onContextMenu);
    }
}

/**
 * 공간상에 마우스 픽킹 수행
 * @param screenMousePos - 스크린상의 마우스 좌표
 * @param plane - 픽킹 대상 평면
 * @returns - 픽킹된 좌표
 */
function getPickPoint(screenMousePos: THREE.Vector2, plane?: THREE.Plane): THREE.Vector3 | undefined {

    // 광선
    const mousePos = new THREE.Vector2(
        (screenMousePos.x / engine.Dom.clientWidth) * 2 - 1,
        -(screenMousePos.y / engine.Dom.clientHeight) * 2 + 1
    );
    rayCast.setFromCamera(mousePos, engine.Camera);
    rayCast.params.Line.threshold = 0.01;

    // 전달받은 평면이 유효한 객체일경우 평면과 레이캐스트 수행
    if (plane !== undefined && plane !== null) {
        const point = new THREE.Vector3();
        if (rayCast.ray.intersectPlane(plane, point))
            return point;
        else
            return undefined;
    }

    // 레이캐스트 수행
    let result;
    const intersects = rayCast.intersectObjects(engine.RootScene.children, true);
    if (intersects.length > 0) {
        result = intersects[0].point;
    } else {
        // 루트씬과의 레이캐스트가 실패하면 임의 평면과의 레이캐스트 수행
        const point = new THREE.Vector3();
        if (rayCast.ray.intersectPlane(groundPlane, point))
            result = point.clone();
    }

    return result;
}

/**
 * 포인터 다운 이벤트 처리
 * @param evt - 포인터 이벤트 정보
 */
function onPointerDown(evt: PointerEvent) {
    // 포인터 다운시 webgl dom객체에 포커스 처리
    engine.Dom.focus ? engine.Dom.focus() : window.focus();

    // 회전
    if (evt.button === rotateBtnId) {
        mouseDownPos['rotate'].x = evt.offsetX;
        mouseDownPos['rotate'].y = evt.offsetY;

        // 월드상 픽킹 지점 얻기
        const pickPos = getPickPoint(mouseDownPos['rotate']);
        if (pickPos !== undefined) {
            pickPoint = pickPos.clone();

            // 회전 중심점 설정 및 가시화
            cursor.position.copy(pickPoint);
            cursor.visible = true;
            cursor.layers.set(Interfaces.CustomLayer.Default);
        } else {
            // 픽킹 지점 얻기에 실패시 화면 전방 기준 50.0앞의 지점을 회전중심점으로 설정
            const direction = new THREE.Vector3();
            engine.Camera.getWorldDirection(direction);

            const targetPos = engine.Camera.position.clone().addScaledVector(direction, 50.0);
            pickPoint = targetPos.clone();

            // 회전 중심점 설정 및 가시화
            cursor.position.copy(pickPoint);
            cursor.visible = true;
            cursor.layers.set(Interfaces.CustomLayer.Default);
        }

        mouseBtnState['rotate'] = true;
    } else if (evt.button === panBtnId) {
        // 패닝
        mouseDownPos['pan'].x = evt.offsetX;
        mouseDownPos['pan'].y = evt.offsetY;

        // 스크린패닝 평면 설정을 위해 카메라방향의 반대 벡터를 얻어둠
        const cameraDirection = new THREE.Vector3();
        engine.Camera.getWorldDirection(cameraDirection);
        cameraDirection.negate();

        // 픽킹한 월드좌표의 높이를 평면의 높이로 설정
        const pickPos = getPickPoint(mouseDownPos['pan']);
        if (pickPos) {
            groundPlane.setFromNormalAndCoplanarPoint(new THREE.Vector3(0, 1, 0), pickPos);

            // 스크린패닝 평면 설정
            screenPlane.setFromNormalAndCoplanarPoint(cameraDirection, pickPos);

            // 회전 중심점 위치 설정 및 가시화
            cursor.position.copy(pickPos);
            cursor.visible = true;
            cursor.layers.set(Interfaces.CustomLayer.Default);
        } else {
            // 픽킹 지점 얻기에 실패하면 카메라 방향 기준 50.0앞의 지점을 회전중심점으로 선정하여 회전 처리
            const direction = new THREE.Vector3();
            engine.Camera.getWorldDirection(direction);

            const targetPos = engine.Camera.position.clone().addScaledVector(direction, 50.0);
            groundPlane.setFromNormalAndCoplanarPoint(new THREE.Vector3(0, 1, 0), targetPos);
            screenPlane.setFromNormalAndCoplanarPoint(cameraDirection, targetPos);

            // 회전 중심점 위치 설정 및 가시화
            cursor.position.copy(targetPos);
            cursor.visible = true;
            cursor.layers.set(Interfaces.CustomLayer.Default);
        }

        // 마우스 상태
        mouseBtnState['pan'] = true;
    } else if (evt.button === dragZoomBtnId) {
        const mousePos = new THREE.Vector2(evt.offsetX, evt.offsetY);
        pickPoint = getPickPoint(mousePos);
        if (pickPoint) {
            // 회전 중심점 위치 설정 및 가시화
            cursor.position.copy(pickPoint);
            cursor.visible = true;
            cursor.layers.set(Interfaces.CustomLayer.Default);
        }

        mouseDownPos['dragZoom'].copy(mousePos);
        mouseBtnState['dragZoom'] = true;
    }
}

/**
 * 포인터 다운 이벤트 처리
 * @param evt - 포인터 이벤트 정보(조합키 동작 처리를 위해 any 타입으로 사용)
 */
function onPointerMove(evt: any) {

    // 회전
    if (mouseBtnState['rotate']) {
        const prevPos = mouseDownPos['rotate'].clone();
        const currPos = new THREE.Vector2(evt.offsetX, evt.offsetY);
        const offset = new THREE.Vector2().subVectors(currPos, prevPos);
        const delta = new THREE.Vector2(
            -(2 * Math.PI * offset.x / engine.Dom.clientHeight),
            -(2 * Math.PI * offset.y / engine.Dom.clientHeight)
        );

        rotateDelta.x += delta.x * 0.5;
        rotateDelta.y += delta.y * 0.5;

        mouseDownPos['rotate'].copy(currPos);
    } else if (mouseBtnState['pan']) {
        // 패닝 동작 처리
        // 스크린패닝일 경우
        if (evt[screenPanKey]) {
            const prevScreenPanPos = getPickPoint(mouseDownPos['pan'], screenPlane);
            const currScreenPanPos = getPickPoint(new THREE.Vector2(evt.offsetX, evt.offsetY), screenPlane);
            if (prevScreenPanPos && currScreenPanPos) {
                const offset = new THREE.Vector3().subVectors(prevScreenPanPos, currScreenPanPos);
                panDelta.add(offset.clone());
            }
        } else {
            // 일반 패닝일 경우
            const prevPos = getPickPoint(mouseDownPos['pan'], groundPlane);
            const currPos = getPickPoint(new THREE.Vector2(evt.offsetX, evt.offsetY), groundPlane);
            if (prevPos && currPos) {
                const offset = new THREE.Vector3().subVectors(prevPos, currPos);
                panDelta.add(offset.clone());
            }
        }

        mouseDownPos['pan'].x = evt.offsetX;
        mouseDownPos['pan'].y = evt.offsetY;
    } else if (mouseBtnState['dragZoom']) {
        // 레이캐스트 지점을 향하는 방향, 거리 계산
        const dirToPick = cursor.position.clone().sub(engine.Camera.position).normalize();
        let distance = cursor.position.distanceTo(engine.Camera.position);
        if (distance <= 0.1)
            distance = 1.0;

        // 마우스 Y축이동을 기준으로 줌인/아웃 방향 결정
        const currPos = new THREE.Vector2(evt.offsetX, evt.offsetY);
        const zoomDirection = (currPos.y > mouseDownPos['dragZoom'].y) ? -1.0 : 1.0;

        // 카메라 위치 이동
        const camPos = engine.Camera.position.clone().addScaledVector(dirToPick, distance * (0.1 * zoomIntervalFactor * zoomDirection));
        engine.Camera.position.copy(camPos);

        if (engine.Camera instanceof THREE.OrthographicCamera) {
            engine.Camera.zoom += (engine.Camera.zoom * (0.1 * zoomIntervalFactor * zoomDirection));
            engine.Camera.updateProjectionMatrix();
        }

        mouseDownPos['dragZoom'].copy(currPos);
    }
}

/**
 * 포인터 업 이벤트 처리
 * @param evt - 포인터 이벤트 정보
 */
function onPointerUp(evt: PointerEvent) {

    if (evt.button === rotateBtnId)
        mouseBtnState['rotate'] = false;
    else if (evt.button === panBtnId)
        mouseBtnState['pan'] = false;
    else if (evt.button === dragZoomBtnId)
        mouseBtnState['dragZoom'] = false;

    // 커서 숨김 처리
    cursor.visible = false;
    cursor.layers.set(Interfaces.CustomLayer.Invisible);
}

/**
 * - 마우스 휠 이벤트 처리
 * @param evt - 마우스 휠 이벤트 정보
 */
function onMouseWheel(evt: WheelEvent) {
    const zoomDirection = (evt.deltaY < 0) ? 1.0 : -1.0;

    // 마우스 픽킹 지점을 향해 전후진 처리
    const mousePos = new THREE.Vector2(evt.offsetX, evt.offsetY);
    pickPoint = getPickPoint(mousePos);
    if (pickPoint) {
        const dirToPick = pickPoint.clone().sub(engine.Camera.position).normalize();
        let distance = pickPoint.distanceTo(engine.Camera.position);
        if (distance <= 0.1)
            distance = 1.0;

        const camPos = engine.Camera.position.clone().addScaledVector(dirToPick, distance * (0.1 * zoomIntervalFactor) * zoomDirection);
        engine.Camera.position.copy(camPos);
    } else {
        const forward = new THREE.Vector3();
        engine.Camera.getWorldDirection(forward);

        const camPos = engine.Camera.position.clone().addScaledVector(forward, 1.0 * zoomDirection);
        engine.Camera.position.copy(camPos);
    }

    if (engine.Camera instanceof THREE.OrthographicCamera) {
        engine.Camera.zoom += (engine.Camera.zoom * (0.1 * zoomIntervalFactor)) * zoomDirection;
        engine.Camera.updateProjectionMatrix();
    }
}

/**
 * 컨텍스트 메뉴 이벤트 처리
 * @param evt - 컨텍스트 메뉴 이벤트 정보
 */
function onContextMenu(evt: MouseEvent) {
    evt.preventDefault();
    evt.stopPropagation();
}

/**
 * 전체보기
 * @param transitionTime - 이동시간
 */
function ExtendView(transitionTime?: number) {
    // 기본값 처리
    transitionTime = transitionTime || 1.0;

    // 배경모델 바운딩 계산
    const target = engine.RootScene.getObjectByName('#ModelGroup');
    const bounding = new THREE.Box3().setFromObject(target as THREE.Object3D);
    const sphere = new THREE.Sphere();
    bounding.getBoundingSphere(sphere);

    // 카메라 방향 얻기
    const direction = new THREE.Vector3();
    engine.Camera.getWorldDirection(direction);

    // 카메라 이동 대상 위치점 처리
    const camPos = sphere.center.clone().addScaledVector(direction, -sphere.radius);

    // 이전 트윈 중지
    if (posTween instanceof TWEEN.Tween) {
        posTween.stop();
        engine.TweenUpdateGroups.remove(posTween);
    }

    // 트윈 생성 및 시작
    posTween = new TWEEN.Tween(engine.Camera.position)
        .to({
            x: camPos.x,
            y: camPos.y,
            z: camPos.z,
        }, transitionTime * 1000)
        .easing(TWEEN.Easing.Quartic.InOut)
        .start();

    // 트윈 업데이트 그룹에 추가
    engine.TweenUpdateGroups.add(posTween);
}

/**
 * 카메라의 현재 상태(위치, 회전) 얻기
 * @returns - 현재 상태
 */
function GetState() {
    const camPos = new Interfaces.Vector3Custom().copy(engine.Camera.position);
    const camRot = new Interfaces.EulerCustom().copy(engine.Camera.rotation);

    return {
        position: camPos.ExportData,
        rotation: camRot.ExportData,
    }
}

/**
 * 카메라 상태 설정
 * @param state - 상태 정보
 */
function SetState(state: Record<string, any>, transitionTime: number) {
    // 애니메이션 처리 시간 기본값
    transitionTime = transitionTime || 1.0;

    // 이전 트윈 중지
    if (posTween instanceof TWEEN.Tween) {
        posTween.stop();
        engine.TweenUpdateGroups.remove(posTween);
    }
    if (rotTween instanceof TWEEN.Tween) {
        rotTween.stop();
        engine.TweenUpdateGroups.remove(rotTween);
    }

    // 트윈 생성 및 애니메이션 처리
    posTween = new TWEEN.Tween(engine.Camera.position)
        .to({
            x: state.position.x,
            y: state.position.y,
            z: state.position.z,
        }, transitionTime * 1000)
        .easing(TWEEN.Easing.Quartic.InOut)
        .start();

    rotTween = new TWEEN.Tween(engine.Camera.rotation)
        .to({
            x: state.rotation.x,
            y: state.rotation.y,
            z: state.rotation.z,
        }, transitionTime * 1000)
        .easing(TWEEN.Easing.Quartic.InOut)
        .start();

    // 트윈 업데이트 그룹 추가
    engine.TweenUpdateGroups.add(posTween);
    engine.TweenUpdateGroups.add(rotTween);
}

export {
    SetEnabled,
    ExtendView,
    GetState,
    SetState,
}