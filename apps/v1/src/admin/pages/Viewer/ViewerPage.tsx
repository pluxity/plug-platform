import { api } from "@plug/api-hooks";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { StationData } from "./types";

import { AssetList, MapViewer } from "./components";
import * as Px from '@plug/engine/src';
import { Select } from "@plug/ui";


interface ModelInfo {
    objectName: string;
    displayName: string;
    sortingOrder: number;
    floorId: string;
}

const Viewer = () => {
    // URL 파라미터에서 stationId 가져오기
    const { stationId } = useParams<{ stationId: string }>();
    const [stationData, setStationData] = useState<StationData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hierachies, setHierachies] = useState<ModelInfo[] | null>(null);
    
    const [selectedFloor, setSelectedFloor] = useState<string[]>(['0']);

    useEffect(() => {
        const fetchStation = async () => {
            // 로딩 상태 설정
            setIsLoading(true);
            
            try {
                // stationId가 없는 경우 기본값 사용 (선택 사항)
                const parsedStationId = stationId || '2';
                
                const response = await api.get<StationData>(`stations/${parsedStationId}`);
                setStationData(response.data);
            } catch (err) {
                console.error('Error fetching station data:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStation();
    }, [stationId]); // stationId가 변경될 때마다 데이터 다시 불러오기

    const modelPath: string = stationData?.facility?.drawing?.url || '';
    
    const handleModelLoaded = () => {
        setHierachies(Px.Model.GetModelHierarchy())
        handleFloorChange(selectedFloor[0]);
    };

    const handleFloorChange = (floorId: string) => {
        setSelectedFloor([floorId]);
        Px.Model.HideAll();
        Px.Model.Show(floorId);
    }

    // 로딩 중인 경우
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-pulse text-gray-500">역사 데이터 로딩 중...</div>
            </div>
        );
    }

    return (
        <>
            <aside className="bg-red-100 w-1/3 overflow-y-auto">
                <AssetList />
            </aside>
            <main className="w-full">
                <div className="flex absolute text-white pl-4 pt-2 items-center"> 
                  <h2 className="text-xl font-bold">
                      {stationData?.facility?.name}
                  </h2>
                  { hierachies && 
                        <Select 
                            className="text-sm text-gray-300 ml-2 w-96" 
                            selected={selectedFloor} 
                            onChange={values => handleFloorChange(values[0])}
                            >
                            <Select.Trigger />
                            <Select.Content>
                              {hierachies.map(floor => (
                                  <Select.Item key={floor.floorId} value={floor.floorId}>
                                      {floor.displayName}
                                  </Select.Item>
                              ))}
                            </Select.Content>
                        </Select>
                    }
                </div>
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