import React, { useState, useCallback } from 'react';

import { Modal, Form, FormItem, Button, Input } from '@plug/ui';
import type { AssetCreateRequest } from '@plug/common-services';
import { usePost } from '@plug/api-hooks';
import { useFileUpload, createFileFormData } from '@plug/common-services';

export interface PoiIconRegistProps{
    isOpen: boolean;
    onClose: () => void;
    mode: 'create' | 'edit';
    onSuccess?: () => void;
}

export const PoiIconRegistModal = ({ isOpen, onClose, onSuccess }: PoiIconRegistProps) =>{
  const [name, setName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedFileId, setUploadedFileId] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // 파일 업로드 훅
  const { execute: uploadFile, isLoading: isFileUploading, error: fileError } = 
    useFileUpload();
  
  // 에셋 생성 훅
  const { execute: createAsset, isLoading: isAssetCreating, error: assetError } = 
    usePost<null, AssetCreateRequest>('assets');

  // 파일 선택 핸들러
  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    
    // 파일명을 기본 이름 값으로 설정
    if (!name) {
      setName(file.name.replace(/\.[^/.]+$/, "")); // 확장자 제거
    }

    // GLB 파일인지 확인하고 적절한 MIME 타입 설정
    const mimeType = file.name.endsWith('.glb') ? 'model/gltf-binary' : 
                    file.name.endsWith('.gltf') ? 'model/gltf+json' : 
                    undefined;
    
    // 파일이 선택되면 자동으로 업로드 시작
    setIsUploading(true);
    // 올바른 MIME 타입으로 FormData 생성
    const formData = createFileFormData(file, mimeType);
    uploadFile(formData)
      .then(response => {
        if (response && response.fileId) {
          setUploadedFileId(response.fileId);
        }
      })
      .catch(err => {
        console.error('파일 업로드 실패:', err);
      })
      .finally(() => {
        setIsUploading(false);
      });
  }, [uploadFile, name]);

  // 제출 핸들러
  const handleFinish = useCallback(async (values: Record<string, string>) => {
    if (!uploadedFileId) {
      alert('파일을 먼저 업로드해주세요.');
      return;
    }

    try {
      // 에셋 생성 API 호출
      const asset = await createAsset({
        name: values.poiIconRegistName || name,
        fileId: uploadedFileId
      });

      // 성공 처리
      if (asset) {
        alert('아이콘이 성공적으로 등록되었습니다.');
        resetForm();
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      console.error('아이콘 등록 실패:', error);
    }
  }, [createAsset, uploadedFileId, name, onSuccess]);

  // 폼 초기화
  const resetForm = () => {
    setName('');
    setSelectedFile(null);
    setUploadedFileId(null);
    onClose();
  };

  // 에러 메시지 표시
  const error = fileError || assetError;
  const isProcessing = isFileUploading || isAssetCreating;

  // 파일 선택기 열기
  const openFilePicker = () => {
    const fileInput = document.getElementById('icon-file');
    if (fileInput) {
      fileInput.click();
    }
  };
  
  return (
    <Modal
      title="3D 모델 등록"
      isOpen={isOpen}
      onClose={isProcessing ? undefined : onClose}
      closeOnOverlayClick={false}
      overlayClassName="bg-black/50"
    >
      <div className="p-4">
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md">
            {error.message}
          </div>
        )}

        <Form onSubmit={handleFinish}>
          <FormItem name="poiIconRegistName" label='이름' required>
            <Input.Text 
              value={name}
              onChange={value => setName(value)}
              placeholder="모델 이름을 입력하세요"
            />
          </FormItem>
          
          <FormItem name="poiIconRegistFile" label='3D 모델 파일' required>
            <div className="border-2 border-dashed border-gray-300 rounded-md p-4">
              <input
                type="file"
                id="icon-file"
                className="hidden"
                onChange={handleFileChange}
                accept=".glb,.gltf"
              />
              
              {!selectedFile ? (
                <div className="flex items-center">
                  <p className="flex-1 text-sm text-gray-500">GLB, GLTF 파일만 가능합니다.</p>
                  <Button 
                    type="button" 
                    color="secondary"
                    className="w-30"
                    onClick={openFilePicker}
                  >
                    파일 선택
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between w-full">
                  <span className="text-sm truncate max-w-xs">
                    {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                  </span>
                  
                  {isUploading ? (
                    <div className="h-4 w-4 border-2 border-t-primary-500 rounded-full animate-spin"></div>
                  ) : uploadedFileId ? (
                    <div className="text-green-500 text-sm">✓ 업로드 완료</div>
                  ) : (
                    <Button 
                      type="button" 
                      color="secondary"
                      className="w-30"
                      onClick={openFilePicker}
                    >
                      변경
                    </Button>
                  )}
                </div>
              )}
            </div>
          </FormItem>
          
          <div className="mt-6 flex justify-center gap-2">
            <Button onClick={resetForm} disabled={isProcessing}>취소</Button>
            <Button 
              type="submit" 
              color="primary" 
              disabled={isProcessing || !uploadedFileId || !name}
              isLoading={isAssetCreating}
            >
              등록
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
} 
