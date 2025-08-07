import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Input,
  Textarea,
} from '@plug/ui';
import { ExtendedFacilityFormComponentProps } from '../../types';
import { FileUpload } from './FileUpload';

export const FacilityFormComponent: React.FC<ExtendedFacilityFormComponentProps> = ({
  register,
  errors,
  setValue,
  watch,
  onDrawingFileUploaded,
}) => {
  const watchedThumbnailFileId = watch?.('facility.thumbnailFileId');
  const watchedDrawingFileId = watch?.('facility.drawingFileId');

  const handleThumbnailChange = (fileId: number | null) => {
    setValue?.('facility.thumbnailFileId', fileId || undefined);
  };

  const handleDrawingChange = (fileId: number | null) => {
    setValue?.('facility.drawingFileId', fileId || undefined);
  };

  const handleDrawingUploaded = (fileInfo: { id: number; url: string; originalFileName: string }) => {
    console.log('Drawing file uploaded in FacilityFormComponent:', fileInfo);
    if (onDrawingFileUploaded) {
      onDrawingFileUploaded(fileInfo.url);
    }
  };
  return (
    <Card>
      <CardHeader className="pt-2">
        <CardTitle>기본 정보</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 py-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              시설명 <span className="text-red-500">*</span>
            </label>
            <Input
              {...register('facility.name')}
              placeholder="시설명을 입력하세요"
            />
            {errors.facility?.name && (
              <p className="text-red-500 text-sm mt-1">{errors.facility.name.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              시설 코드 <span className="text-red-500">*</span>
            </label>
            <Input
              {...register('facility.code')}
              placeholder="시설 코드를 입력하세요"
            />
            {errors.facility?.code && (
              <p className="text-red-500 text-sm mt-1">{errors.facility.code.message}</p>
            )}
          </div>
        </div>

        <div className="w-full">
          <label className="block text-sm font-medium mb-2">
            설명
          </label>
          <Textarea
            {...register('facility.description')}
            placeholder="시설에 대한 설명을 입력하세요"
            rows={4}
            className="w-full"
          />
        </div>

        {/* 파일 업로드 섹션 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FileUpload
            label="썸네일 이미지"
            accept="image/*"
            fileType="image"
            placeholder="썸네일 이미지를 업로드하세요"
            currentFileId={watchedThumbnailFileId}
            onFileChange={handleThumbnailChange}
          />
          
          <FileUpload
            label="도면 파일"
            accept=".glb,.gltf"
            fileType="document"
            placeholder="3D 모델 파일을 업로드하세요 (GLB, GLTF)"
            currentFileId={watchedDrawingFileId}
            onFileChange={handleDrawingChange}
            onFileUploaded={handleDrawingUploaded}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              경도
            </label>
            <Input
              {...register('facility.lon', { valueAsNumber: true })}
              type="number"
              step="any"
              placeholder="경도를 입력하세요"
            />
            {errors.facility?.lon && (
              <p className="text-red-500 text-sm mt-1">{errors.facility.lon.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              위도
            </label>
            <Input
              {...register('facility.lat', { valueAsNumber: true })}
              type="number"
              step="any"
              placeholder="위도를 입력하세요"
            />
            {errors.facility?.lat && (
              <p className="text-red-500 text-sm mt-1">{errors.facility.lat.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            위치 메타데이터
          </label>
          <Input
            {...register('facility.locationMeta')}
            placeholder="위치 메타데이터를 입력하세요"
          />
          {errors.facility?.locationMeta && (
            <p className="text-red-500 text-sm mt-1">{errors.facility.locationMeta.message}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
