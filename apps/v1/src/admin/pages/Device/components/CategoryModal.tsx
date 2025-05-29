import { Modal, Form, FormItem, Button, Input } from '@plug/ui';
import { useCallback, useState, useEffect } from 'react';
import { useFileUpload, createFileFormData, useCreateCategory, useCategoryDetailSWR, useUpdateCategory } from '@plug/common-services';

export interface CategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    mode: 'create' | 'edit';
    selectedCategoryId?: number;
}

export const CategoryModal = ({ isOpen, onClose, onSuccess, mode, selectedCategoryId }: CategoryModalProps) => {
    // 디바이스 카테고리 상태 관리
    const [name, setName] = useState<string>('');

    // 디바이스 카테고리 아이콘 상태 관리 
    const [iconFile, setIconFile] = useState<File | null>(null);
    const [uploadIconFileId, setUploadIconFileId] = useState<number | null>(null);

    // 디바이스 카테고리 아이콘 파일 로딩 상태 관리 
    const [isUploading, setIsUploading] = useState(false);

    // 다비이스 카테고리 아이콘 업로드 훅 
    const { execute: uploadFile, isLoading: isFileUploading, error: fileError } = useFileUpload();
   
    // 디바이스 카테고리 생성 훅
    const { execute: createCategory, isLoading: isCreating, error: createError } = useCreateCategory();

    // 디바이스 카테고리 상세 조회 훅
    const { data: detailCategoryData } = useCategoryDetailSWR(mode === 'edit' && selectedCategoryId ? Number(selectedCategoryId) : 0);

    // 디바이스 카테고리 수정 훅
    const { execute: updateCategory, isLoading: isCategoryUpdating, error: categoryUpdateError } = useUpdateCategory(Number(selectedCategoryId));

    // 파일 아이콘 선택 핸들러 
    const handleIconFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
    
        // IMAGE 파일 체크 추가
        if (!file.type.includes('image/')) {
          alert('image 파일 업로드 가능합니다.');
          return;
        }
    
        setIconFile(file);
    
        // 파일이 선택되면 자동으로 업로드 시작
        setIsUploading(true);
    
        // 올바른 MIME 타입으로 FormData 생성
        const formData = createFileFormData(file, file.type);
        uploadFile(formData)
          .then(response => {
            if (response && response.fileId) {
                setUploadIconFileId(response.fileId);
            }
          })
          .catch(error => {
            console.error('디바이스 카테고리 아이콘 업로드 실패:', error);
          })
          .finally(() => {
            setIsUploading(false);
          });
      }, [uploadFile]);


      useEffect(() => {
        if(mode === 'edit' && detailCategoryData && isOpen){
            setName(detailCategoryData.name);
        }
      }, [mode, detailCategoryData, isOpen]);

    // 제출 핸들러
    const handleFinish = useCallback(async (values: Record<string, string>) => {
        // 수정 모달 제출
        if (mode === 'edit' && detailCategoryData) {
            try {
                const category = await updateCategory({
                    name: values.name || name,
                    iconFileId: uploadIconFileId || undefined, 
                });

                if (category) {
                    alert('디바이스 카테고리가 성공적으로 수정되었습니다.');
                    resetForm();
                    if (onSuccess) onSuccess();
                }
            } catch (error) {
                console.error('디바이스 카테고리 수정 실패:', error);
            }
        } else {
            // 등록 모달 제출
            if (!uploadIconFileId) {
                alert('아이콘 파일을 업로드해주세요.');
                return;
            }
            try {
                const line = await createCategory({
                    name: values.name,
                    iconFileId: uploadIconFileId,
                });

                if (line) {
                    alert('디바이스 카테고리가 성공적으로 등록되었습니다.');
                    if (onSuccess) onSuccess();
                    resetForm(); 
                }
            } catch (error) {
                console.error('디바이스 카테고리 등록 실패:', error);
            }
        }
    }, [createCategory, updateCategory, detailCategoryData, onSuccess, name, uploadIconFileId, mode]);

    // 폼 초기화
    const resetForm = () => {
        setName('');
        setIconFile(null);
        setUploadIconFileId(null);
        onClose();
    };

    // 에러 처리
    const error = createError || fileError || categoryUpdateError;
    const isProcessing = isCreating || isFileUploading || isCategoryUpdating;

      // 파일 선택기 열기
    const openFilePicker = () => {
        const fileInput = document.getElementById('icon-file');
        if (fileInput) {
        fileInput.click();
        }
    };

    return (
        <Modal
            title={mode === 'create' ? '디바이스 카테고리 등록' : '디바이스 카테고리 수정'}
            isOpen={isOpen}
            onClose={isProcessing ? undefined : resetForm}
            closeOnOverlayClick={false}
            overlayClassName="bg-black/50"
        >
            <Form
                key={mode + (detailCategoryData?.id ?? '')}
                initialValues={
                    mode === 'edit' && detailCategoryData
                    ? {
                        name: detailCategoryData?.name,
                        iconFile: String(detailCategoryData?.iconFile.id)
                    }
                    : {
                        name: '',
                        iconFile: ''
                    }
                }
                onSubmit={handleFinish}
            >
                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md">
                        {error.message}
                    </div>
                )}
                <FormItem name="name" label="카테고리명" required>
                    <Input.Text
                        placeholder="카테고리 이름을 입력하세요"
                        value={name}
                        onChange={value => setName(value)}
                    />
                </FormItem>

                <FormItem name="iconFile" label="카테고리 아이콘 파일" required>
                    <div className="border-2 border-dashed border-gray-300 rounded-md p-4">
                        <input
                            type="file"
                            id="icon-file"
                            className="hidden"
                            onChange={handleIconFileChange}
                            accept="image/*"
                        />

                        {!iconFile ? (
                            <div className="flex items-center">
                                {mode === 'edit' && detailCategoryData 
                                    ? <p className="flex-1 text-sm">{detailCategoryData.iconFile?.originalFileName}</p>     
                                    : <p className="flex-1 text-sm text-gray-500">IMAGE 파일 업로드</p>
                                    }
                                <Button 
                                type="button" 
                                color="secondary"
                                className="w-30"
                                onClick={() => openFilePicker()}
                                >
                                {mode === 'edit' ? '변경' : '파일 선택'}
                                </Button>
                            </div>
                            ) : (
                            <div className="flex items-center justify-between w-full">
                                <span className="text-sm truncate max-w-xs">
                                {iconFile.name} ({Math.round(iconFile.size / 1024)} KB)
                                </span>
                                
                                {isUploading ? (
                                <div className="h-4 w-4 border-2 border-t-primary-500 rounded-full animate-spin"></div>
                                ) : uploadIconFileId ? (
                                <div className="text-green-500 text-xs">업로드 완료</div>
                                ) : (
                                <Button 
                                    type="button" 
                                    color="secondary"
                                    className="w-30"
                                    onClick={() => openFilePicker()}
                                >
                                    변경
                                </Button>
                                )}
                            </div>
                        )}
                   </div>
                </FormItem>


                <div className="mt-6 flex justify-center gap-2">
                    <Button type="button" onClick={resetForm} disabled={isProcessing}>
                        취소
                    </Button>
                    <Button
                        type="submit"
                        color="primary"
                        isLoading={isProcessing}
                        >
                        {mode === 'create' ? '등록' : '수정'}
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};
