import { useParams } from 'react-router-dom';
import { useEffect, useCallback } from 'react';
import { Header, SideMenu, EventCounter } from "@plug/v1/app/modules/view/layouts";
import { MapViewer } from '@plug/v1/app/modules/components/map';
import type { PoiImportOption } from '@plug/engine/src/interfaces';
import useStationStore from '@plug/v1/app/stores/stationStore';
import useEventStore from '@plug/v1/app/stores/eventSourceStore';
import { useAssetStore } from '@plug/v1/common/store/assetStore';
import { useEngineIntegration } from '../hooks/useEngineIntegration';
import { useStationData } from '../hooks/useStationData';
import { useFloorData } from '../hooks/useFloorData';
import { EventData, ShutterData, TrainData } from '@plug/v1/app/modules/view/types/stream';
import * as Px from '@plug/engine/src';

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

        if(stationData?.route) {
            Px.Path3D.Import(JSON.parse(stationData?.route));
            Px.Path3D.HideAll();
        }
        
        const loadTrainModels = () => {
          return Promise.all([
              new Promise<void>((resolve) => {
                  Px.Subway.LoadTrainHead("/assets/models/head.glb", () => { 
                      resolve();
                  });
              }),
              new Promise<void>((resolve) => {
                  Px.Subway.LoadTrainBody("/assets/models/body.glb", () => {
                      resolve();
                  });
              }),
              new Promise<void>((resolve) => {
                  Px.Subway.LoadTrainTail("/assets/models/tail.glb", () => {
                      resolve();
                  });
              })
          ]);
      };

      loadTrainModels().then(() => {
          if(stationData?.subway) {
              Px.Subway.Import(JSON.parse(stationData?.subway));
              Px.Subway.HideAll();
          }
      });

    }, [engineModelLoaded, stationData]);  
    
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
        }
      });

      eventSource.addEventListener('event', (event) => {
        const data = JSON.parse(event.data) as EventData[];
        if (data.length > 0) {
          setEventData(data);
        }
      });

      eventSource.addEventListener('shutter', (event) => {
        const data = JSON.parse(event.data) as ShutterData[];
        if (data.length > 0) {
          setShutterData(data);
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

//   const eventData = useEventStore(state => state.eventData);
//   const shutterData = useEventStore(state => state.shutterData);

  if (error && !stationLoading) {
        return (
          <div className="flex items-center justify-center h-screen bg-gray-900">
            <div className="bg-red-900/30 backdrop-blur-lg border border-red-500/30 rounded-xl px-8 py-6 flex items-center gap-4 shadow-lg">
              <svg
                className="w-8 h-8 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <div className="text-red-200 text-xl font-semibold tracking-wide">
                스테이션 정보를 불러올 수 없습니다: {error.message}
              </div>
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
          <div className="absolute inset-0 bg-gray-900/95 flex items-center justify-center z-10 backdrop-blur-sm">
            <div className="bg-primary-900/30 backdrop-blur-md border border-primary-500/20 rounded-xl px-8 py-6 flex items-center gap-4 shadow-lg">
              <div className="animate-spin w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full"></div>
              <div className="text-primary-100 text-xl font-medium tracking-wide">
                스테이션 {parsedCode} 정보 로딩 중...
              </div>
            </div>
          </div>
        )}
        <Header />
        <SideMenu />
        {stationData && <EventCounter stationId={stationData.externalCode} />}

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
