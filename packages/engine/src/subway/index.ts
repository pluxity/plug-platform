import { Engine3D } from '../engine';

import { initialize as createInitialize, dispose as createDispose } from './create';
export { Cancel, Create, EnableSetEntranceLocation, EnableSetExitLocation, EnableSetStopLocation, Finish } from './create';

import { initialize as subwayModelLoaderInitialize, dispose as subwayModelLoaderDispose } from './subwaymodelloader';
export { LoadTrainBody, LoadTrainHead, LoadTrainTail } from './subwaymodelloader';

import { initialize as dataInitialize, dispose as dataDispose } from './data';
export { Clear, DoEnter, DoExit, Export, Hide, HideAll, Import, Show, ShowAll } from './data';

/**
 * 초기화
 */
function initialize(engine: Engine3D) {
    createInitialize(engine);
    subwayModelLoaderInitialize(engine);
    dataInitialize(engine);
}

/**
 * 메모리 해제
 */
function dispose() {
    createDispose();
    subwayModelLoaderDispose();
    dataDispose();
}

export {
    initialize,
    dispose,
}