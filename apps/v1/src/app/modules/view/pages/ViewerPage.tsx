import { useParams } from 'react-router-dom';
import { useEffect, useCallback } from 'react';
import { Header, SideMenu, EventCounter } from "@plug/v1/app/modules/view/layouts";
import { MapViewer } from '@plug/v1/app/modules/components/map';
import type { PoiImportOption } from '@plug/engine/src/interfaces';
import useStationStore from '@plug/v1/app/stores/stationStore';
import { useAssetStore } from '@plug/v1/common/store/assetStore';
import { useEngineIntegration } from '../hooks/useEngineIntegration';
import { useStationData } from '../hooks/useStationData';
import { useFloorData } from '../hooks/useFloorData';
import { EventData, ShutterData, TrainData } from '@plug/v1/app/modules/view/types/stream';
import useEventStore from '@plug/v1/app/stores/eventSourceStore';

const ViewerPage = () => {
    const { code } = useParams<{ code: string }>();
    const parsedCode = code ?? '1';

    const { setStationCode } = useStationStore();
    const { fetchAssets } = useAssetStore();

    const { stationData, stationLoading, error } = useStationData(parsedCode);
    const { floorItems, modelPath } = useFloorData(stationData);
  const { setTtcData, setEventData, setShutterData } = useEventStore();

  const handleLoadError = useCallback((loadError: Error) => {
        console.error('3D 모델 로드 실패:', loadError);
    }, []);    
    
    const handlePoiSelect = useCallback((poi: PoiImportOption) => {
        console.log('POI 선택됨:', poi);
    }, []);

    const { handleModelLoaded: engineModelLoaded } = useEngineIntegration({
        stationData,
        onPoiSelect: handlePoiSelect,
    });

    const handleModelLoadedWithEngine = useCallback(() => {
        engineModelLoaded();
    }, [engineModelLoaded]);    
    
    useEffect(() => {
        setStationCode(parsedCode);
    }, [parsedCode, setStationCode]);

    useEffect(() => {
        fetchAssets();
    }, [fetchAssets]);

  useEffect(() => {
    const eventSource = new EventSource('/api/sse');

    eventSource.addEventListener('ttc-data', (event) => {
      const data = JSON.parse(event.data) as TrainData[];
      const filteredData = data.filter(d => d.arrivalStationCode === parsedCode);
      if (filteredData.length > 0) {
        setTtcData(filteredData);
        console.log('ttc-data', filteredData);
      }
    });

    eventSource.addEventListener('event', (event) => {
      const data = JSON.parse(event.data) as EventData[];
      if (data.length > 0) {
        setEventData(data);
        console.log('event-data', data);
      }
    });

    eventSource.addEventListener('shutter', (event) => {
      const data = JSON.parse(event.data) as ShutterData[];
      if (data.length > 0) {
        setShutterData(data);
        console.log('event2-data', data);
      }
    });


    eventSource.onerror = (err) => {
      console.error('SSE 에러:', err);
    };

    return () => {
      console.log('SSE 연결 종료');
      eventSource.close();
    };
  }, []);

  const eventData = useEventStore(state => state.eventData);
  const shutterData = useEventStore(state => state.shutterData);
  console.log('eventData', eventData, 'shutterData', shutterData);

  if (error && !stationLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-red-500 text-xl">
                    스테이션 정보를 불러올 수 없습니다: {error.message}
                </div>
            </div>
        );
    }    return (         
        <div className="relative w-screen h-screen overflow-hidden bg-indigo-950">
            {!stationLoading && stationData && (
                <MapViewer 
                    modelPath={modelPath}
                    floors={floorItems}
                    onModelLoaded={handleModelLoadedWithEngine}
                    onLoadError={handleLoadError}
                />
            )}
            {stationLoading && (
                <div className="absolute inset-0 bg-gray-900 flex items-center justify-center z-10">
                    <div className="text-white text-xl">
                        스테이션 {parsedCode} 정보 로딩 중...
                    </div>                
                </div>
            )}
            <Header />
            <SideMenu />
            { stationData && (
                    <EventCounter stationId={stationData.externalCode} />
            )}
            
            {/* POI 클릭 시 나타나는 디바이스 상세 모달 */}
            {/* <DeviceDetailModal
                isOpen={!!selectedDeviceId}
                onClose={() => setSelectedDeviceId(null)}
                stationId={stationData?.externalCode ?? ''}
                selectedDeviceId={selectedDeviceId}
                deviceType="shutter"
            /> */}
        </div>
    );
};

export default ViewerPage;
