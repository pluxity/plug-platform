import React, { useState, useCallback, useEffect, useRef } from 'react';
import { toast } from 'sonner'; 
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  Button,
  Input,
  ModalForm,
  ModalFormField,
  ModalFormContainer,
  ModalFormItem,
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from '@plug/ui';
import { useAssetDetailSWR, useUpdateAsset, useFileUploadWithInfo, useAssetCategoryTree, AssetCategoryResponse } from '@plug/common-services'; 

import { AssetEditModalProps } from '@/backoffice/domains/asset/types/asset';
import { assetFormSchema, type AssetFormData } from '@/backoffice/domains/asset/schemas/assetSchemas';

export const AssetEditModal: React.FC<AssetEditModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  assetId,
}) => {

  const { mutate, data } = useAssetDetailSWR(isOpen && assetId ? assetId : undefined);


  const modalForm = useForm<AssetFormData>({
    resolver: zodResolver(assetFormSchema),
    defaultValues: {
      categoryId: '',
      name: '',
      code: '',
    },
    mode: 'onChange',
  });

   // 에셋 카테고리 목록 
   const { categories } = useAssetCategoryTree();

  // 파일 상태
  const [modelFileId, setModelFileId] = useState<number | null>(null);
  const modelInputRef = useRef<HTMLInputElement>(null);
  const [thumbnailFileId, setThumbnailFileId] = useState<number | null>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  // 3D 모델 파일 업로드
  const {
    execute: uploadModel,
    fileInfo: modelInfo,
    isLoadingFileInfo: isModelUploading,
    clearFileInfo: clearModelInfo,
  } = useFileUploadWithInfo();

  // 썸네일 파일 업로드
  const {
    execute: uploadThumbnail,
    fileInfo: thumbnailInfo,
    isLoadingFileInfo: isThumbnailUploading,
    clearFileInfo: clearThumbnailInfo,
  } = useFileUploadWithInfo();

  // 에셋 수정
  const { execute: updateAsset, isLoading: isAssetUpdating } = useUpdateAsset(assetId);

  // 기존 에셋 정보 조회 - 모달이 처음 열릴 때만 초기화
  useEffect(() => {
    if (isOpen && data && !modalForm.formState.isDirty) {
      modalForm.reset({
        categoryId: data.categoryId?.toString() ?? '',
        name: data.name ?? '',
        code: data.code ?? '',
      });
      clearModelInfo();
      clearThumbnailInfo();
      setModelFileId(data.file?.id || null);
      setThumbnailFileId(data.thumbnailFile?.id || null);
      if (data.thumbnailFile?.url) {
        setThumbnailPreview(data.thumbnailFile.url);
      } else {
        setThumbnailPreview(null);
      }
    }
  }, [isOpen, assetId, data]);

  const handleModelChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      if (!file.name.endsWith('.glb') && !file.name.endsWith('.gltf')) {
        toast.warning('GLB, GLTF 파일만 업로드 가능합니다.');
        return;
      }
      try {
        const fileInfo = await uploadModel(file);
        if (fileInfo?.id) {
          setModelFileId(fileInfo.id);
        }
        
        toast.success('3D 모델 업로드 성공');
      } catch (error: unknown) {
        console.error('3D 모델 업로드 실패:', error);
        toast.error((error as Error).message || '3D 모델 업로드에 실패했습니다.');
        clearModelInfo();
        setModelFileId(null);
      }
    },
    [uploadModel, clearModelInfo]
  );

  const handleThumbnailChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      if (!file.type.startsWith('image/')) {
        toast.warning('이미지 파일만 업로드 가능합니다.');
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      setThumbnailPreview(previewUrl);
      try {
        const fileInfo = await uploadThumbnail(file);
        if (fileInfo?.id) {
          setThumbnailFileId(fileInfo.id);
        }
        toast.success('썸네일 업로드 성공');
      } catch (error: unknown) {
        console.error('썸네일 업로드 실패:', error);
        toast.error((error as Error).message || '썸네일 업로드에 실패했습니다.');
        clearThumbnailInfo();
        setThumbnailFileId(null);
        setThumbnailPreview(null);
      }
    },
    [uploadThumbnail, clearThumbnailInfo]
  );

  const resetForm = useCallback(() => {
    modalForm.reset({
      categoryId: data?.categoryId?.toString() ?? '',
      name: data?.name ?? '',
      code: data?.code ?? '',
    });
    setModelFileId(data?.file?.id || null);
    clearModelInfo();
    setThumbnailFileId(data?.thumbnailFile?.id || null);
    clearThumbnailInfo();
    onClose();
    mutate();
  }, [data, onClose, mutate]);

  const handleSubmit = useCallback(async (data: AssetFormData) => {
      try {
        await updateAsset({
            name: data.name,
            code: data.code,
            categoryId: Number(data.categoryId),
            fileId: modelFileId || undefined, 
            thumbnailFileId: thumbnailFileId || undefined, 
        });
          toast.success('에셋 수정 완료');
          onSuccess?.();
          resetForm();
      } catch (error: unknown) {
        console.error('에셋 수정 실패:', error);
        toast.error((error as Error).message || '에셋 수정에 실패했습니다.');
      }
    },
    [modelFileId, thumbnailFileId, updateAsset, onSuccess, resetForm]
  );

  const isProcessing = isModelUploading || isThumbnailUploading || isAssetUpdating;

  return (
    <Dialog open={isOpen} onOpenChange={resetForm}>
      <DialogContent title="에셋 수정" className="max-w-xl" dimmed disableBackground>
        <ModalForm {...modalForm}>
          <form onSubmit={modalForm.handleSubmit(handleSubmit)}>
            <ModalFormContainer>
              <ModalFormField
                control={modalForm.control}
                name="categoryId"
                render={({ field }) => (
                  <ModalFormItem label="에셋 카테고리" message={modalForm.formState.errors.categoryId?.message}>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="에셋 카테고리를 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category: AssetCategoryResponse) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </ModalFormItem>
                )}
              />
              <ModalFormField
                control={modalForm.control}
                name="code"
                render={({ field }) => (
                  <ModalFormItem label="에셋 코드" message={modalForm.formState.errors.code?.message}>
                    <Input {...field} placeholder="에셋 코드를 입력해주세요." />
                  </ModalFormItem>
                )}
              />
              <ModalFormField
                control={modalForm.control}
                name="name"
                render={({ field }) => (
                  <ModalFormItem label="에셋 이름" message={modalForm.formState.errors.name?.message}>
                    <Input {...field} placeholder="에셋 이름을 입력해주세요." />
                  </ModalFormItem>
                )}
              />
               <ModalFormItem label="3D 모델 파일">
                <div data-slot="content">
                  <Input type="file" ref={modelInputRef} className="hidden" accept=".glb,.gltf" onChange={handleModelChange} />
                  <div className="flex items-center gap-2 border-2 border-gray-300 rounded-md p-2 border-dashed">
                    <span className="flex-1 text-sm text-gray-700">
                      {modelInfo?.originalFileName || data?.file?.originalFileName || '선택된 파일 없음'}
                    </span>
                    <Button type="button" onClick={() => modelInputRef.current?.click()}>
                      변경
                    </Button>
                  </div>
                </div>
              </ModalFormItem>

              <ModalFormItem label="썸네일 파일">
                <div data-slot="content">
                  <Input type="file" ref={thumbnailInputRef} className="hidden" accept="image/*" onChange={handleThumbnailChange} />
                  <div className="flex items-center gap-2 border-2 border-gray-300 rounded-md p-2 border-dashed">
                    {thumbnailPreview ? (
                      <img src={thumbnailPreview} alt="썸네일 파일" className="w-20 h-20 rounded-sm object-contain" />
                    ):(
                      <span className="w-20 h-20 rounded-sm bg-gray-200 flex items-center justify-center text-xs text-gray-700">
                        이미지 미리보기
                      </span>
                    )}
                    <span className="flex-1 text-sm text-gray-700">
                      {thumbnailInfo?.originalFileName || data?.thumbnailFile?.originalFileName || '선택된 파일 없음'}
                    </span>
                    <Button type="button" onClick={() => thumbnailInputRef.current?.click()}>
                      변경
                    </Button>
                  </div>
                </div>
              </ModalFormItem>
            </ModalFormContainer>
            <DialogFooter>
              <Button type="button" onClick={resetForm} disabled={isProcessing} variant="outline">
                취소
              </Button>
              <Button type="submit" disabled={isProcessing || !modalForm.formState.isValid}>
                {isProcessing ? '처리 중...' : '수정'}
              </Button>
            </DialogFooter>
          </form>
        </ModalForm>
      </DialogContent>
    </Dialog>
  );
};

export default AssetEditModal;