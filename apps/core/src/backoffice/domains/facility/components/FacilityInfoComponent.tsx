import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Textarea, Card, CardHeader, CardTitle, CardContent } from '@plug/ui';
import { FacilityResponse, FacilityUpdateRequest } from '@plug/common-services';

const facilitySchema = z.object({
  name: z.string().min(1, '시설명은 필수입니다'),
  code: z.string().min(1, '시설 코드는 필수입니다'),
  description: z.string(),
  thumbnailFileId: z.number().optional(),
  lon: z.number().optional(),
  lat: z.number().optional(),
  locationMeta: z.string().optional(),
});

type FacilityFormData = z.infer<typeof facilitySchema>;

interface FacilityInfoComponentProps {
  facility: FacilityResponse;
  onSave: (data: FacilityUpdateRequest) => Promise<void>;
  isLoading?: boolean;
}

export const FacilityInfoComponent: React.FC<FacilityInfoComponentProps> = ({
  facility,
  onSave,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<FacilityFormData>({
    resolver: zodResolver(facilitySchema),
    defaultValues: {
      name: facility.name,
      code: facility.code,
      description: facility.description || '',
      thumbnailFileId: facility.thumbnail?.id || undefined,
      lon: facility.lon || undefined,
      lat: facility.lat || undefined,
      locationMeta: facility.locationMeta || '',
    },
  });

  const onSubmit = async (data: FacilityFormData) => {
    const updateData: FacilityUpdateRequest = {
      name: data.name,
      code: data.code,
      description: data.description || '',
      thumbnailFileId: data.thumbnailFileId || facility.thumbnail?.id || 0,
      lon: data.lon || 0,
      lat: data.lat || 0,
      locationMeta: data.locationMeta || '',
    };
    
    await onSave(updateData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>기본 정보</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                시설명 <span className="text-red-500">*</span>
              </label>
              <Input
                {...register('name')}
                placeholder="시설명을 입력하세요"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                시설 코드 <span className="text-red-500">*</span>
              </label>
              <Input
                {...register('code')}
                placeholder="시설 코드를 입력하세요"
              />
              {errors.code && (
                <p className="text-red-500 text-sm mt-1">{errors.code.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              설명
            </label>
            <Textarea
              {...register('description')}
              placeholder="시설에 대한 설명을 입력하세요"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                경도
              </label>
              <Input
                {...register('lon', { valueAsNumber: true })}
                type="number"
                step="any"
                placeholder="경도를 입력하세요"
              />
              {errors.lon && (
                <p className="text-red-500 text-sm mt-1">{errors.lon.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                위도
              </label>
              <Input
                {...register('lat', { valueAsNumber: true })}
                type="number"
                step="any"
                placeholder="위도를 입력하세요"
              />
              {errors.lat && (
                <p className="text-red-500 text-sm mt-1">{errors.lat.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              위치 메타데이터
            </label>
            <Input
              {...register('locationMeta')}
              placeholder="위치 메타데이터를 입력하세요"
            />
            {errors.locationMeta && (
              <p className="text-red-500 text-sm mt-1">{errors.locationMeta.message}</p>
            )}
          </div>

          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={!isDirty || isLoading}
            >
              {isLoading ? '저장 중...' : '저장'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};