import { Engine3D } from '../engine';

import { initialize as placerInitialize, dispose as placerDispose } from './placer';

import { initialize as dataInitialize, dispose as dataDispose } from './data';
export {
    Clear,
    Delete,
    Export,
    ExportAll,
    GetAnimationList,
    Hide,
    HideAll,
    HideAllHtmlObject,
    HideHtmlObject,
    Import,
    PlayAnimation,
    SetTextInnerHtml,
    Show,
    ShowAll,
    ShowAllHtmlObject,
    ShowHtmlObject,
    StopAnimation,
    SetHtmlObjectVisibilityCheck,
} from './data';

import { initialize as createInitialize, dispose as createDispose } from './create';
export { Create } from './create';

import { initialize as editInitialize, dispose as editDispose } from './edit';
export { StartEdit, FinishEdit } from './edit';

/**
 * 초기화
 */
function initialize(engine: Engine3D) {
    placerInitialize(engine);
    dataInitialize(engine);
    createInitialize(engine);
    editInitialize(engine);
}

/**
 * 메모리 해제
 */
function dispose() {
    placerDispose();
    dataDispose();
    createDispose();
    editDispose();
}

export {
    initialize,
    dispose,
}