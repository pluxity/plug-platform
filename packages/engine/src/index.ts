
// export * from './engine';
import { Engine3D } from './engine';

export * as Loader from './loader';
export * as Camera from './camera';
export * as Model from './model';
export * as Poi from './poi';
export * as Path3D from './path3d';
export * as Interfaces from './interfaces';
export * as Subway from './subway';
export * as Label3D from './label3d';

// Core
let engine: Engine3D = null;
export const Core = {
    Initialize: (container: HTMLElement) => {
        engine = new Engine3D(container);
    },
    Dispose: () => {
        if (engine)
            engine.dispose();
    },
    Resize: () => {
        if (engine)
            engine.onResize();
    }
};

// Util의 경우 내부사용 함수도 있으므로 지정한것들만 export하도록 처리
import * as UtilInternal from './util';
export const Util = {
    SetBackground: UtilInternal.SetBackground
};

export const Event = {
    AddEventListener: (type: string, callback: Function) => {
        if (engine)
            engine.EventHandler.addEventListener(type as never, callback as never);
        else
            UtilInternal.addDeferredEventCallback(type, callback);
    },
    RemoveEventListener: (type: string, callback: Function) => {
        if (engine)
            engine.EventHandler.removeEventListener(type as never, callback as never);
    }
};

import * as EffectInternal from './effect';
export const Effect = {
    Outline: {
        SetPoiOutline: EffectInternal.SetPoiOutline,
        Clear: EffectInternal.clearOutlineObjects,
        SetOutlineOptions: EffectInternal.SetOutlineOptions,
    },
};