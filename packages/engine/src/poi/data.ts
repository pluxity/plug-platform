import * as Event from '../eventDispatcher';
import * as Interfaces from '../interfaces';

const poiDataList: Record<string, Interfaces.PoiData> = {};

/**
 * poi 생성 이벤트
 */
Event.InternalHandler.addEventListener('onPoiPlaced' as never, (evt: any) => {
    const data: Interfaces.PoiData = evt.target as Interfaces.PoiData;
    poiDataList[data.id] = data;
});

/**
 * 익스포트용 poi 데이터 얻기
 * @param id - poi id값
 */
function Export(id: string) {
    if (poiDataList.hasOwnProperty(id)) {
        const poi = poiDataList[id];
        return {
            id: poi.id,
            iconUrl: poi.iconUrl,
            modelUrl: poi.modelUrl,
            displayText: poi.displayText,
            property: poi.property,
            position: poi.position?.ExportData,
        };
    }
}

export {
    Export
}