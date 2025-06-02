import { Path3DObject } from './path3dobject';
import * as Event from '../eventDispatcher';

const pathObjectList: Record<string, Path3DObject> = {};

/**
 * 경로 그리기 완료 이벤트 처리
 */
Event.InternalHandler.addEventListener('onPathCreatorFinished' as never, (evt: any) => {
    const createdPath: Path3DObject = evt.target;
    pathObjectList[createdPath.name] = createdPath;
});

/**
 * 층 펼치기/접기 이동 전 이벤트 처리
 */
Event.InternalHandler.addEventListener('onModelBeforeMove' as never, (evt: any) => {

    Object.values(pathObjectList).forEach(path => {
        path.visible = false;
    });
});

/**
 * 층 펼치기/접기 이동 후 이벤트 처리
 */
Event.InternalHandler.addEventListener('onModelAfterMove' as never, (evt: any) => {

    Object.values(pathObjectList).forEach(path => {
        path.updateLine();
        path.visible = true;
    });
});

/**
 * 특정 층 가시화 이벤트 처리
 */
Event.InternalHandler.addEventListener('onModelShow' as never, (evt: any) => {
    const floorId: string = evt.floorId;
    Object.values(pathObjectList).forEach(path => path.showLine(floorId));
});

/**
 * 특정 층 숨김 이벤트 처리
 */
Event.InternalHandler.addEventListener('onModelHide' as never, (evt: any) => {
    const floorId: string = evt.floorId;
    Object.values(pathObjectList).forEach(path => path.hideLine(floorId));
});

/**
 * 모든 층 가시화 이벤트 처리
 */
Event.InternalHandler.addEventListener('onModelShowAll' as never, (evt: any) => {
    Object.values(pathObjectList).forEach(path => path.showAllLine());
});

/**
 * 모든 층 숨김 이벤트 처리
 */
Event.InternalHandler.addEventListener('onModelHideAll' as never, (evt: any) => {
    Object.values(pathObjectList).forEach(path => path.hideAllLine());
});

/**
 * id에 해당하는 경로 객체가 생성되어 있는지 확인
 * @param id - 경로 id값
 * @returns - 생성여부
 */
function exists(id: string) {
    return pathObjectList.hasOwnProperty(id);
}

function Export() {    
}

function Import() {

}

export {
    exists,
}