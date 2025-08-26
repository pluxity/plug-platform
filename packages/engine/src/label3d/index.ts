import { Engine3D } from '../engine';

import { initialize as createInitialize, dispose as createDispose } from './create';
export { Create, Cancel, Enabled } from './create';

import { initialize as dataInitialize, dispose as dataDispose } from './data';
export { Hide, HideAll, Show, ShowAll, Delete, Clear, Export, Import } from './data';

import { initialize as editInitialize, dispose as editDispose } from './edit';
export { StartEdit, FinishEdit } from './edit';

/**
 * Label3D 하윔 모듈 초기화
 * @param _engine - 엔진 인스턴스
 */
function initialize(_engine: Engine3D) {
    createInitialize(_engine);
    dataInitialize(_engine);
    editInitialize(_engine);
}

/**
 * Label3D 하윔 모듈 메모리 해제
 */
function dispose() {
    createDispose();
    dataDispose();
    editDispose();
}

export {
    initialize,
    dispose,
}