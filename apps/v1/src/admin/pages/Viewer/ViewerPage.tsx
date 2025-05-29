import { api } from "@plug/api-hooks";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { StationData } from "./types";

import { AssetList, MapViewer } from "./components";
import * as Px from '@plug/engine/src';
import { Select } from "@plug/ui";
import { useStationStore } from './store/stationStore'; 

interface ModelInfo {
    objectName: string;
    displayName: string;
    sortingOrder: number;
    floorId: string;
}

const Viewer = () => {
    const { stationId: stationIdFromParams } = useParams<{ stationId: string }>();
    const { currentStationId, setStationId } = useStationStore(); 

    const [stationData, setStationData] = useState<StationData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hierachies, setHierachies] = useState<ModelInfo[] | null>(null);
    const [selectedFloor, setSelectedFloor] = useState<string[]>(['0']);

    useEffect(() => {
        const idToSet = stationIdFromParams || '2'; 
        setStationId(idToSet);
    }, [stationIdFromParams, setStationId]);

    useEffect(() => {
        const fetchStation = async () => {
            if (!currentStationId) {
                setIsLoading(false);
                setStationData(null);
                return;
            }
            
            setIsLoading(true);
            try {
                const response = await api.get<StationData>(`stations/${currentStationId}`);
                setStationData(response.data);
            } catch (err) {
                console.error('Error fetching station data:', err);
                setStationData(null);
            } finally {
                setIsLoading(false);
            }
        };

        if (currentStationId) {
            fetchStation();
        } else {
            setIsLoading(false);
            setStationData(null);
        }
    }, [currentStationId]); 

    const modelPath: string = stationData?.facility?.drawing?.url || '';
    
    const handleModelLoaded = () => {
        const modelHierarchy = Px.Model.GetModelHierarchy();
        if (modelHierarchy) { 
            setHierachies(modelHierarchy as ModelInfo[]);
        } else {
            setHierachies(null);
        }
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

    // currentStationId가 없고 로딩 중도 아닐 때 (예: 초기화 실패 또는 ID 없음)
    if (!currentStationId && !isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-gray-500">Station ID를 찾을 수 없습니다.</div>
            </div>
        );
    }

    return (
        <>
            <aside className="bg-white w-1/3 overflow-y-auto">
                <AssetList /> {/* AssetList에서 useStationStore를 통해 currentStationId 접근 가능 */}
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
                              {hierachies.sort((a, b) => Number(b.floorId) - Number(a.floorId)).map(floor => (
                                  <Select.Item key={floor.floorId} value={floor.floorId}>
                                      {floor.displayName}
                                  </Select.Item>
                              ))}
                            </Select.Content>
                        </Select>
                    }
                </div>
                {stationData && currentStationId && ( // currentStationId도 확인하여 렌더링
                    <MapViewer 
                        modelPath={modelPath}
                        onModelLoaded={handleModelLoaded}
                    />
                )}
            </main>
        </>
    );
};

export default Viewer;