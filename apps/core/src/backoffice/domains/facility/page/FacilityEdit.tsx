import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit3 } from 'lucide-react';
import { Button, Card, CardHeader, CardTitle, CardContent } from '@plug/ui';
import { PageContainer } from '@/backoffice/common/view/layouts';
import { 
  FacilityService, 
  DomainKey, 
  domainUtils,
  DomainUpdateRequest,
  FacilityType,
  FacilityResponse,
  FloorResponse,
  StationInfoResponse,
  FileResponse
} from '@plug/common-services';
import { toast } from 'sonner';

import { FacilityInfoComponent, FloorsComponent, StationInfoComponent, BoundaryComponent } from '../components';
import { ThumbnailUploadComponent } from '@/backoffice/common/components/ThumbnailUploadComponent';
import { DrawingUploadComponent } from '@/backoffice/common/components/DrawingUploadComponent';
import { useFacilityData } from '../hooks/useFacilityData';

type FacilityData = {
  facility?: FacilityResponse;
  floors?: FloorResponse[];
  stationInfo?: StationInfoResponse;
  boundary?: string;
  boundaryFiles?: FileResponse[];
  thumbnailFile?: FileResponse;
};

const FacilityEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [facility, setFacility] = useState<FacilityData | null>(null);
  const [facilityType, setFacilityType] = useState<FacilityType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const { getAllFacilities, isLoading: isFacilitiesLoading } = useFacilityData();
  const facilityId = id ? parseInt(id, 10) : null;

  useEffect(() => {
    if (!facilityId) {
      navigate('/admin/facility');
      return;
    }

    const loadFacility = async () => {
      try {
        setIsLoading(true);
        
        // useFacilityData의 getAllFacilities에서 해당 ID의 시설을 찾기
        const targetFacility = getAllFacilities.find(f => f.id === facilityId);
        
        if (!targetFacility) {
          toast.error('시설을 찾을 수 없습니다.');
          navigate('/admin/facility');
          return;
        }

        // 찾은 시설의 타입으로 상세 정보 로드
        const response = await FacilityService.getById(targetFacility.facilityType, facilityId);
        if (response.data) {
          setFacilityType(targetFacility.facilityType);
          setFacility(response.data as FacilityData);
        } else {
          toast.error('시설을 찾을 수 없습니다.');
          navigate('/admin/facility');
        }
      } catch (error) {
        console.error('Failed to load facility:', error);
        toast.error('시설 정보를 불러오는 중 오류가 발생했습니다.');
        navigate('/admin/facility');
      } finally {
        setIsLoading(false);
      }
    };

    // getAllFacilities가 로드된 후에만 실행
    if (!isFacilitiesLoading && getAllFacilities.length > 0) {
      loadFacility();
    } else if (!isFacilitiesLoading && getAllFacilities.length === 0) {
      // 시설이 없는 경우
      toast.error('시설을 찾을 수 없습니다.');
      navigate('/admin/facility');
    }
  }, [facilityId, navigate, getAllFacilities, isFacilitiesLoading]);

  const handleUpdateComponent = async (componentData: Partial<DomainUpdateRequest<DomainKey>>) => {
    if (!facilityId || !facility || !facilityType) return;

    try {
      setIsUpdating(true);
      
      const updateData = {
        ...facility,
        ...componentData,
      } as DomainUpdateRequest<DomainKey>;

      await FacilityService.update(facilityType, facilityId, updateData);
      
      const response = await FacilityService.getById(facilityType, facilityId);
      setFacility(response.data as FacilityData);
      toast.success('수정되었습니다.');
    } catch (error) {
      console.error('Failed to update facility:', error);
      toast.error('수정에 실패했습니다.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleThumbnailUpload = async (file: FileResponse) => {
    if (!facilityId || !facility || !facilityType) return;

    try {
      setIsUpdating(true);
      
      // facility 정보만 업데이트
      const facilityUpdateData = {
        name: facility.facility!.name,
        code: facility.facility!.code,
        description: facility.facility!.description,
        thumbnailFileId: file.id,
        lon: facility.facility!.lon,
        lat: facility.facility!.lat,
        locationMeta: facility.facility!.locationMeta
      };

      await handleUpdateComponent({ facility: facilityUpdateData });
      toast.success('썸네일이 업데이트되었습니다.');
    } catch (error) {
      console.error('Failed to update thumbnail:', error);
      toast.error('썸네일 업데이트에 실패했습니다.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDrawingUpload = async (file: FileResponse) => {
    if (!facilityId || !facility || !facilityType) return;

    try {
      setIsUpdating(true);
      
      // TODO: drawing 파일 업데이트를 위한 별도 API 호출이 필요할 수 있습니다
      console.log('Drawing file uploaded:', file);
      
      // 현재는 데이터를 다시 로드하는 방식으로 처리
      const response = await FacilityService.getById(facilityType, facilityId);
      setFacility(response.data as FacilityData);
      toast.success('도면 파일이 업데이트되었습니다.');
    } catch (error) {
      console.error('Failed to update drawing:', error);
      toast.error('도면 파일 업데이트에 실패했습니다.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleGoBack = () => {
    navigate('/admin/facility');
  };

  if (isLoading || isFacilitiesLoading) {
    return (
      <PageContainer title="시설 편집">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">시설 정보를 불러오는 중...</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (!facility || !facilityType) {
    return (
      <PageContainer title="시설 편집">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-gray-600 mb-4">시설을 찾을 수 없습니다.</p>
            <Button onClick={handleGoBack}>
              목록으로 돌아가기
            </Button>
          </div>
        </div>
      </PageContainer>
    );
  }

  const domainConfig = domainUtils.getConfig(facilityType);

  return (
    <PageContainer title={`${facility.facility?.name || '시설'} 편집`}>
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleGoBack}
            className="text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft size={18} />
          </Button>
          <Edit3 size={20} className="text-blue-600" />
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-blue-800">
              시설 유형: {domainConfig.displayName}
            </span>
            <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">
              {facilityType}
            </span>
          </div>
        </div>

        {/* 시설 기본 정보 및 썸네일 섹션 */}
        {domainUtils.hasComponent(facilityType, 'facility') && facility.facility && (
          <Card>
            <CardHeader>
              <CardTitle>기본 정보</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 썸네일 */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-900">썸네일</h4>
                  <ThumbnailUploadComponent
                    currentFile={facility.facility.thumbnail}
                    onFileUpload={handleThumbnailUpload}
                    isLoading={isUpdating}
                  />
                </div>

                {/* 도면 파일 */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-900">도면 파일</h4>
                  <DrawingUploadComponent
                    currentFile={facility.facility.drawing}
                    onFileUpload={handleDrawingUpload}
                    isLoading={isUpdating}
                  />
                </div>

                {/* 기본 정보 */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-gray-900">시설 정보</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-600">시설명</span>
                      <p className="mt-1 text-sm text-gray-800">{facility.facility.name}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">시설 코드</span>
                      <p className="mt-1 text-sm text-gray-800">{facility.facility.code}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">설명</span>
                      <p className="mt-1 text-sm text-gray-800">{facility.facility.description || '-'}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">위치</span>
                      <p className="mt-1 text-sm text-gray-800">
                        {facility.facility.lon && facility.facility.lat 
                          ? `${facility.facility.lat.toFixed(6)}, ${facility.facility.lon.toFixed(6)}`
                          : '-'
                        }
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">등록일</span>
                      <p className="mt-1 text-sm text-gray-800">
                        {new Date(facility.facility.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">등록자</span>
                      <p className="mt-1 text-sm text-gray-800">{facility.facility.createdBy}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {domainUtils.hasComponent(facilityType, 'facility') && facility.facility && (
          <FacilityInfoComponent
            facility={facility.facility}
            onSave={(data) => handleUpdateComponent({ facility: data })}
            isLoading={isUpdating}
          />
        )}

        {domainUtils.hasComponent(facilityType, 'floors') && (
          <FloorsComponent
            floors={facility.floors || []}
            onSave={(data) => handleUpdateComponent(data)}
            isLoading={isUpdating}
          />
        )}

        {domainUtils.hasComponent(facilityType, 'stationInfo') && (
          <StationInfoComponent
            stationInfo={facility.stationInfo}
            onSave={(data) => handleUpdateComponent(data)}
            isLoading={isUpdating}
          />
        )}

        {domainUtils.hasComponent(facilityType, 'boundary') && (
          <BoundaryComponent
            boundary={facility.boundary}
            files={facility.facility?.drawing ? [facility.facility.drawing] : []}
            version={facility.facility?.drawing?.originalFileName || ''}
            description={facility.facility?.description || ''}
            onSave={(data) => handleUpdateComponent(data)}
            isLoading={isUpdating}
          />
        )}
      </div>
    </PageContainer>
  );
};

export default FacilityEdit;
