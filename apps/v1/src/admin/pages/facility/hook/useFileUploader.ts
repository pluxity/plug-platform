import { useState } from 'react';
import { createFileFormData, useFileUpload } from '@plug/common-services';
import { FileState, FileType } from '../types/file';

export const useFileUploader = (
    onNameSet?: (name: string) => void,
) => {
    const [files, setFiles] = useState<Record<FileType, FileState>>({
        model: { file: null, fileId: null },
        thumbnail: { file: null, fileId: null }
    });
    const [isUploading, setIsUploading] = useState(false);
    const { execute: uploadFile, error: fileError } = useFileUpload();

    const handleFileUpload = async (
        event: React.ChangeEvent<HTMLInputElement>,
        fileType: FileType
    ) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (fileType === 'thumbnail' && !file.type.includes('image/')) {
            alert('이미지 파일만 업로드 가능합니다.');
            return;
        }

        if (fileType === 'model' && onNameSet) {
            onNameSet(file.name.replace(/\.[^/.]+$/, ""));
        }

        const mimeType = fileType === 'model'
            ? file.name.endsWith('.glb') ? 'model/gltf-binary' : 'model/gltf+json'
            : file.type;

        setIsUploading(true);
        try {
            const formData = createFileFormData(file, mimeType);
            const response = await uploadFile(formData);

            setFiles(prev => ({
                ...prev,
                [fileType]: {
                    file
                }
            }));

            return response;
        } catch (err) {
            console.error(`${fileType} 파일 업로드 실패:`, err);
        } finally {
            setIsUploading(false);
        }
    };

    return {
        files,
        isUploading,
        fileError,
        handleFileUpload,
        resetFiles: () => setFiles({ model: { file: null, fileId: null }, thumbnail: { file: null, fileId: null } }),
    };
};