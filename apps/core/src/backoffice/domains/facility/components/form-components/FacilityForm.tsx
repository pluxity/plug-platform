import React from 'react';

import {
  Button,
  Input,
  Textarea
} from "@plug/ui";

import { ExtendedFacilityFormProps } from '../../types';
import { FileUpload } from './FileUpload';
import { LocationSelectorField } from "@/backoffice/domains/facility";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  domainConfig,
}) => {
  const navigate = useNavigate();

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

  const handleDrawingChange = (fileId: number | null) => {
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

  const handleGoBack = () => {
    navigate('/admin/facility');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between space-x-4" data-testid="facility-form-header">
        <div className="flex items-end space-x-4">
          <div className="text-2xl font-bold text-gray-700" data-testid="facility-form-title">
            시설 기본 정보
          </div>
          <span className="text-sm bg-primary-200 text-primary-800 px-2 py-1 rounded">
            {domainConfig?.displayName}
          </span>
        </div>


        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={handleGoBack}
              className="text-secondary-800 hover:text-gray-800 rounded-md border"
            >
              <ArrowLeft size={18} />
              목록으로
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 rounded-lg gap-10 p-3">
        <div className="space-y-4" data-testid="facility-thumbnail-input">
          <div className="flex items-center space-x-2">
            <div className="w-0.5 h-5 rounded-full bg-primary-600 inline-block mr-3"/>
            <label className="block font-bold">
              썸네일 이미지
            </label>
          </div>
          <FileUpload
            accept="image/*"
            fileType="image"
            placeholder="썸네일 이미지를 업로드하세요"
            currentFileId={watchedThumbnailFileId}
            currentFileInfo={currentThumbnailFile}
            onFileChange={handleThumbnailChange}
            onFileRemoved={handleThumbnailRemoved}
            isEditMode={isEditMode}
            maxSizeInMB={10}
          />
        </div>
        <div className="w-full space-y-7 col-span-2" data-testid="facility-basic-info-input">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className='space-y-4' data-testid="facility-name-input">
              <div className="flex items-center space-x-2" >
                <div className="w-0.5 h-5 rounded-full bg-primary-600 inline-block mr-3"/>
                <label className="block font-bold">
                  <span>시설명</span> <span className="text-red-500">*</span>
                </label>
              </div>

              <Input
                {...register('facility.name')}
                placeholder="시설명을 입력하세요"
              />
              {errors.facility?.name && (<p className="text-red-500 text-sm mt-1">{errors.facility.name.message}</p>)}
            </div>

            <div className='space-y-4' data-testid="facility-code-input">
              <div className="flex items-center space-x-2">
                <div className="w-0.5 h-5 rounded-full bg-primary-600 inline-block mr-3"/>
                <label className="block font-bold">
                  시설 코드 <span className="text-red-500">*</span>
                </label>
              </div>
              <Input
                {...register('facility.code')}
                placeholder="시설 코드를 입력하세요"
              />
              {errors.facility?.code && (<p className="text-red-500 text-sm mt-1">{errors.facility.code.message}</p>)}
            </div>
          </div>

          <div className="w-full space-y-4" data-testid="facility-description-input">
            <div className="flex items-center space-x-2">
              <div className="w-0.5 h-5 rounded-sm bg-primary-600 inline-block mr-3"/>
              <label className="block font-bold">
                설명
              </label>
            </div>
            <Textarea
              {...register('facility.description')}
              placeholder="시설에 대한 설명을 입력하세요"
              rows={4}
              className="w-full"
            />
          </div>
          {!isEditMode && (
            <div className="w-full">
              <FileUpload
                accept=".glb,.gltf"
                fileType="document"
                placeholder="도면 파일을 업로드하세요"
                currentFileId={watchedDrawingFileId}
                currentFileInfo={currentDrawingFile}
                onFileChange={handleDrawingChange}
                onFileRemoved={handleDrawingRemoved}
                onFileUploaded={handleDrawingUploaded}
                maxSizeInMB={500}
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
        </div>
      </div>
    </div>
  );
};
