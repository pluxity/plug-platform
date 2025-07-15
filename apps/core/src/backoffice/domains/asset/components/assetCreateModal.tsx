import React, { useState, useCallback } from 'react';
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
import { useCreateAsset, useFileUploadWithInfo } from '@plug/common-services/services';
import { AssetCreateModalProps } from '@/backoffice/domains/asset/types/asset';
import { useAssetCategoryTree } from '@plug/common-services'; 

export const AssetCreateModal: React.FC<AssetCreateModalProps> = ({ isOpen, onClose, onSuccess }) => {
    // 에셋 정보
    const [categoryId, setCategoryId] = useState<number>();
    const [name, setName] = useState('');
    const [code, setCode] = useState('');

    // 3D 모델 파일
    const [modelFile, setModelFile] = useState<File | null>(null);
    
    // 썸네일 파일
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

    // 3D 모델 파일 업로드
    const {
        execute: uploadModel,
        fileInfo: modelInfo,
        isLoadingFileInfo: isModelUploading,
        fileInfoError: modelUploadError,
        clearFileInfo: clearModelInfo,
    } = useFileUploadWithInfo();

    // 썸네일 파일 업로드
    const {
        execute: uploadThumbnail,
        fileInfo: thumbnailInfo,
        isLoadingFileInfo: isThumbnailUploading,
        fileInfoError: thumbnailUploadError,
        clearFileInfo: clearThumbnailInfo,
    } = useFileUploadWithInfo();

    // 에셋 카테고리 목록 
    const { categories: apiCategories } = useAssetCategoryTree();

    // 에셋 생성
    const { execute: createAsset, isLoading: isAssetCreating, error: createError } = useCreateAsset();

    
    const handleNameChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    }, []);

    const handleCodeChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setCode(event.target.value);
    }, []);

    const handleModelChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
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
        } catch {
        toast.error('3D 모델 업로드 실패');
        clearModelInfo();
        }
    }, [uploadModel, clearModelInfo]);

    const handleThumbnailChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
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
        } catch {
        toast.error('썸네일 업로드 실패');
        clearThumbnailInfo();
        }
    }, [uploadThumbnail, clearThumbnailInfo]);

    const resetForm = useCallback(() => {
        setCategoryId(undefined);
        setName('');
        setCode('');
        setModelFile(null);
        clearModelInfo();
        setThumbnailFile(null);
        clearThumbnailInfo();
        onClose();
    }, [onClose, clearModelInfo, clearThumbnailInfo]);

    const handleSubmit = useCallback(async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            await createAsset({
                name,
                code,
                categoryId:categoryId,
                fileId: modelInfo?.id,
                thumbnailFileId: thumbnailInfo?.id,
            });
            toast.success('에셋 등록 완료');
            onSuccess?.();
            resetForm();
        } catch {
            createError && toast.error(createError.message || '에셋 등록에 실패했습니다.');
        }
    }, [name, code, categoryId, modelInfo?.id, thumbnailInfo?.id, categoryId, createAsset, onSuccess, resetForm, createError]);

    const isProcessing = isModelUploading || isThumbnailUploading || isAssetCreating;

    return (
        <Dialog open={isOpen} onOpenChange={resetForm}>
            <DialogContent title="에셋 등록" className="max-w-xl" dimmed disableBackground>
                <form onSubmit={handleSubmit}>
                <ModalForm>
                    <ModalFormItem label="에셋 카테고리" >
                    <Select     
                        value={categoryId?.toString()} 
                        onValueChange={value => setCategoryId(Number(value))}
                        >
                        <SelectTrigger>
                            <SelectValue placeholder="에셋 카테고리를 선택하세요" />
                        </SelectTrigger>
                        <SelectContent>
                            {(apiCategories ?? []).map((category: { id: number; name: string }) => (
                                <SelectItem key={category.id} value={category.id.toString()}>
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    </ModalFormItem>
                    <ModalFormItem label="에셋 이름">
                        <Input value={name} onChange={handleNameChange} placeholder="에셋 이름을 입력해주세요." required />
                    </ModalFormItem>
                    <ModalFormItem label="에셋 코드">
                        <Input value={code} onChange={handleCodeChange} placeholder="에셋 코드를 입력해주세요." required />
                    </ModalFormItem>
                    <ModalFormItem label="썸네일 업로드">
                        <Input type="file" id="thumb-upload" className="hidden" accept="image/*" onChange={handleThumbnailChange} />
                        <div className="flex items-center gap-2 border-2 border-gray-300 rounded-md p-2 border-dashed">
                            <span className="flex-1 text-sm text-gray-700">
                            {thumbnailFile ? thumbnailFile.name : '선택된 파일 없음'}
                            </span>
                            <Button type="button" onClick={() => document.getElementById('thumb-upload')?.click()}>
                            {thumbnailFile ? '변경' : '파일 선택'}
                            </Button>
                        </div>
                        {thumbnailUploadError && <div className="text-red-500 text-sm">{thumbnailUploadError.message}</div>}
                    </ModalFormItem>

                    <ModalFormItem label="3D 모델 파일 업로드">
                        <Input type="file" id="model-upload" className="hidden" accept=".glb,.gltf" onChange={handleModelChange} />
                        <div className="flex items-center gap-2 border-2 border-gray-300 rounded-md p-2 border-dashed">
                            <span className="flex-1 text-sm text-gray-700">
                            {modelFile ? modelFile.name : '선택된 파일 없음'}
                            </span>
                            <Button type="button" onClick={() => document.getElementById('model-upload')?.click()}>
                            {modelFile ? '변경' : '파일 선택'}
                            </Button>
                        </div>
                        {modelUploadError && <div className="text-red-500 text-sm">{modelUploadError.message}</div>}
                    </ModalFormItem>
                </ModalForm>
                <DialogFooter>
                    <Button type="button" onClick={resetForm} disabled={isProcessing} variant="outline">
                    취소
                    </Button>
                    <Button type="submit" disabled={isProcessing}>등록</Button>
                </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AssetCreateModal;