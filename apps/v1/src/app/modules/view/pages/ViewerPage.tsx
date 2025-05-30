import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Header, SideMenu, EventCounter } from "@plug/v1/app/modules/view/layouts";
import { MapViewer } from '@plug/v1/app/modules/components/map';
import { api } from '@plug/api-hooks/core';
import type { StationData } from '@plug/common-services/types';
import useStationStore from '@plug/v1/app/stores/stationStore';

const ViewerPage = () => {
    const { stationId } = useParams<{ stationId: string }>();
    const parsedStationId = stationId ? parseInt(stationId, 10) : 1;
    const { setStationId } = useStationStore();
    
    const [stationData, setStationData] = useState<StationData | null>(null);
    const [stationLoading, setStationLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        setStationId(parsedStationId);
    }, [parsedStationId, setStationId]);

    useEffect(() => {
        const fetchStationData = async () => {
            try {
                setStationLoading(true);
                const response = await api.get<StationData>(`stations/${parsedStationId}/with-features`);
                setStationData(response.data);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Unknown error'));
            } finally {
                setStationLoading(false);
            }
        };
        
        if (!isNaN(parsedStationId) && parsedStationId > 0) {
            fetchStationData();
        }
    }, [parsedStationId]);

    if (error && !stationLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-red-500 text-xl">
                    스테이션 정보를 불러올 수 없습니다: {error.message}
                </div>
            </div>
        );
    }

    const modelPath: string = stationData?.facility?.drawing?.url || '';
    
    const handleModelLoaded = () => {
        console.log('3D 모델 로드 완료');
    };
    
    const handleLoadError = (error: Error) => {
        console.error('3D 모델 로드 실패:', error);
        setError(error);
    };
    

    return (         
        <div className="relative w-screen h-screen overflow-hidden bg-indigo-950">            
            {!stationLoading && stationData && (
                <MapViewer 
                    modelPath={modelPath}
                    onModelLoaded={handleModelLoaded}
                    onLoadError={handleLoadError}
                />
            )}
            {stationLoading && (
                <div className="absolute inset-0 bg-gray-900 flex items-center justify-center z-10">
                    <div className="text-white text-xl">
                        스테이션 {parsedStationId} 정보 로딩 중...
                    </div>                
                </div>
            )}
            <Header />
            <SideMenu />
            <EventCounter stationId={parsedStationId.toString()} />
        </div>
    );
};

export default ViewerPage;
