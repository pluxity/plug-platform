import React, { useEffect, useState, useCallback } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { PageContainer } from '@/backoffice/common/view/layouts'
import { FacilityService, FacilityType, deleteFeature, FeatureResponse } from '@plug/common-services'
import { IndoorMapViewer } from '@/global/components'
import { FloorControl } from '@/global/components/indoor-map/FloorControl'
import { Button, Dialog, DialogContent, DialogDescription, DialogFooter } from "@plug/ui"
import { ArrowLeft } from "lucide-react"
import { IndoorMapEditTools } from '../components'
import { useAssets } from '@/global/store/assetStore'
import { api } from '@plug/api-hooks/core'
import { Poi, Event } from '@plug/engine'
import { convertFloors } from '@/global/utils/floorUtils'
import type { Floor } from '@/global/types'
import { toast } from "sonner"

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

export interface PoiData {
  id: string;
  displayText: string;
  iconUrl: string;
  modelUrl: string;
  property?: {
    assetId: number;
    assetCode: string;
    assetName: string;
    categoryId: number;
    categoryName?: string;
    deviceId?: string;
  };
  floorId: string;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
}

type PoiClickEvent = {
  target: PoiData
}

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

  // 삭제 모드 상태 추가
  const [isDeleteMode, setIsDeleteMode] = useState(false)
  const [selectedFeature, setSelectedFeature] = useState<PoiData | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  // 삭제 모드 변경 핸들러
  const handleDeleteModeChange = (deleteMode: boolean) => {
    setIsDeleteMode(deleteMode);
  }

  // POI 삭제 처리
  const handleFeatureDelete = async (featureId: string) => {
    try {
      Poi.Delete(featureId);
      await deleteFeature(featureId);

      setIsDeleteMode(false)
      setShowDeleteDialog(false)
      setSelectedFeature(null);
      
      toast.success('POI가 성공적으로 삭제되었습니다.')
    } catch (error) {
      console.error('POI 삭제 중 오류:', error)
      toast.error('POI 삭제 중 오류가 발생했습니다.')
    }
  }

  // 삭제 취소 처리
  const handleDeleteCancel = () => {
    setShowDeleteDialog(false)
    setSelectedFeature(null)
  }

  // POI 클릭 이벤트 리스너 등록
  useEffect(() => {
    const handleFeatureClick = (eventData: PoiClickEvent) => {
      const poiData = eventData.target;
      if (isDeleteMode) {
        // 삭제 모드일 때는 기존 삭제 로직
        setSelectedFeature(poiData);
        setShowDeleteDialog(true);
      }
    };

    Event.AddEventListener('onPoiPointerUp' as never, handleFeatureClick);
    // Event.AddEventListener('onEditFinish' as never, (evt: any) => {
    // 수정된 Feature 정보
    // PromiseAll
    //   console.log('onPoiTransformChange', evt);
    // });
    
    return () => {
      Event.RemoveEventListener('onPoiPointerUp' as never, handleFeatureClick);
    };
  }, [isDeleteMode]);

  // Features 로드를 위한 함수
  const loadFeaturesByFacility = useCallback(async (facilityId: number): Promise<FeatureResponse[]> => {
    try {
      const response = await api.get<FeatureResponse[]>(`features?facilityId=${facilityId}`, { requireAuth: true });
      return response.data || [];
    } catch (error) {
      console.error('Failed to load features:', error);
      return [];
    }
  }, []);

  // 엔진이 준비되면 POI 생성
  const handleLoadComplete = useCallback(() => {
    if (!featuresData || featuresData.length === 0 || !assets || assets.length === 0) {
      return;
    }
  }, [featuresData, assets]);

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
            <div className="h-168 relative">
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
            선택된 POI를 삭제하겠습니까? <br/>
            id: {selectedFeature.id} <br/>
            name: {selectedFeature.displayText}
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
    </PageContainer>
  )
}

export default FacilityIndoor
