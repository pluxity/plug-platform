import { useState, useCallback } from 'react';
import { createStation } from '../api/station';
import { useFileUploader } from "@plug/v1/admin/pages/facility/hook/useFileUploader";
import { useFloorInfo } from "@plug/v1/admin/pages/facility/hook/useFloorInfo";

interface FacilityProps {
    onClose: () => void;
    onSuccess?: () => void;
}

interface StationFormValues {
    name: string;
    code: string;
    description: string;
    lineId: number;
    floorId: number;
    route: string;
}

const MESSAGES = {
    SUCCESS: '도면이 성공적으로 등록되었습니다.',
    ERROR: '도면 등록에 실패하였습니다.'
} as const;

export const useFacility = ({ onClose, onSuccess }: FacilityProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [facilityName, setFacilityName] = useState('');

    const {
        floors,
        error: floorError,
        handleFileUploadComplete
    } = useFloorInfo();

    const {
        files,
        isUploading,
        fileError,
        handleFileUpload,
        resetFiles
    } = useFileUploader(setFacilityName, handleFileUploadComplete);

    const resetForm = useCallback(() => {
        setFacilityName('');
        resetFiles();
        onClose();
    }, [onClose, resetFiles]);

    const handleFinish = useCallback(async (values: Record<string, string>) => {
        setIsLoading(true);
        try {
            const result = await createStation({
                facility: {
                    name: values.name,
                    code: values.code,
                    description: values.description,
                    drawingFileId: files.model.fileId,
                    thumbnailFileId: files.thumbnail.fileId
                },
                floors: [{
                    floorId: values.floorId,
                    name: values.name
                }],
                lineId: Number(values.lineId),
                route: ''
            });

            if (result) {
                alert(MESSAGES.SUCCESS);
                onSuccess?.();
                resetForm();
            }
        } catch (error) {
            console.error(MESSAGES.ERROR, error);
        } finally {
            setIsLoading(false);
        }
    }, [files, floors, onSuccess, resetForm]);

    return {
        isLoading,
        facilityName,
        files,
        isUploading,
        fileError,
        floorError,
        handleFileUpload,
        handleFinish,
        resetForm
    };
};