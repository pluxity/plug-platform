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
import { LocationSelectorField } from './location/LocationSelectorField';

export const FacilityForm: React.FC<ExtendedFacilityFormProps> = ({
  register,
  errors,
  control,
  setValue,
  watch,
  currentThumbnailFile,
  currentDrawingFile,
  onDrawingFileUploaded,
  isEditMode = false,
}) => {
  const watchedThumbnailFileId = watch?.('facility.thumbnailFileId') as number | undefined;
  const watchedDrawingFileId = watch?.('facility.drawingFileId') as number | undefined;

  const handleThumbnailChange = (fileId: number | null) => {
    if (!isEditMode || fileId !== null) {
      setValue?.('facility.thumbnailFileId', fileId || undefined);
    }
  };

  const handleThumbnailRemoved = () => {
    setValue?.('facility.thumbnailFileId', undefined);
  };

  // 도면 파일 업로드 핸들러
  const handleDrawingChange = (fileId: number | null) => {
    // 생성 단계에서는 삭제 시 undefined 세팅 (null 허용하지 않음)
    if (!isEditMode || fileId !== null) {
      setValue?.('facility.drawingFileId', fileId || undefined);
    }
  };

  const handleDrawingRemoved = () => {
    setValue?.('facility.drawingFileId', undefined);
  };

  const handleDrawingUploaded = (fileInfo: { url?: string }) => {
    if (fileInfo?.url && onDrawingFileUploaded) {
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
        <div className="w-full">
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
        </div>

        {/* 도면 파일 업로드 (생성 시에만 노출, 수정은 별도 이력 관리 컴포넌트 사용) */}
        {!isEditMode && (
          <div className="w-full">
            <FileUpload
              label="도면 파일 (GLB/GLTF)"
              accept=".glb,.gltf"
              fileType="document"
              placeholder="도면 파일을 업로드하세요"
              currentFileId={watchedDrawingFileId}
              currentFileInfo={currentDrawingFile}
              onFileChange={handleDrawingChange}
              onFileRemoved={handleDrawingRemoved}
              onFileUploaded={handleDrawingUploaded}
              maxSizeInMB={500} // 도면은 200MB 제한 (필요 시 조정)
            />
            <p className="text-xs text-gray-500 mt-2">업로드 후 자동으로 층 정보가 추출됩니다.</p>
          </div>
        )}

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
