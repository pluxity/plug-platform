import { Engine3D } from '../engine';

import { initialize as gltfInitialize, dispose as gltfDispose } from './gltf';
export { LoadGltf } from './gltf';

import { initialize as sbmInitialize, dispose as sbmDispose } from './sbm';
export { LoadSbm } from './sbm';

/**
 * 초기화
 */
function initialize(engine: Engine3D) {
    gltfInitialize(engine);
    sbmInitialize(engine);
}

/**
 * 메모리 해제
 */
function dispose() {
    gltfDispose();
    sbmDispose();
}

export {
    initialize,
    dispose,
}