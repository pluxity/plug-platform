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

const ViewerPage = () => {
    const { code } = useParams<{ code: string }>();
    const parsedCode = code ?? '1';

    const { setStationCode } = useStationStore();
    const { fetchAssets } = useAssetStore();

    const { stationData, stationLoading, error } = useStationData(parsedCode);
    const { floorItems, modelPath } = useFloorData(stationData);
    
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
