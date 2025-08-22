import { Engine3D } from '../engine';
import { initialize as OutlineInitialize, dispose as OutlineDispose } from './outline';

export * as Outline from './outline';

/**
 * 효과 하위 모듈 초기화
 * @param _engine - Engine3D 인스턴스
 */
function initialize(_engine: Engine3D) {
    // 외각선 효과 초기화
    OutlineInitialize(_engine);
}

/**
 * 효과 하위 모듈 메모리 해제
 */
function dispose() {
    OutlineDispose();
}

export {
    initialize,
    dispose,
}