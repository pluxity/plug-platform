import { Path3D } from './path3d';
import * as Event from '../eventDispatcher';

const createdPathObjects: Path3D[] = [];

/**
 * 층 펼치기/접기 이동 후 이벤트 처리
 */
Event.InternalHandler.addEventListener('onModelAfterMove' as never, (event: any) => {
    // 변경된 더미 객체 위치에 따라 경로 객체들의 geometry를 업데이트 처리

});

function addPathObject(path: Path3D): void {
    createdPathObjects.push(path);
}

function removePathObject(path: Path3D): void {
    const index = createdPathObjects.indexOf(path);
    if (index !== -1) {
        const deleteObject = createdPathObjects.splice(index, 1);
        deleteObject[0].parent?.remove(deleteObject[0]);
        deleteObject[0].dispose();
    }
}

export {
    addPathObject,
    removePathObject,
}