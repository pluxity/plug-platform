import {Modal, Form, FormItem, Button, Input, Select} from '@plug/ui';
import React, { useCallback, useState } from 'react';
import { createStation } from "@plug/v1/admin/pages/facility/api/station";
import * as Px from "@plug/engine/src";
import {createFileFormData, useAssetCreate, useFileUpload, useLinesSWR} from "@plug/common-services";

const MESSAGES = {
    SUCCESS: '도면이 성공적으로 등록되었습니다.',
    ERROR: '도면 등록에 실패하였습니다.'
} as const;

export interface FacilityModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export const FacilityModal = ({ isOpen, onClose, onSuccess }: FacilityModalProps) => {
    const [isLoading, setIsLoading] = useState(false);

    Px.Model.GetModelHierarchy('http://192.168.4.29:9000/plug-platform/temp/dfff5d9b-8522-4ab3-9ea2-f39bfce95c08/0aee4358.glb', (data: unknown) => {console.log(data);});

    const [name, setName] = useState('');

    // 3d 모델 파일 상태 관리
    const [modelFile, setModelFile] = useState<File | null>(null);
    const [uploadedModelId, setUploadedModelId] = useState<number | null>(null);

    // thumbnail파일 상태 관리
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [uploadThumbnailId, setUploadThumbnailId] = useState<number | null>(null);


    // 파일 공통 로딩 상태 관리
    const [isUploading, setIsUploading] = useState(false);

    // 파일 업로드 훅
    const { execute: uploadFile, error: fileError } = useFileUpload();

    // 에셋 생성 훅
    useAssetCreate();

    // 3D 모델 파일 선택 핸들러
    const handleModelChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setModelFile(file);

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
                    setUploadedModelId(response.fileId);
                }
            })
            .catch(err => {
                console.error('3D 파일 업로드 실패:', err);
            })
            .finally(() => {
                setIsUploading(false);
            });
    }, [uploadFile, name]);

    // Thumbnail 파일 선택 핸들러
    const handleThumbnailChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // PNG 파일 체크 추가
        if (!file.type.includes('image/png')) {
            alert('PNG 파일만 업로드 가능합니다.');
            return;
        }

        setThumbnailFile(file);

        // 파일이 선택되면 자동으로 업로드 시작
        setIsUploading(true);

        // 올바른 MIME 타입으로 FormData 생성
        const formData = createFileFormData(file, 'image/png');
        uploadFile(formData)
            .then(response => {
                if (response && response.fileId) {
                    setUploadThumbnailId(response.fileId);
                }
            })
            .catch(err => {
                console.error('썸네일 파일 업로드 실패:', err);
            })
            .finally(() => {
                setIsUploading(false);
            });
    }, [uploadFile]);

    // 폼 초기화
    const resetForm = () => {
        setName('');
        setModelFile(null);
        setUploadedModelId(null);
        setUploadThumbnailId(null);
        onClose();
    };

    const error = fileError;

    // 파일 선택기 열기
    const openFilePicker = (type: 'model' | 'thumbnail') => {
        const fileInput = document.getElementById(type === 'model' ? 'icon-file' : 'thumbnail-file');
        if (fileInput) {
            fileInput.click();
        }
    };

    const { data:lines } = useLinesSWR();

    const handleFinish = useCallback(async (values: Record<string, string>) => {
        setIsLoading(true);

        try {
            const result = await createStation({
                facility: {
                    name: values.name,
                    code: values.code,
                    description: values.description,
                    drawingFileId: uploadedModelId,
                    thumbnailFileId: uploadThumbnailId
                },
                floors: [{
                    name: values.name,
                    floorId: 0,
                }],
                lineId: Number(values.lineId),
                route: ''
            });

            if (result) {
                alert(MESSAGES.SUCCESS);
                onClose();
                onSuccess?.();
                resetForm();
            }
        } catch (error) {
            console.error(MESSAGES.ERROR, error);
        } finally {
            setIsLoading(false);
        }
    }, [onClose, onSuccess]);

    return (
        <Modal
            title="도면 등록"
            isOpen={isOpen}
            onClose={isLoading ? undefined : onClose}
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
                    <FormItem name="name" label="도면 이름" required>
                        <Input.Text placeholder="도면 이름을 입력하세요" />
                    </FormItem>
                    
                    <FormItem name="code" label="도면 코드" required>
                        <Input.Text placeholder="도면 코드를 입력하세요" />
                    </FormItem>

                    <FormItem name="description" label="도면 설명" required>
                        <Input.Text placeholder="도면 설명을 입력하세요" />
                    </FormItem>

                    <FormItem name="drawingField" label='3D 모델 파일' required>
                        <div className="border-2 border-dashed border-gray-300 rounded-md p-4">
                            <input type="file" id="icon-file"
                                className="hidden"
                                onChange={handleModelChange}
                                accept=".glb,.gltf"
                            />

                            {!modelFile ? (
                                <div className="flex items-center">
                                    <Button
                                        type="button"
                                        color="secondary"
                                        className="w-30"
                                        onClick={() => openFilePicker('model')}
                                    >
                                        파일 선택
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between w-full">
                  <span className="text-sm truncate max-w-xs">
                    {modelFile.name} ({Math.round(modelFile.size / 1024)} KB)
                  </span>

                                    {isUploading ? (
                                        <div className="h-4 w-4 border-2 border-t-primary-500 rounded-full animate-spin"></div>
                                    ) : uploadedModelId ? (
                                        <div className="text-green-500 text-xs">업로드 완료</div>
                                    ) : (
                                        <Button
                                            type="button"
                                            color="secondary"
                                            className="w-30"
                                            onClick={() => openFilePicker('model')}
                                        >
                                            변경
                                        </Button>
                                    )}
                                </div>
                            )}
                        </div>
                    </FormItem>

                    <FormItem name="thumbnailField" label='썸네일 파일' required>
                        <div className="border-2 border-dashed border-gray-300 rounded-md p-4">
                            <input type="file"
                                   id="thumbnail-file"
                                   className="hidden"
                                   onChange={handleThumbnailChange}
                                   accept=".png"
                            />

                            {!thumbnailFile ? (
                                <div className="flex items-center">
                                    <Button
                                        type="button"
                                        color="secondary"
                                        className="w-30"
                                        onClick={() => openFilePicker('thumbnail')}
                                    >
                                        파일 선택
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between w-full">
                  <span className="text-sm truncate max-w-xs">
                    {thumbnailFile.name} ({Math.round(thumbnailFile.size / 1024)} KB)
                  </span>

                                    {isUploading ? (
                                        <div className="h-4 w-4 border-2 border-t-primary-500 rounded-full animate-spin"></div>
                                    ) : uploadThumbnailId ? (
                                        <div className="text-green-500 text-xs">업로드 완료</div>
                                    ) : (
                                        <Button
                                            type="button"
                                            color="secondary"
                                            className="w-30"
                                            onClick={() => openFilePicker('thumbnail')}
                                        >
                                            변경
                                        </Button>
                                    )}
                                </div>
                            )}
                        </div>
                    </FormItem>

                    <FormItem name="lineId" label=' 해당호선' required>
                        <Select>
                            <Select.Trigger />
                            <Select.Content>
                                {lines?.map((line) => (
                                    <Select.Item key={line.id} value={String(line.id)}>
                                        {line.name}
                                    </Select.Item>
                                ))}
                            </Select.Content>
                        </Select>
                    </FormItem>

                    <div className="mt-6 flex justify-center gap-2">
                        <Button 
                            type="button" 
                            onClick={onClose} 
                            disabled={isLoading}
                        >
                            취소
                        </Button>
                        <Button 
                            type="submit" 
                            color="primary" 
                            disabled={isLoading}
                            isLoading={isLoading}
                        >
                            등록
                        </Button>
                    </div>
                </Form>
            </div>
        </Modal>
    );
}