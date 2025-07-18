import React, { useState, useCallback, useRef } from 'react';
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
import { useAssetCategoryTree, AssetCategoryResponse } from '@plug/common-services'; 

export const AssetCreateModal: React.FC<AssetCreateModalProps> = ({ isOpen, onClose, onSuccess }) => {
    // 에셋 정보
    const [categoryId, setCategoryId] = useState<string>('');
    const [name, setName] = useState('');
    const [code, setCode] = useState('');

    // 3D 모델 파일
    const [modelFileId, setModelFileId] = useState<number | null>(null);
    const modelInputRef = useRef<HTMLInputElement>(null);
    
    // 썸네일 파일
    const [thumbnailFileId, setThumbnailFileId] = useState<number | null>(null);
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

    // 에셋 카테고리 목록 
    const { categories } = useAssetCategoryTree();

    // 에셋 생성
    const { execute: createAsset, isLoading: isAssetCreating } = useCreateAsset();

    // 에셋 정보 변경 핸들러
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
        try {
        const fileInfo = await uploadModel(file);
        if (fileInfo?.id) {
            setModelFileId(fileInfo.id);
        }
            toast.success('3D 모델 업로드 성공');
        } catch (error) {
            console.error('3D 모델 업로드 실패:', error);
            toast.error((error as Error).message || '3D 모델 업로드에 실패했습니다.');
        clearModelInfo();
        setModelFileId(null);
        }
    }, [uploadModel, clearModelInfo]);

    const handleThumbnailChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
        toast.warning('이미지 파일만 업로드 가능합니다.');
        return;
        }
        try {
        const fileInfo = await uploadThumbnail(file);
        if (fileInfo?.id) {
            setThumbnailFileId(fileInfo.id);
        }
        toast.success('썸네일 업로드 성공');
        } catch (error) {
            console.error('썸네일 업로드 실패:', error);
            toast.error((error as Error).message || '썸네일 업로드에 실패했습니다.');
        clearThumbnailInfo();
        setThumbnailFileId(null);
        }
    }, [uploadThumbnail, clearThumbnailInfo]);

    const resetForm = useCallback(() => {
        setCategoryId('');
        setName('');
        setCode('');
        setModelFileId(null);
        clearModelInfo();
        setThumbnailFileId(null);
        clearThumbnailInfo();
        onClose();
    }, [onClose, clearModelInfo, clearThumbnailInfo]);

    const handleSubmit = useCallback(async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            await createAsset({
                name,
                code,
                categoryId: Number(categoryId),
                fileId: modelFileId || undefined, 
                thumbnailFileId: thumbnailFileId || undefined, 
            });
            toast.success('에셋 등록 완료');
            onSuccess?.();
            resetForm();
        } catch (error) {
            console.error('에셋 등록 실패:', error);
            toast.error((error as Error).message || '에셋 등록에 실패했습니다.');
        }
    }, [name, code, categoryId, modelFileId, thumbnailFileId, createAsset, onSuccess, resetForm]);

    const isProcessing = isModelUploading || isThumbnailUploading || isAssetCreating;

    return (
        <Dialog open={isOpen} onOpenChange={resetForm}>
            <DialogContent title="에셋 등록" className="max-w-xl" dimmed disableBackground>
                <form onSubmit={handleSubmit}>
                <ModalForm>
                    <ModalFormItem label="에셋 카테고리" >
                    <Select     
                        value={categoryId} 
                        onValueChange={value => setCategoryId(value)}
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
                        <Input value={name} onChange={handleNameChange} placeholder="에셋 이름을 입력해주세요." required />
                    </ModalFormItem>
                    <ModalFormItem label="에셋 코드">
                        <Input value={code} onChange={handleCodeChange} placeholder="에셋 코드를 입력해주세요." required />
                    </ModalFormItem>
                    <ModalFormItem label="썸네일 업로드">
                        <Input type="file" ref={thumbnailInputRef} className="hidden" accept="image/*" onChange={handleThumbnailChange} />
                        <div className="flex items-center gap-2 border-2 border-gray-300 rounded-md p-2 border-dashed">
                            <span className="flex-1 text-sm text-gray-700">
                                {thumbnailInfo?.originalFileName || '선택된 파일 없음'}
                            </span>
                            <Button type="button" onClick={() => thumbnailInputRef.current?.click()}>
                                {thumbnailInfo?.originalFileName ? '변경' : '파일 선택'}
                            </Button>
                        </div>
                        {isThumbnailUploading && (
                            <p className="text-sm text-orange-600 mt-1">파일 업로드 중입니다...</p>
                        )}
                    </ModalFormItem>

                    <ModalFormItem label="3D 모델 파일 업로드">
                        <Input type="file" ref={modelInputRef} className="hidden" accept=".glb,.gltf" onChange={handleModelChange} />
                        <div className="flex items-center gap-2 border-2 border-gray-300 rounded-md p-2 border-dashed">
                            <span className="flex-1 text-sm text-gray-700">
                                {modelInfo?.originalFileName || '선택된 파일 없음'}
                            </span>
                            <Button type="button" onClick={() => modelInputRef.current?.click()}>
                                {modelInfo?.originalFileName ? '변경' : '파일 선택'}
                            </Button>
                        </div>
                        {isModelUploading && (
                            <p className="text-sm text-orange-600 mt-1">파일 업로드 중입니다...</p>
                        )}
                    </ModalFormItem>
                </ModalForm>
                <DialogFooter>
                    <Button type="button" onClick={resetForm} disabled={isProcessing} variant="outline">
                    취소
                    </Button>
                    <Button type="submit" disabled={isProcessing || !name || !code || !categoryId || !modelInfo}>
                        {isProcessing ? '처리 중...' : '등록'}
                    </Button>
                </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AssetCreateModal;