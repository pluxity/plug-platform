
import { api } from "@plug/api-hooks";
import { useEffect, useState } from "react";
import type { StationData } from "./types";

import { AssetList, MapViewer } from "./components";

const Viewer = () => {

    const [stationData, setStationData] = useState<StationData | null>(null);
    
    useEffect(() => {
        const fetchStation = async () => {
            const response = await api.get<StationData>(`stations/2`);
            setStationData(response.data);
        };

        fetchStation();
    }, []);

    const modelPath: string = stationData?.facility?.drawing?.url || '';
    
    const handleModelLoaded = () => {
        console.log('3D 모델 로드 완료');
    };

    return (
        <>
            <aside className="bg-red-100 w-1/4 p-2 overflow-y-auto">
                <AssetList />
                { /* 필터링(AssetCategory) + 검색 기능 */}
                { /* divider */ }
                { /* '/assets' Asset  목록 썸네일로 보여주기 */ }
                { /* Px.Poi 관련 함수 Asset 클릭 시 해당 Asset의 상세 정보 표출 */ }



            </aside>
            <main className="w-full">
                {stationData && (
                    <MapViewer 
                        modelPath={modelPath}
                        onModelLoaded={handleModelLoaded}
                    />
                )}
                { /*  */ }
                { /* 3D 화면 표출 */ }
            </main>
        </>
    );
};

export default Viewer;