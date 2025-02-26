import * as Event from '../eventDispatcher';
import * as Interfaces from '../interfaces';

const poiDataList: Record<string, Interfaces.PoiData> = {};

/**
 * poi 생성 이벤트
 */
Event.InternalHandler.addEventListener('onPoiPlaced' as never, (evt: any) => {
    const data: Interfaces.PoiData = evt.target as Interfaces.PoiData;
    poiDataList[data.id] = data;

    // // poi 데이터 추가 이벤트 통지
    // Event.InternalHandler.dispatchEvent({
    //     type: 'onPoiDataAdded',
    //     target: data,
    // });
});

/**
 * poi 선 업데이트
 */
function updateLine() {

}