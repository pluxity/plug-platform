import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Separator,
} from '@plug/ui';
import {
  FacilityType,
  domainUtils,
  FacilityService,
} from '@plug/common-services';
import { FacilityForm, FloorsForm, StationInfoForm, BoundaryForm } from './form-components';
import { FacilityCreateFormData } from '../types';
import { Model, Interfaces } from '@plug/engine';

const createFacilitySchema = z.object({
  facilityType: z.string().min(1, '시설 유형을 선택해주세요'),
  facility: z.object({
    name: z.string().min(1, '시설명은 필수입니다'),
    code: z.string().min(1, '시설 코드는 필수입니다'),
    description: z.string().optional(),
    drawingFileId: z.number().optional(),
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

type CreateFacilityFormData = FacilityCreateFormData;

interface CreateFacilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateFacilityModal: React.FC<CreateFacilityModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFacilityType, setSelectedFacilityType] = useState<FacilityType | ''>('');
  const [floorsReplaceFunction, setFloorsReplaceFunction] = useState<((floors: Array<{name: string; floorId: string}>) => void) | null>(null);
  const [isProcessingDrawing, setIsProcessingDrawing] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateFacilityFormData>({
    resolver: zodResolver(createFacilitySchema),
    defaultValues: {
      facilityType: '',
      facility: {
        name: '',
        code: '',
        description: '',
  drawingFileId: undefined,
      },
      floors: [],
      stationInfo: {
        lineIds: [],
        stationCodes: [],
      },
    },
  });

  const watchedFacilityType = watch('facilityType');

  useEffect(() => {
    if (watchedFacilityType && watchedFacilityType !== selectedFacilityType) {
      setSelectedFacilityType(watchedFacilityType as FacilityType);
    }
  }, [watchedFacilityType, selectedFacilityType]);

  const handleClose = () => {
    reset();
    setSelectedFacilityType('');
    onClose();
  };

  const handleFloorsReplaceReady = (replaceFunction: (floors: Array<{name: string; floorId: string}>) => void) => {
    setFloorsReplaceFunction(() => replaceFunction);
  };

  const handleDrawingFileUploaded = (fileUrl: string) => {
    setIsProcessingDrawing(true);
    
    try {
      Model.GetModelHierarchyFromUrl(fileUrl, (modelInfo: Interfaces.ModelInfo[]) => {
        const floors = modelInfo
          .sort((a, b) => b.sortingOrder - a.sortingOrder)
          .map(info => ({
            name: info.displayName || info.objectName,
            floorId: info.floorId
          }));
        
        if (floors.length > 0) {
          if (floorsReplaceFunction) {
            floorsReplaceFunction(floors);
          } else {
            setValue('floors', floors);
          }
        } else {
          if (floorsReplaceFunction) {
            floorsReplaceFunction([]);
          } else {
            setValue('floors', []);
          }
        }
        
        setIsProcessingDrawing(false);
      });
    } catch (error) {
      console.error('Error processing drawing file with engine:', error);
      
      if (floorsReplaceFunction) {
        floorsReplaceFunction([]);
      } else {
        setValue('floors', []);
      }
      
      setIsProcessingDrawing(false);
    }
  };

  const onSubmit = async (data: CreateFacilityFormData) => {
    if (!selectedFacilityType) return;

    setIsLoading(true);
    try {
      const domainConfig = domainUtils.getConfig(selectedFacilityType);
      const createRequest: Record<string, unknown> = {};

      // 도면 파일 ID 포함 (선택적)
      createRequest.facility = {
        name: data.facility.name,
        code: data.facility.code,
        description: data.facility.description,
        thumbnailFileId: data.facility.thumbnailFileId,
        drawingFileId: data.facility.drawingFileId,
        lon: data.facility.lon,
        lat: data.facility.lat,
        locationMeta: data.facility.locationMeta,
      };

      domainConfig.components.forEach((component) => {
        switch (component) {
          case 'floors':
            if (data.floors && data.floors.length > 0) {
              createRequest.floors = data.floors.filter(
                floor => floor.name.trim() !== '' && floor.floorId.trim() !== ''
              );
            }
            break;
          case 'stationInfo':
            if (data.stationInfo) {
              createRequest.stationInfo = {
                lineIds: data.stationInfo.lineIds || [],
                stationCodes: data.stationInfo.stationCodes?.filter(code => code.trim() !== '') || [],
              };
            }
            break;
          case 'boundary':
            if (data.boundary && data.boundary.trim() !== '') {
              createRequest.boundary = data.boundary;
            }
            break;
        }
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await FacilityService.create(selectedFacilityType, createRequest as any);
      
      const config = domainUtils.getConfig(selectedFacilityType);
      toast.success(`${config.displayName}이(가) 성공적으로 등록되었습니다.`);
      
      handleClose();
      onSuccess();
    } catch (error) {
      console.error('Failed to create facility:', error);
      toast.error('시설 등록에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderDynamicComponents = () => {
    if (!selectedFacilityType) return null;

    const domainConfig = domainUtils.getConfig(selectedFacilityType);
    const components: React.ReactElement[] = [];

    domainConfig.components.forEach((component) => {
      if (component === 'facility') return; // 기본 정보는 별도 렌더링

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
            isProcessingDrawing={isProcessingDrawing}
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

  const facilityTypes = domainUtils.getAllDomains();

  return (
    <Dialog open={isOpen} onOpenChange={handleClose} >
      <DialogContent 
        title="시설 등록" 
        className="max-w-4xl max-h-[90vh] overflow-y-auto"
        dimmed={true}
        disableBackground={true}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader className="pt-2">
              <CardTitle>시설 유형</CardTitle>
            </CardHeader>
            <CardContent  className="py-2">
              <Select
                value={selectedFacilityType}
                onValueChange={(value) => {
                  setValue('facilityType', value);
                  setSelectedFacilityType(value as FacilityType);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="시설 유형을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {facilityTypes.map((type) => {
                    const config = domainUtils.getConfig(type);
                    return (
                      <SelectItem key={type} value={type}>
                        {config.displayName}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              {errors.facilityType && (
                <p className="text-red-500 text-sm mt-1">{errors.facilityType.message}</p>
              )}
            </CardContent>
          </Card>

          {selectedFacilityType && (
            <FacilityForm
              register={register}
              errors={errors}
              control={control}
              setValue={setValue}
              watch={watch}
              onDrawingFileUploaded={handleDrawingFileUploaded}
              currentThumbnailFile={null}
              currentDrawingFile={null}
              isEditMode={false}
            />
          )}

          {/* 시설 유형 미선택 시 안내 메시지 */}
          {!selectedFacilityType && (
            <Card>
              <CardContent className="py-8">
                <div className="text-center text-gray-500">
                  <p className="text-lg mb-2">시설 유형을 선택해주세요</p>
                  <p className="text-sm">선택한 유형에 따라 필요한 정보 입력 폼이 표시됩니다</p>
                </div>
              </CardContent>
            </Card>
          )}

          {selectedFacilityType && renderDynamicComponents()}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              취소
            </Button>
            <Button
              type="submit"
              disabled={!selectedFacilityType || isLoading}
            >
              {isLoading ? '등록 중...' : '등록'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
