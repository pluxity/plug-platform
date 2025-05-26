
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { MapViewer, Header, FloorSelector, EventCounter } from "@plug/v1/app/modules/view/layouts";
import { api } from '@plug/api-hooks/core';
import type { StationData, Floor } from '@plug/common-services/types';

const ViewerPage = () => {
    const { stationId } = useParams<{ stationId: string }>();
    const parsedStationId = stationId ? parseInt(stationId, 10) : 1; // 기본값 1
    
    // 상태 관리를 위한 useState
    const [stationData, setStationData] = useState<StationData | null>(null);
    const [stationLoading, setStationLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const [currentFloor, setCurrentFloor] = useState<string>('ALL');

    useEffect(() => {
        // 비동기 함수 정의
        const fetchStationData = async () => {
            try {
                setStationLoading(true);
                const response = await api.get<StationData>(`stations/${parsedStationId}`);
                setStationData(response.data);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Unknown error'));
            } finally {
                setStationLoading(false);
            }
        };
        
        // 유효한 ID인 경우에만 API 호출
        if (!isNaN(parsedStationId) && parsedStationId > 0) {
            fetchStationData();
        }
    }, [parsedStationId]); // parsedStationId가 변경될 때만 다시 실행

    const isInvalidStationId = isNaN(parsedStationId) || parsedStationId <= 0;
    
    if (isInvalidStationId) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-red-500 text-xl">
                    유효하지 않은 스테이션 ID입니다: {stationId}
                </div>
            </div>
        );
    }

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
    
    const handleFloorChange = (floorId: string) => {
        setCurrentFloor(floorId);
    };

    // 층 정보 생성
    const floorItems = stationData?.floors 
        ? [...stationData.floors]
            .reverse()
            .map((floor: Floor) => ({
                id: floor.groupId,
                name: `${floor.name}`
            }))
        : [];
    
    // 전체층 옵션 추가
    const floorsWithAll = [...floorItems, { id: 'ALL', name: '전체층' }];

    return (          <div className="relative w-screen h-screen overflow-hidden bg-indigo-950">
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
            <EventCounter stationId={parsedStationId.toString()} />
            {/* <StationInfo stationId={parsedStationId.toString()} /> */}
            {!stationLoading && stationData && (
                <FloorSelector 
                    floors={floorsWithAll} 
                    currentFloor={currentFloor}
                    onFloorChange={handleFloorChange}
                />
            )}
        </div>
    );
};

export default ViewerPage;
