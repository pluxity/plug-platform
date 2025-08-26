import * as THREE from 'three';
import * as Addon from 'three/addons';
import { Engine3D } from '../engine';

let engine: Engine3D;
let outlinePass: Addon.OutlinePass;
let outlineTargets: THREE.Object3D[] = [];

/**
 * 외각선 기능 초기화
 * @param _engine - Engine3D 인스턴스
 */
function initialize(_engine: Engine3D) {
    engine = _engine;

    // 외각선 렌더링 패스 등록
    const container = engine.Dom as HTMLElement;
    outlinePass = new Addon.OutlinePass(new THREE.Vector2(container.clientWidth, container.clientHeight), engine.RootScene, engine.Camera);
    outlinePass.hiddenEdgeColor = new THREE.Color('white');
    outlinePass.edgeThickness = 5.0;
    outlinePass.edgeStrength = 10.0;
    engine.Composer.addPass(outlinePass);

    // 외각선 패스 사용시 씬이 어두워 지는 이슈가 있으므로 GammaCorrectionShader를 추가한다.
    const gammaCorrectionPass = new Addon.ShaderPass(Addon.GammaCorrectionShader);
    engine.Composer.addPass(gammaCorrectionPass);

}

/**
 * 외각선 기능 메모리 해제
 */
function dispose() {
    clearOutlineObjects();

    // outlinePass.dispose(); // 각 pass의 dispose는 Engine3D.dispose()에서 처리되므로 별도로 호출하지 않는다.
    outlinePass = null;

    outlineTargets = [];
    engine = null;
}

/**
 * 외각선 대상 객체 제거
 */
function clearOutlineObjects() {
    outlineTargets = [];
    if (outlinePass)
        outlinePass.selectedObjects = outlineTargets;
}

/**
 * 대상 객체를 외각선으로 설정
 * @param target - 대상 객체
 */
function setOutlineObjects(target: THREE.Object3D | THREE.Object3D[]) {
    outlineTargets = [];
    if (Array.isArray(target))
        outlineTargets = outlineTargets.concat(target);
    else
        outlineTargets.push(target);

    if (outlinePass)
        outlinePass.selectedObjects = outlineTargets;
}

/**
 * 대상 객체를 외각선 목록에 추가
 * @param target - 대상 객체
 */
function addOutlineObjects(target: THREE.Object3D | THREE.Object3D[]) {
    if (Array.isArray(target))
        outlineTargets = outlineTargets.concat(target);
    else
        outlineTargets.push(target);
    outlinePass.selectedObjects = outlineTargets;
}

/**
 * 외각선 대상 객체 얻기
 * @returns - 외각선 대상 객체
 */
function getOutlineTargets(): THREE.Object3D[] {
    return outlineTargets;
}

export {
    initialize,
    dispose,
    
    clearOutlineObjects,
    setOutlineObjects,
    addOutlineObjects,
    getOutlineTargets,
}