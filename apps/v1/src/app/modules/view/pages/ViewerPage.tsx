
import { useParams } from 'react-router-dom';
import MapViewer from "@plug/v1/app/modules/view/layouts/MapViewer/MapViewer";
import Header from "@plug/v1/app/modules/view/layouts/Header/Header";
import { useStationDetailSWR } from '@plug/common-services/services';

const ViewerPage = () => {
    const { stationId } = useParams<{ stationId: string }>();
    const parsedStationId = stationId ? parseInt(stationId, 10) : 1; // 기본값 1
    
    const { data: stationData, isLoading: stationLoading, error } = useStationDetailSWR(parsedStationId);

    // stationId가 유효하지 않은 경우
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

    // API 에러가 있는 경우
    if (error && !stationLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-red-500 text-xl">
                    스테이션 정보를 불러올 수 없습니다: {error.message}
                </div>
            </div>
        );
    }

    const modelPath: string = stationData?.facility?.drawing?.url || '';    const handleModelLoaded = () => {
        console.log(`스테이션 ${parsedStationId}의 3D 모델 로딩 완료`);
    };

    const handleLoadError = (error: Error) => {
        console.error(`스테이션 ${parsedStationId}의 3D 모델 로딩 실패:`, error);
    };

    // 디버그용 로그
    console.log('ViewerPage - Station ID:', parsedStationId, 'Data:', stationData);

    return (        
        <div className="relative w-screen h-screen overflow-hidden">
            {!stationLoading && (
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
        </div>
    );
};

export default ViewerPage;
