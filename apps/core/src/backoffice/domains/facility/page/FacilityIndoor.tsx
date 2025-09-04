import { toast } from "sonner"

import { Poi, Interfaces, Camera } from '@plug/engine'

import { PageContainer } from '@/backoffice/common/view/layouts'

import { usePoiEvents, PoiData } from '../hooks/usePoiEvents'

import { ArrowLeft } from "lucide-react"
import React, { useEffect, useState, useCallback, useRef } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"

import { FacilityService, FacilityType, deleteFeature, FeatureResponse, getFeaturesByFacility, updateFeatureTransform } from '@plug/common-services'
import { Button, Dialog, DialogContent, DialogDescription, DialogFooter } from "@plug/ui"

import { IndoorMapViewer, FloorControl } from '@/global/components'
import { useAssets } from '@/global/store'
import type { Floor } from '@/global/types'
import { convertFloors, poiUnassignedText, poiAssignedText } from '@/global/utils'

import { IndoorMapEditTools, FeatureAssignModal } from '../components'
import { useCctvData, useDeviceData } from '../hooks'
type FacilityData = {
  facility?: {
    id: number
    name: string
    code: string
    description?: string
    drawing?: {
      url: string
    }
  }
  floors?: Array<{name: string; floorId: string}>
  stationInfo?: {lineIds?: number[]; stationCodes?: string[]}
  boundary?: string
}

// 이벤트 타입은 usePoiEvents 훅 내부 정의 사용


// 클릭 이벤트 타입도 훅 내부 정의 사용

const FacilityIndoor: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  
  // Router state에서 데이터 추출
  const facilityTypeFromState = location.state?.facilityType as FacilityType | null
  
  const facilityId = id ? parseInt(id, 10) : null
  const [facilityData, setFacilityData] = useState<FacilityData | null>(null)
  const [facilityType, setFacilityType] = useState<FacilityType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [has3DDrawing, setHas3DDrawing] = useState<boolean | null>(null)
  const [floors, setFloors] = useState<Floor[]>([])
  const [featuresData, setFeaturesData] = useState<FeatureResponse[]>([])
  
  const { assets } = useAssets()

  // POI 임포트 상태 
  const importedRef = useRef(false);
  const engineReadyRef = useRef(false);

  // 삭제 모드 상태 
  const [isDeleteMode, setIsDeleteMode] = useState(false)
  const [selectedFeature, setSelectedFeature] = useState<PoiData | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  
  // 장비 할당 모달 상태 
  const [showFeatureAssignDialog, setShowFeatureAssignDialog] = useState(false)

  // 삭제 모드 변경 핸들러
  const handleDeleteModeChange = (deleteMode: boolean) => {
    setIsDeleteMode(deleteMode);
  }

  // POI 삭제 처리
  const handleFeatureDelete = async (featureId: string) => {
    try {
      Poi.Delete(featureId);
      await deleteFeature(featureId);

      setShowDeleteDialog(false);
      setSelectedFeature(null);
      
      toast.success('POI가 성공적으로 삭제되었습니다.');
    } catch (error) {
      console.error('POI 삭제 중 오류:', error);
      toast.error('POI 삭제 중 오류가 발생했습니다.');
    }
  };

  // 삭제 취소 처리
  const handleDeleteCancel = () => {
    setShowDeleteDialog(false)
    setSelectedFeature(null)
  }

  // POI 이벤트 콜백 (삭제 모드 / 할당 모드 구분)
  const handlePointerDelete = useCallback((poi: PoiData) => {
    setSelectedFeature(poi);
    setShowDeleteDialog(true);
  }, []);

  const handlePointerAssign = useCallback((poi: PoiData) => {
    setSelectedFeature(poi);
    setShowFeatureAssignDialog(true);
  }, []);

  const handleTransformFinished = useCallback(async (targets: PoiData[]) => {
    try {
      await Promise.all(
        targets.map((poi: PoiData) => updateFeatureTransform(poi.id, {
          position: poi.position,
          rotation: poi.rotation,
          scale: poi.scale
        }))
      );
      toast.success('POI 편집이 완료되었습니다.');
    } catch (error) {
      console.error('POI 정보 업데이트 중 오류:', error);
    }
  }, []);

  // 공통 엔진 이벤트 등록 훅
  usePoiEvents({
    isDeleteMode,
    onPointerDelete: handlePointerDelete,
    onPointerAssign: handlePointerAssign,
    onTransformFinished: handleTransformFinished,
  });
 

  // Features 로드를 위한 함수
  const loadFeaturesByFacility = useCallback(async (facilityId: number): Promise<FeatureResponse[]> => {
    try {
      const features = await getFeaturesByFacility(facilityId)  
      return features || [];
    } catch (error) {
      console.error('Failed to load features:', error);
      return [];
    }
  }, []);

  const { getAllCctvs, refetch: mutateCctvs } = useCctvData(); 
  const { getAllDevices, refetch: mutateDevices } = useDeviceData();

  const getPoiDisplayText = useCallback((featureId: string) => {
    if(!featureId) return "장치 할당 필요";

    const cctv = getAllCctvs.find(cctv => cctv.feature?.id === featureId);
    const device = getAllDevices.find(device => device.feature?.id === featureId);

    return cctv?.name || device?.name || "장치 할당 필요";
  }, [getAllCctvs, getAllDevices]);

  const handleFeatureSuccess = useCallback(async (featureId: string, device: { id: string, type: string, name: string }) => {
    
    const previousFeatureId = (device.type === 'CCTV' ? getAllCctvs : getAllDevices)
      .find(item => item.id === device.id)?.feature?.id;

    if(previousFeatureId && previousFeatureId !== featureId){
      Poi.SetTextInnerHtml(previousFeatureId, poiUnassignedText("장치 할당 필요"));
    }
 
    try{
      Poi.SetTextInnerHtml(featureId, poiAssignedText(device.name));

      if(device.type === "CCTV"){
        await mutateCctvs();
      } else {
        await mutateDevices();
      }

    } catch(error){
      console.error("장비 할당 중 오류가 발생했습니다.", error);
    }
  }, [getAllCctvs, getAllDevices, mutateCctvs, mutateDevices]);

  // POI Import 함수 수정
  const tryImportPois = useCallback(() => {
    if (importedRef.current) return;
    if (!engineReadyRef.current) return;
    if (!featuresData || featuresData.length === 0 || !assets || assets.length === 0) return;

    const assetById = new Map(assets.map(a => [a.id, a]));

    const poiData: Interfaces.PoiImportOption[] = featuresData.map((f) => {
      const asset = assetById.get(f.assetId);
      const modelUrl = asset?.file?.url || '';

      const position: Interfaces.Vector3 = {
        x: f.position?.x ?? 0,
        y: f.position?.y ?? 0,
        z: f.position?.z ?? 0,
      };
      const rotation: Interfaces.Vector3 = {
        x: f.rotation?.x ?? 0,
        y: f.rotation?.y ?? 0,
        z: f.rotation?.z ?? 0,
      };
      const scale: Interfaces.Vector3 = {
        x: f.scale?.x ?? 1,
        y: f.scale?.y ?? 1,
        z: f.scale?.z ?? 1,
      };

      const deviceText = getPoiDisplayText(f.id);
      const isAssigned = deviceText !== "장치 할당 필요";
      const htmlString = isAssigned ? poiAssignedText(deviceText) : poiUnassignedText(deviceText);

      return {
        id: f.id,
        iconUrl: '',
        modelUrl,
        htmlString, 
        floorId: f.floorId,
        property: {
          assetId: f.assetId,
        },
        position,
        rotation,
        scale,
      };
    });

    try {
      Poi.Import(poiData);
      importedRef.current = true;
    } catch {
      void 0;
    }
  }, [featuresData, assets, getPoiDisplayText]); 

  const handleLoadComplete = useCallback(() => {
    engineReadyRef.current = true;
    Camera.ExtendView(1);
    console.log('Load Complete');
    tryImportPois();
  }, [tryImportPois]);

  useEffect(() => {
    tryImportPois();
  }, [tryImportPois]);

  useEffect(() => {
    importedRef.current = false;
  }, [facilityId]);

  useEffect(() => {
    if (!facilityId) {
      navigate('/admin/facility')
      return
    }

    const loadFacility = async () => {
      try {
        setIsLoading(true)
        if (facilityTypeFromState) {
          const response = await FacilityService.getById(facilityTypeFromState, facilityId)
          if (response.data) {
            setFacilityType(facilityTypeFromState)
            setFacilityData(response.data)

            const hasDrawing = response.data.facility?.drawing?.url ? true : false
            setHas3DDrawing(hasDrawing)
            
            // 층 정보 변환
            if (response.data && 'floors' in response.data && response.data.floors) {
              const convertedFloors = convertFloors(response.data.floors);
              setFloors(convertedFloors);
            }
            
            return
          }
        }
        
        navigate('/admin/facility')
        
      } catch (error) {
        console.error('Failed to load facility:', error)
        navigate('/admin/facility')
      } finally {
        setIsLoading(false)
      }
    }

    loadFacility()
  }, [facilityId, facilityTypeFromState, navigate])

  // Features 로드
  useEffect(() => {
    const loadFeatures = async () => {
      if (!facilityId) return;
      
      try {
        const features = await loadFeaturesByFacility(facilityId);
        setFeaturesData(features);
      } catch (error) {
        console.error('Failed to load features for facility:', facilityId, error);
        setFeaturesData([]);
      }
    };

    loadFeatures();
  }, [facilityId, loadFeaturesByFacility]);

  if (isLoading) {
    return (
      <PageContainer title="실내지도 편집">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">시설 정보를 불러오는 중...</p>
          </div>
        </div>
      </PageContainer>
    )
  }

  const handleGoBack = () => {
    navigate('/admin/facility')
  }

  return (
    <PageContainer title={`실내지도 편집 - ${facilityData?.facility?.name || id}`}>
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleGoBack}
            className="text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft size={18} />
            목록으로
          </Button>
        </div>        
        <div className="bg-white flex-1 border rounded-lg overflow-hidden">          
          {has3DDrawing === null && (
            <div className="h-full flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">3D 도면을 확인하는 중...</p>
              </div>
            </div>
          )}
          
          {/* 3D 도면이 없는 경우 */}
          {has3DDrawing === false && (
            <div className="h-full flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <div className="mb-6">
                  <svg 
                    className="w-16 h-16 mx-auto mb-4 text-yellow-500" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 18.5c-.77.833.192 2.5 1.732 2.5z" 
                    />
                  </svg>
                  <h3 className="text-xl font-bold mb-2 text-gray-700">3D 도면이 없습니다</h3>
                  <p className="text-gray-600 mb-6">
                    실내지도를 편집하려면 먼저 3D 도면을 업로드해주세요.
                  </p>
                  <Button
                    onClick={() => navigate(`/admin/facility/edit/${facilityId}`, {
                      state: { facilityType }
                    })}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    시설 편집에서 도면 업로드하기
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {has3DDrawing === true && facilityType && (
            <div className="h-180 relative">
              <IndoorMapViewer 
                modelUrl={facilityData?.facility?.drawing?.url || ''}
                className="w-full h-full"
                onLoadComplete={handleLoadComplete}
              />
         
              {/* Floor Control - 우측 하단 */}
              {floors.length > 0 && (
                <div className="absolute bottom-6 right-6 z-20 max-w-xs">
                  <FloorControl floors={floors} />
                </div>
              )}
              
              {/* POI 편집 툴 - 우측 상단 */}
              <div className="absolute top-4 right-4 z-30">
                <IndoorMapEditTools onDeleteMode={handleDeleteModeChange} />
              </div>
            </div>
          )}
        </div>
      </div>

      {showDeleteDialog && selectedFeature && (
        <Dialog open={showDeleteDialog} onOpenChange={handleDeleteCancel}>
          <DialogContent title="삭제 확인">
            <DialogDescription>
              선택된 POI "{getPoiDisplayText(selectedFeature.id)}"를 삭제하겠습니까? <br/>
              (ID: {selectedFeature.id})
            </DialogDescription>
            <DialogFooter>
              <Button variant="outline" onClick={handleDeleteCancel}>
                취소
              </Button>
              <Button onClick={() => handleFeatureDelete(selectedFeature.id)}>
                삭제
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {!isDeleteMode && showFeatureAssignDialog && (
        <FeatureAssignModal
          open={showFeatureAssignDialog}
          onOpenChange={setShowFeatureAssignDialog}
          featureId={selectedFeature?.id}
          onSuccess={handleFeatureSuccess}
        />
      )}
    </PageContainer>
  )
}

export default FacilityIndoor
