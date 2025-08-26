import { Engine3D } from '../engine';

import { initialize as modelInitialize, dispose as modelDispose } from './model';
export { GetModelHierarchy, GetModelHierarchyFromUrl, Show, Hide, ShowAll, HideAll, Expand, Collapse } from './model';

/**
 * 초기화
 */
function initialize(engine: Engine3D) {
    // 모델 초기화
    modelInitialize(engine);
}

/**
 * 메모리 해제
 */
function dispose() {
    // 모델 메모리 해제
    modelDispose();
}

export {
    initialize,
    dispose,
}