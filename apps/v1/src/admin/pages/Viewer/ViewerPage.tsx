import { api } from "@plug/api-hooks";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import type { StationWithFeatures, FeatureResponse } from "./types";

import { AssetList, MapViewer } from "./components";
import * as Px from '@plug/engine/src';
import { Select } from "@plug/ui";
import { useStationStore } from './store/stationStore'; 
import { useAssetStore } from './store/assetStore';

import { Button, Modal, Form, FormItem, Input } from "@plug/ui";

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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPoiData, setSelectedPoiData] = useState<{
        id: string;        
        displayText: string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        property: any;
    } | null>(null);

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
    }, []);    const handleFeatureData = useCallback(() => {
        // 스토어에서 최신 assets 값을 직접 가져오기
        const currentAssets = useAssetStore.getState().assets;
        
        if (stationData?.features && currentAssets.length > 0) {
            const poiData = stationData.features.map((feature: FeatureResponse) => {
                const modelUrl = currentAssets.find(asset => asset.id === feature.assetId)?.file?.url || '';
                return {
                    id: feature.id, 
                    iconUrl: '', 
                    modelUrl: modelUrl,
                    displayText: feature.deviceCode || 'Device 할당 필요',
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

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        setSelectedPoiData(null);
    }, []);

    const handleModelLoaded = useCallback(async () => {
        const modelHierarchy = Px.Model.GetModelHierarchy();
        if (modelHierarchy) { 
            setHierachies(modelHierarchy as ModelInfo[]);
        } else {
            setHierachies(null);
        }

        handleFeatureData();
        handleFloorChange("0");        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Px.Event.AddEventListener("onPoiPointerUp", (event: any) => {
            const poiData = event.target;
            
            if (poiData) {
                setSelectedPoiData({
                    id: poiData.id,
                    displayText: poiData.displayText || 'Feature',
                    property: {
                        code: poiData.property?.code || '정보 없음',
                    }
                });
                setIsModalOpen(true);
            }

            console.log('POI Pointer Up Event:', poiData);
        });

    }, [setHierachies, handleFeatureData, handleFloorChange]);

    const handleSubmit = useCallback(async (values: Record<string, string>) => {
        if (selectedPoiData) {
            const code = values.code || selectedPoiData.property.code;
            const featureId = selectedPoiData.id;

            try {
                await api.put(`features/${featureId}/assign-device`,{ "code": code });
                alert('디바이스 정보가 성공적으로 업데이트되었습니다.');
            } catch (error) {
                console.error('Error updating POI data:', error);
                alert('디바이스 정보 업데이트에 실패했습니다.');
            } finally {
                handleCloseModal();
            }
        }
    }, [selectedPoiData, handleCloseModal]);

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
    }    return (
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
            </main>            {/* POI 정보 모달 */}
            
            {selectedPoiData && (
                <Modal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    title={`${selectedPoiData?.displayText} 디바이스 코드 할당`}
                >
                    <Form
                        onSubmit={handleSubmit}
                        >                            
                        <FormItem 
                            name="code" label="디바이스 코드" required>
                            <Input.Text
                                placeholder="디바이스 코드를 입력하세요"
                                value={selectedPoiData.property.code}
                                onChange={value => { console.log(value); }}
                            />
                        </FormItem>
                        <Button 
                            type="submit" 
                            color="primary" 
                        >
                            적용
                        </Button>
                    </Form>
                </Modal>
            )}
        </>
    );
};

export default Viewer;