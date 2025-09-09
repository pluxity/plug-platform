import * as THREE from 'three';
import { computeBoundsTree, disposeBoundsTree, acceleratedRaycast, MeshBVHHelper } from 'three-mesh-bvh';

// Add the extension functions
THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
THREE.Mesh.prototype.raycast = acceleratedRaycast;

// export * from './engine';
import { Engine3D } from './engine';

export * as Interfaces from './interfaces';

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

import * as CameraInternal from './camera';
export const Camera = {
    SetEnabled: CameraInternal.SetEnabled,
    SetRotateButton: CameraInternal.SetRotateButton,
    SetPanButton: CameraInternal.SetPanButton,
    SetDragZoomButton: CameraInternal.SetDragZoomButton,
    ExtendView: CameraInternal.ExtendView,
    GetState: CameraInternal.GetState,
    SetState: CameraInternal.SetState,
    MoveToPoi: CameraInternal.MoveToPoi,
    MoveToFloor: CameraInternal.MoveToFloor,
};

import * as Label3DInternal from './label3d';
export const Label3D = {
    Create: Label3DInternal.Create,
    Cancel: Label3DInternal.Cancel,
    Enabled: Label3DInternal.Enabled,
    Hide: Label3DInternal.Hide,
    HideAll: Label3DInternal.HideAll,
    Show: Label3DInternal.Show,
    ShowAll: Label3DInternal.ShowAll,
    Delete: Label3DInternal.Delete,
    Clear: Label3DInternal.Clear,
    Export: Label3DInternal.Export,
    Import: Label3DInternal.Import,
    StartEdit: Label3DInternal.StartEdit,
    FinishEdit: Label3DInternal.FinishEdit,
};

import * as LoaderInternal from './loader';
export const Loader = {
    LoadGltf: LoaderInternal.LoadGltf,
    LoadSbm: LoaderInternal.LoadSbm,
};

import * as ModelInternal from './model';
export const Model = {
    GetModelHierarchy: ModelInternal.GetModelHierarchy,
    GetModelHierarchyFromUrl: ModelInternal.GetModelHierarchyFromUrl,
    Show: ModelInternal.Show,
    Hide: ModelInternal.Hide,
    ShowAll: ModelInternal.ShowAll,
    HideAll: ModelInternal.HideAll,
    Expand: ModelInternal.Expand,
    Collapse: ModelInternal.Collapse,
};

import * as Path3DInternal from './path3d';
export const Path3D = {
    CreatePath: Path3DInternal.CreatePath,
    Cancel: Path3DInternal.Cancel,
    Finish: Path3DInternal.Finish,
    Export: Path3DInternal.Export,
    Import: Path3DInternal.Import,
    Clear: Path3DInternal.Clear,
    Hide: Path3DInternal.Hide,
    HideAll: Path3DInternal.HideAll,
    Show: Path3DInternal.Show,
    ShowAll: Path3DInternal.ShowAll,

};

import * as PoiInternal from './poi';
export const Poi = {
    Clear: PoiInternal.Clear,
    Delete: PoiInternal.Delete,
    Export: PoiInternal.Export,
    ExportAll: PoiInternal.ExportAll,
    GetAnimationList: PoiInternal.GetAnimationList,
    Hide: PoiInternal.Hide,
    HideAll: PoiInternal.HideAll,
    HideAllHtmlObject: PoiInternal.HideAllHtmlObject,
    HideHtmlObject: PoiInternal.HideHtmlObject,
    Import: PoiInternal.Import,
    PlayAnimation: PoiInternal.PlayAnimation,
    SetTextInnerHtml: PoiInternal.SetTextInnerHtml,
    Show: PoiInternal.Show,
    ShowAll: PoiInternal.ShowAll,
    ShowAllHtmlObject: PoiInternal.ShowAllHtmlObject,
    ShowHtmlObject: PoiInternal.ShowHtmlObject,
    StopAnimation: PoiInternal.StopAnimation,
    Create: PoiInternal.Create,
    StartEdit: PoiInternal.StartEdit,
    FinishEdit: PoiInternal.FinishEdit,
    SetHtmlObjectVisibilityCheck: PoiInternal.SetHtmlObjectVisibilityCheck,
};

import * as SubwayInternal from './subway';
export const Subway = {
    Cancel: SubwayInternal.Cancel,
    Create: SubwayInternal.Create,
    EnableSetEntranceLocation: SubwayInternal.EnableSetEntranceLocation,
    EnableSetExitLocation: SubwayInternal.EnableSetExitLocation,
    EnableSetStopLocation: SubwayInternal.EnableSetStopLocation,
    Finish: SubwayInternal.Finish,
    LoadTrainBody: SubwayInternal.LoadTrainBody,
    LoadTrainHead: SubwayInternal.LoadTrainHead,
    LoadTrainTail: SubwayInternal.LoadTrainTail,
    Clear: SubwayInternal.Clear,
    DoEnter: SubwayInternal.DoEnter,
    DoExit: SubwayInternal.DoExit,
    Export: SubwayInternal.Export,
    Hide: SubwayInternal.Hide,
    HideAll: SubwayInternal.HideAll,
    Import: SubwayInternal.Import,
    Show: SubwayInternal.Show,
    ShowAll: SubwayInternal.ShowAll,
};