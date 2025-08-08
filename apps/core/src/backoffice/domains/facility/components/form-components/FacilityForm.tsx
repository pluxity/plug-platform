import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Input,
  Textarea,
} from '@plug/ui';
import { ExtendedFacilityFormProps } from '../../types';
import { FileUpload } from './FileUpload';
import { FileResponse } from '@plug/common-services';
import { LocationSelectorField } from './location/LocationSelectorField';

export const FacilityForm: React.FC<ExtendedFacilityFormProps> = ({
  register,
  errors,
  control,
  setValue,
  watch,
  onDrawingFileUploaded,
  currentThumbnailFile,
  currentDrawingFile,
  isEditMode = false,
}) => {
  const watchedThumbnailFileId = watch?.('facility.thumbnailFileId');
  const watchedDrawingFileId = watch?.('facility.drawingFileId');

  const handleThumbnailChange = (fileId: number | null) => {
    if (!isEditMode || fileId !== null) {
      setValue?.('facility.thumbnailFileId', fileId || undefined);
    }
  };

  const handleDrawingChange = (fileId: number | null) => {
    if (!isEditMode || fileId !== null) {
      setValue?.('facility.drawingFileId', fileId || undefined);
    }
  };

  const handleThumbnailRemoved = () => {
    setValue?.('facility.thumbnailFileId', undefined);
  };

  const handleDrawingRemoved = () => {
    setValue?.('facility.drawingFileId', undefined);
  };

  const handleDrawingUploaded = (fileInfo: FileResponse) => {
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
            currentFileInfo={currentThumbnailFile}
            onFileChange={handleThumbnailChange}
            onFileRemoved={handleThumbnailRemoved}
            isEditMode={isEditMode}
            maxSizeInMB={10} // 이미지는 10MB 제한
          />
          
          <FileUpload
            label="도면 파일"
            accept=".glb,.gltf"
            fileType="document"
            placeholder="3D 모델 파일을 업로드하세요 (GLB, GLTF)"
            currentFileId={watchedDrawingFileId}
            currentFileInfo={currentDrawingFile}
            onFileChange={handleDrawingChange}
            onFileUploaded={handleDrawingUploaded}
            onFileRemoved={handleDrawingRemoved}
            isEditMode={isEditMode}
            maxSizeInMB={100} // 3D 모델은 100MB 제한
          />
        </div>

        <LocationSelectorField
          control={control}
          setValue={setValue}
          watch={watch}
          errors={errors}
        />
      </CardContent>
    </Card>
  );
};
