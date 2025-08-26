import * as THREE from 'three';
import { Engine3D } from '../engine';
import { Path3DObject } from './path3dobject';
import * as Interfaces from '../interfaces';
import * as ModelInternal from '../model/model';

let pathObjectList: Record<string, Path3DObject> = {};
let pathRenderGroup: THREE.Group;
let engine: Engine3D;

/**
 * 초기화
 */
function initialize(_engine: Engine3D) {
    engine = _engine;

    // 이벤트 등록
    engine.EventHandler.addEventListener('onPathCreatorInitialized' as never, onPathCreatorInitialized);
    engine.EventHandler.addEventListener('onPathCreatorFinished' as never, onPathCreatorFinished);
    engine.EventHandler.addEventListener('onModelBeforeMove' as never, onModelBeforeMove);
    engine.EventHandler.addEventListener('onModelAfterMove' as never, onModelAfterMove);
    engine.EventHandler.addEventListener('onModelShow' as never, onModelShow);
    engine.EventHandler.addEventListener('onModelHide' as never, onModelHide);
    engine.EventHandler.addEventListener('onModelShowAll' as never, onModelShowAll);
    engine.EventHandler.addEventListener('onModelHideAll' as never, onModelHideAll);
}

/**
 * 메모리 해제
 */
function dispose() {
    
    engine.EventHandler.removeEventListener('onPathCreatorInitialized' as never, onPathCreatorInitialized);
    engine.EventHandler.removeEventListener('onPathCreatorFinished' as never, onPathCreatorFinished);
    engine.EventHandler.removeEventListener('onModelBeforeMove' as never, onModelBeforeMove);
    engine.EventHandler.removeEventListener('onModelAfterMove' as never, onModelAfterMove);
    engine.EventHandler.removeEventListener('onModelShow' as never, onModelShow);
    engine.EventHandler.removeEventListener('onModelHide' as never, onModelHide);
    engine.EventHandler.removeEventListener('onModelShowAll' as never, onModelShowAll);
    engine.EventHandler.removeEventListener('onModelHideAll' as never, onModelHideAll);

    Clear();
    pathObjectList = {};
    pathRenderGroup = null;
    engine = null;
}

/**
 * pathcreator.ts 초기화 완료 이벤트 처리
 */
function onPathCreatorInitialized(evt: any) {
    pathRenderGroup = evt.pathRenderGroup;
}

/**
 * 경로 그리기 완료 이벤트 처리
 */
function onPathCreatorFinished(evt: any) {
    const createdPath: Path3DObject = evt.target;
    pathObjectList[createdPath.name] = createdPath;
}

/**
 * 층 펼치기/접기 이동 전 이벤트 처리
 */
function onModelBeforeMove(evt: any) {
    Object.values(pathObjectList).forEach(path => {
        path.visible = false;
    });
}

/**
 * 층 펼치기/접기 이동 후 이벤트 처리
 */
function onModelAfterMove(evt: any) {
    Object.values(pathObjectList).forEach(path => {
        path.updateLine();
        path.visible = true;
    });
}

/**
 * 특정 층 가시화 이벤트 처리
 */
function onModelShow(evt: any) {
    const floorId: string = evt.floorId;
    Object.values(pathObjectList).forEach(path => path.showLine(floorId));
}

/**
 * 특정 층 숨김 이벤트 처리
 */
function onModelHide(evt: any) {
    const floorId: string = evt.floorId;
    Object.values(pathObjectList).forEach(path => path.hideLine(floorId));
}

/**
 * 모든 층 가시화 이벤트 처리
 */
function onModelShowAll(evt: any) {
    Object.values(pathObjectList).forEach(path => path.showAllLine());
}

/**
 * 모든 층 숨김 이벤트 처리
 */
function onModelHideAll(evt: any) {
    Object.values(pathObjectList).forEach(path => path.hideAllLine());
}

/**
 * id에 해당하는 경로 객체가 생성되어 있는지 확인
 * @param id - 경로 id값
 * @returns - 생성여부
 */
function exists(id: string) {
    return pathObjectList.hasOwnProperty(id);
}

/**
 * 생성되어 있는 경로들을 배열로 얻기
 * @returns - 경로 객체 배열
 */
function getPathObjects(): Path3DObject[] {
    if (pathObjectList)
        return Object.values(pathObjectList);
    else
        return [];
}

/**
 * 경로 객체 인스턴스 얻기
 * @param id - 경로 id값
 * @returns - 경로 객체
 */
function getPathObject(id: string): Path3DObject {
    if (pathObjectList.hasOwnProperty(id))
        return pathObjectList[id];

    return null;
}

/**
 * 경로 데이터 익스포트
 * @returns - 경로 데이터
 */
function Export(): Interfaces.Path3DData[] {
    const result: Interfaces.Path3DData[] = [];

    Object.values(pathObjectList).forEach(path => result.push(path.ExportData));

    return result;
}

/**
 * 경로 데이터 임포트
 * @param data - 경로 데이터
 */
function Import(data: string | Interfaces.Path3DData | Interfaces.Path3DData[]) {
    Clear();

    if (typeof (data) === 'string') {
        data = JSON.stringify(data);
    }

    if (Array.isArray(data) === false) {
        data = [data as Interfaces.Path3DData];
    }

    (data as Interfaces.Path3DData[]).forEach(item => {
        const path = new Path3DObject(item.color);
        path.name = item.id;
        pathRenderGroup.add(path);

        item.points.forEach(p => {
            const id = p.id;
            const position = new THREE.Vector3(p.point.x, p.point.y, p.point.z);
            const floor = ModelInternal.getFloorObject(p.floorId);
            const isStraightLine = p.isStraightLine;

            if (!floor) {
                console.error('Path3D.Import -> 층객체를 찾지 못함 floorId: ', p.floorId);
            } else {
                path.createPointFromData(id, position, floor, isStraightLine);
            }
        });

        path.updateControlPointState();
        path.updateLine();
        pathObjectList[path.name] = path;
    });

}

/**
 * 경로 전체 제거
 */
function Clear() {
    Object.values(pathObjectList).forEach(path => {
        path.parent?.remove(path);
        path.dispose();
    });
    pathObjectList = {};
}

/**
 * id에 해당하는 경로 숨기기
 * @param id - 경로 id값
 */
function Hide(id: string) {
    if (pathObjectList.hasOwnProperty(id))
        pathObjectList[id].Visible = false;
}

/**
 * id에 해당하는 경로 보이기
 * @param id - 경로 id값
 */
function Show(id: string) {
    if (pathObjectList.hasOwnProperty(id))
        pathObjectList[id].Visible = true;
}

/**
 * 모든 경로 숨기기기
 */
function HideAll() {
    Object.values(pathObjectList).forEach(path => path.Visible = false);
}

/**
 * 모든 경로 보이기
 */
function ShowAll() {
    Object.values(pathObjectList).forEach(path => path.Visible = true);
}

export {
    initialize,
    dispose,

    exists,
    getPathObjects,
    getPathObject,

    Export,
    Import,
    Clear,

    Hide,
    Show,
    HideAll,
    ShowAll,
}