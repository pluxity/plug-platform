import { api } from "@plug/api-hooks";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import type { StationWithFeatures, FeatureResponse } from "./types";

import { AssetList, MapViewer } from "./components";
import * as Px from '@plug/engine/src';
import { Select } from "@plug/ui";
import { useStationStore } from './store/stationStore'; 
import { useAssetStore } from './store/assetStore';

interface ModelInfo {
    objectName: string;
    displayName: string;
    sortingOrder: number;
    floorId: string;
}

const Viewer = () => {
    const { stationId: stationIdFromParams } = useParams<{ stationId: string }>();
    const { currentStationId, setStationId } = useStationStore(); 

    const [stationData, setStationData] = useState<StationWithFeatures | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hierachies, setHierachies] = useState<ModelInfo[] | null>(null);
    const [selectedFloor, setSelectedFloor] = useState<string | null>(null);

    useEffect(() => {
        const idToSet = stationIdFromParams || '2'; 
        setStationId(idToSet);
    }, [stationIdFromParams, setStationId]);

    useEffect(() => {
        const fetchStation = async () => {
            if (!currentStationId) {
                setIsLoading(false);
                return;
            }
            
            setIsLoading(true);
            try {
                const response = await api.get<StationWithFeatures>(`stations/${currentStationId}/with-features`);
                setStationData(response.data);
            } catch (err) {
                console.error('Error fetching station data:', err);
            } finally {
                setIsLoading(false);
            }
        };

        if (currentStationId) {
            fetchStation();
        } else {
            setIsLoading(false);
        }

    }, [currentStationId]); 

    const modelPath: string = stationData?.facility?.drawing?.url || '';

    const handleFloorChange = useCallback((floorId: string) => {
        setSelectedFloor(floorId);
        Px.Model.HideAll();
        Px.Model.Show(floorId);
    }, []);

    const handleFeatureData = useCallback(() => {
        // 스토어에서 최신 assets 값을 직접 가져오기
        const currentAssets = useAssetStore.getState().assets;
        
        if (stationData?.features && currentAssets.length > 0) {
            const poiData = stationData.features.map((feature: FeatureResponse) => {
                const modelUrl = currentAssets.find(asset => asset.id === feature.assetId)?.file?.url || '';
                return {
                    id: feature.id, 
                    iconUrl: '', 
                    modelUrl: modelUrl,
                    displayText: feature.deviceCode || '배치 안됨',
                    floorId: feature.floorId,
                    property: {
                        code: feature.deviceCode || '',
                    },
                    position: feature.position,
                    rotation: feature.rotation,
                    scale: feature.scale
                };
            });

            Px.Poi.Import(JSON.stringify(poiData));

            // Px.Event.AddEventListener('onPoiPointerUp', (event: any) => {
            //     console.log(event);
            // });
        }
    }, [stationData]);

    const handleModelLoaded = useCallback(async () => {
        const modelHierarchy = Px.Model.GetModelHierarchy();
        console.log(':', modelHierarchy);
        if (modelHierarchy) { 
            setHierachies(modelHierarchy as ModelInfo[]);
        } else {
            setHierachies(null);
        }

        handleFeatureData();
        handleFloorChange("0");

    }, [setHierachies, handleFeatureData, handleFloorChange]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-pulse text-gray-500">역사 데이터 로딩 중...</div>
            </div>
        );
    }

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
                            selected={selectedFloor ? [selectedFloor] : []}
                            onChange={values => handleFloorChange(values[0])}
                            >
                            <Select.Trigger/>
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