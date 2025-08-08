import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save } from 'lucide-react';
import { Button, Separator } from '@plug/ui';
import { PageContainer } from '@/backoffice/common/view/layouts';
import { 
  FacilityService, 
  domainUtils,
  FacilityType,
  FacilityResponse,
  facilityService,
  DOMAINS,
  FacilityHistoryResponse,
} from '@plug/common-services';
import { toast } from 'sonner';
import { FacilityForm, FloorsForm, StationInfoForm, BoundaryForm, DrawingFileHistory } from '../components/form-components';
import { FacilityCreateFormData } from '../types';

const editFacilitySchema = z.object({
  facilityType: z.string().min(1, '시설 유형을 선택해주세요'),
  facility: z.object({
    name: z.string().min(1, '시설명은 필수입니다'),
    code: z.string().min(1, '시설 코드는 필수입니다'),
    description: z.string().optional(),
    thumbnailFileId: z.number().optional(),
    lon: z.number().optional(),
    lat: z.number().optional(),
    locationMeta: z.string().optional(),
  }),
  floors: z.array(z.object({
    name: z.string().min(1, '층 이름은 필수입니다'),
    floorId: z.string().min(1, '층 ID는 필수입니다'),
  })).optional(),
  stationInfo: z.object({
    lineIds: z.array(z.number()).optional(),
    stationCodes: z.array(z.string()).optional(),
  }).optional(),
  boundary: z.string().optional(),
});

type EditFacilityFormData = FacilityCreateFormData;

type FacilityData = {
  facility?: FacilityResponse;
  floors?: Array<{name: string; floorId: string}>;
  stationInfo?: {lineIds?: number[]; stationCodes?: string[]};
  boundary?: string;
};

const FacilityEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [facility, setFacility] = useState<FacilityData | null>(null);
  const [facilityType, setFacilityType] = useState<FacilityType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [floorsReplaceFunction, setFloorsReplaceFunction] = useState<((floors: Array<{name: string; floorId: string}>) => void) | null>(null);
  const [drawingHistory, setDrawingHistory] = useState<FacilityHistoryResponse[]>([]);

  const facilityId = id ? parseInt(id, 10) : null;

  const loadDrawingHistory = useCallback(async () => {
    if (!facilityId) return;
    
    try {
      const historyResponse = await facilityService.getFacilityHistory(facilityId);
      setDrawingHistory(historyResponse.data);
    } catch (error) {
      console.error('Failed to load drawing history:', error);
    }
  }, [facilityId]);

  const handleHistoryUpdate = () => {
    loadDrawingHistory();
  };

  const handleFloorsExtracted = (floors: Array<{name: string; floorId: string}>) => {
    // 층 정보가 변경되었을 때 폼의 floors 필드도 업데이트
    if (floorsReplaceFunction) {
      floorsReplaceFunction(floors);
    } else {
      setValue('floors', floors);
    }
  };

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<EditFacilityFormData>({
    resolver: zodResolver(editFacilitySchema),
    defaultValues: {
      facilityType: '',
      facility: {
        name: '',
        code: '',
        description: '',
      },
      floors: [],
      stationInfo: {
        lineIds: [],
        stationCodes: [],
      },
    },
  });

  useEffect(() => {
    if (!facilityId) {
      navigate('/admin/facility');
      return;
    }

    const loadFacility = async () => {
      try {
        setIsLoading(true);
        
        // 전체 시설 목록을 가져와서 해당 ID의 시설 유형을 찾기
        const facilitiesResponse = await facilityService.getAllFacilities();
        const facilitiesByType = facilitiesResponse.data;
        
        // useFacilityData hook과 동일한 로직으로 시설을 찾기
        const mapApiKeyToFacilityType = (apiKey: string): FacilityType => {
          const domainEntry = Object.entries(DOMAINS).find(([, config]) => config.endpoint === apiKey);
          return domainEntry ? domainEntry[0] as FacilityType : 'building';
        };

        const allFacilities = Object.entries(facilitiesByType || {}).flatMap(([type, facilities]) =>
          facilities.map(facility => ({
            ...facility,
            facilityType: mapApiKeyToFacilityType(type)
          }))
        );
        
        const targetFacility = allFacilities.find(f => f.id === facilityId);
        
        if (!targetFacility) {
          toast.error('시설을 찾을 수 없습니다.');
          navigate('/admin/facility');
          return;
        }

        // 해당 시설의 상세 정보를 가져옴
        const response = await FacilityService.getById(targetFacility.facilityType, facilityId);
        if (response.data) {
          const facilityData = response.data as FacilityData;
          setFacilityType(targetFacility.facilityType);
          setFacility(facilityData);

          const formData = {
            facilityType: targetFacility.facilityType,
            facility: {
              name: facilityData.facility?.name || '',
              code: facilityData.facility?.code || '',
              description: facilityData.facility?.description || '',
              thumbnailFileId: facilityData.facility?.thumbnail?.id,
              lon: facilityData.facility?.lon,
              lat: facilityData.facility?.lat,
              locationMeta: facilityData.facility?.locationMeta || '',
            },
            floors: facilityData.floors || [],
            stationInfo: {
              lineIds: facilityData.stationInfo?.lineIds || [],
              stationCodes: facilityData.stationInfo?.stationCodes || [],
            },
            boundary: facilityData.boundary || '',
          };
          
          reset(formData);
          
          // 도면 파일 이력 로드
          await loadDrawingHistory();
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

    loadFacility();
  }, [facilityId, navigate, reset, loadDrawingHistory]);

  const handleFloorsReplaceReady = (replaceFunction: (floors: Array<{name: string; floorId: string}>) => void) => {
    setFloorsReplaceFunction(() => replaceFunction);
  };

  const onSubmit = async (data: EditFacilityFormData) => {
    if (!facilityId || !facilityType) return;

    setIsUpdating(true);
    try {
      const domainConfig = domainUtils.getConfig(facilityType);
      const updateRequest: Record<string, unknown> = {};

      const facilityData = {
        ...data.facility,
        thumbnailFileId: data.facility.thumbnailFileId !== undefined 
          ? data.facility.thumbnailFileId 
          : facility?.facility?.thumbnail?.id || null,
      };

      updateRequest.facility = facilityData;

      domainConfig.components.forEach((component) => {
        switch (component) {
          case 'floors':
            if (data.floors && data.floors.length > 0) {
              updateRequest.floors = data.floors.filter(
                floor => floor.name.trim() !== '' && floor.floorId.trim() !== ''
              );
            } else {
              updateRequest.floors = [];
            }
            break;
          case 'stationInfo':
            if (data.stationInfo) {
              const stationInfoData = {
                lineIds: data.stationInfo.lineIds || [],
                stationCodes: data.stationInfo.stationCodes?.filter(code => code.trim() !== '') || [],
              };
              updateRequest.stationInfo = stationInfoData;
            } else {
              updateRequest.stationInfo = {
                lineIds: [],
                stationCodes: [],
              };
            }
            break;
          case 'boundary':
            if (data.boundary && data.boundary.trim() !== '') {
              updateRequest.boundary = data.boundary;
            } else {
              updateRequest.boundary = '';
            }
            break;
        }
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await FacilityService.update(facilityType, facilityId, updateRequest as any);
      
      const config = domainUtils.getConfig(facilityType);
      toast.success(`${config.displayName}이(가) 성공적으로 수정되었습니다.`);
      
    } catch (error) {
      console.error('Failed to update facility:', error);
      toast.error('시설 수정에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleGoBack = () => {
    navigate('/admin/facility');
  };

  const renderDynamicComponents = () => {
    if (!facilityType) return null;

    const domainConfig = domainUtils.getConfig(facilityType);
    const components: React.ReactElement[] = [];

    domainConfig.components.forEach((component) => {
      if (component === 'facility') return;

      components.push(
        <div key={component}>
          <Separator className="my-6" />
          {renderComponentForm(component)}
        </div>
      );
    });

    return components;
  };

  const renderComponentForm = (component: string) => {
    switch (component) {
      case 'floors':
        return (
          <FloorsForm
            control={control}
            register={register}
            errors={errors}
            onFloorsReplaceReady={handleFloorsReplaceReady}
            isProcessingDrawing={false}
          />
        );
      case 'stationInfo':
        return (
          <StationInfoForm
            register={register}
            errors={errors}
            control={control}
            setValue={setValue}
            watch={watch}
          />
        );
      case 'boundary':
        return (
          <BoundaryForm
            register={register}
            errors={errors}
          />
        );
      default:
        return null;
    }
  };

  if (isLoading) {
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
        </div>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

        <FacilityForm
          register={register}
          errors={errors}
          control={control}
          setValue={setValue}
          watch={watch}
          currentThumbnailFile={facility.facility?.thumbnail}
          isEditMode={true}
        />

        <DrawingFileHistory
          facilityId={facilityId!}
          history={drawingHistory}
          onHistoryUpdate={handleHistoryUpdate}
          onFloorsExtracted={handleFloorsExtracted}
        />

        {renderDynamicComponents()}

        <div className="flex items-center justify-end gap-3 pt-6 mt-8 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={handleGoBack}
          >
            목록으로
          </Button>
          <Button
            type="submit"
            disabled={isUpdating}
            className="flex items-center gap-2"
          >
            <Save size={16} />
            {isUpdating ? '저장 중...' : '저장'}
          </Button>
        </div>
      </form>
    </PageContainer>
  );
};

export default FacilityEdit;
