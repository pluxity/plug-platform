import { Engine3D } from '../engine';

import { initialize as pathCreatorInitialize, dispose as pathCreatorDispose } from './pathcreator';
export { CreatePath, Cancel, Finish } from './pathcreator';

import { initialize as dataInitialize, dispose as dataDispose } from './data';
export { Export, Import, Clear, Hide, HideAll, Show, ShowAll } from './data';

/**
 * 초기화
 */
function initialize(engine: Engine3D) {
    dataInitialize(engine);
    pathCreatorInitialize(engine);
}

/**
 * 메모리 해제
 */
function dispose() {
    dataDispose();
    pathCreatorDispose();
}

export {
    initialize,
    dispose,
}