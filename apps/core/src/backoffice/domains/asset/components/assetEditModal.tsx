import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  Button,
  Input,
  ModalForm,
  ModalFormItem,
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from '@plug/ui';
import { toast } from '@plug/ui'
import { useAssetDetailSWR, useUpdateAsset, useFileUploadWithInfo } from '@plug/common-services/services';
import { AssetEditModalProps } from '@/backoffice/domains/asset/types/asset';
import { useAssetCategoryTree, AssetCategoryResponse } from '@plug/common-services'; 

export const AssetEditModal: React.FC<AssetEditModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  assetId,
}) => {

  const { mutate, data } = useAssetDetailSWR(isOpen && assetId ? assetId : null);

   // 에셋 카테고리 목록 
   const { categories } = useAssetCategoryTree();

  // 폼 상태
  const [categoryId, setCategoryId] = useState<number>();
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [modelFile, setModelFile] = useState<File | null>(null);
  const modelInputRef = useRef<HTMLInputElement>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

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
  const { execute: updateAsset, isLoading: isAssetUpdating } = useUpdateAsset(assetId ?? 0);

  // 기존 에셋 정보 조회
  useEffect(() => {
    if (isOpen && data) {
      setCategoryId(data.categoryId);
      setName(data.name ?? '');
      setCode(data.code ?? '');
      clearModelInfo();
      clearThumbnailInfo();
      setModelFile(null);
      setThumbnailFile(null);
    }
  }, [isOpen, assetId, data]);


  const handleNameChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  }, []);

  const handleCodeChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setCode(event.target.value);
  }, []);

  const handleModelChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      if (!file.name.endsWith('.glb') && !file.name.endsWith('.gltf')) {
        toast.warning('GLB, GLTF 파일만 업로드 가능합니다.');
        return;
      }
      setModelFile(file);
      try {
        await uploadModel(file);
        toast.success('3D 모델 업로드 성공');
      } catch (error: unknown) {
        console.error('3D 모델 업로드 실패:', error);
        toast.error((error as Error).message || '3D 모델 업로드에 실패했습니다.');
        clearModelInfo();
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
      setThumbnailFile(file);
      try {
        await uploadThumbnail(file);
        toast.success('썸네일 업로드 성공');
      } catch (error: unknown) {
        console.error('썸네일 업로드 실패:', error);
        toast.error((error as Error).message || '썸네일 업로드에 실패했습니다.');
        clearThumbnailInfo();
      }
    },
    [uploadThumbnail, clearThumbnailInfo]
  );

  const resetForm = useCallback(() => {
    setCategoryId(data?.categoryId);
    setName(data?.name ?? '');
    setCode(data?.code ?? '');
    setModelFile(null);
    clearModelInfo();
    setThumbnailFile(null);
    clearThumbnailInfo();
    onClose();
    mutate();
  }, [data, onClose, clearModelInfo, clearThumbnailInfo, mutate]);

  const handleSubmit = useCallback( async (event: React.FormEvent) => {
      event.preventDefault();

      try {
        await updateAsset({
            name,
            code,
            categoryId:categoryId,
            fileId: modelInfo?.id,
            thumbnailFileId:thumbnailInfo?.id,
        });
          toast.success('에셋 수정 완료');
          onSuccess?.();
          resetForm();
      } catch (error: unknown) {
        console.error('에셋 수정 실패:', error);
        toast.error((error as Error).message || '에셋 수정에 실패했습니다.');
      }
    },
    [ name, code, modelInfo?.id, thumbnailInfo?.id, categoryId, updateAsset, onSuccess, resetForm ]
  );

  const isProcessing = isModelUploading || isThumbnailUploading || isAssetUpdating;

  return (
    <Dialog open={isOpen} onOpenChange={resetForm}>
      <DialogContent title="에셋 수정" className="max-w-xl" dimmed disableBackground>
        <form onSubmit={handleSubmit}>
          <ModalForm>
          <ModalFormItem label="에셋 카테고리">
                <Select     
                    value={categoryId?.toString()} 
                    onValueChange={value => setCategoryId(Number(value))}
                    >
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
              <ModalFormItem label="에셋 이름">
                <Input value={name} onChange={handleNameChange} placeholder="에셋 이름을 입력해주세요." />
              </ModalFormItem>
              <ModalFormItem label="에셋 코드">
                <Input value={code} onChange={handleCodeChange} placeholder="에셋 코드를 입력해주세요." />
              </ModalFormItem>
              <ModalFormItem label="썸네일 업로드">
                <Input type="file" ref={thumbnailInputRef} className="hidden" accept="image/*" onChange={handleThumbnailChange} />
                <div className="flex items-center gap-2 border-2 border-gray-300 rounded-md p-2 border-dashed">
                  <span className="flex-1 text-sm text-gray-700">
                    { thumbnailFile? thumbnailFile.name : data?.thumbnailFile?.originalFileName }
                  </span>
                  <Button type="button" onClick={() => thumbnailInputRef.current?.click()}>
                    변경
                  </Button>
                </div>
              </ModalFormItem>

              <ModalFormItem label="3D 모델 파일 업로드">
                <Input type="file" ref={modelInputRef} className="hidden" accept=".glb,.gltf" onChange={handleModelChange} />
                <div className="flex items-center gap-2 border-2 border-gray-300 rounded-md p-2 border-dashed">
                  <span className="flex-1 text-sm text-gray-700">
                    {modelFile ? modelFile.name : data?.file?.originalFileName}
                  </span>
                  <Button type="button" onClick={() => modelInputRef.current?.click()}>
                    변경
                  </Button>
                </div>
              </ModalFormItem>
          </ModalForm>
          <DialogFooter>
            <Button type="button" onClick={resetForm} disabled={isProcessing} variant="outline">
              취소
            </Button>
            <Button type="submit" disabled={isProcessing}>수정</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AssetEditModal;