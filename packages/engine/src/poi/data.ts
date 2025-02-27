import * as Event from '../eventDispatcher';
import * as Interfaces from '../interfaces';
import { PoiElement } from './element';

const poiDataList: Record<string, PoiElement> = {};

/**
 * poi 생성 이벤트
 */
Event.InternalHandler.addEventListener('onPoiPlaced' as never, (evt: any) => {
    const data: PoiElement = evt.target as PoiElement;
    poiDataList[data.id] = data;

    updatePoiLine();
});

/**
 * poi 선 업데이트
 */
function updatePoiLine() {

}

/**
 * 익스포트용 poi 데이터 얻기
 * @param id - poi id값
 */
function Export(id: string) {
    if (poiDataList.hasOwnProperty(id)) {
        const poi = poiDataList[id];
        return poi.ExportData;
    }
}

export {
    Export
}