import { useState, useCallback } from 'react';
import { createStation } from '../api/station';
import { useFileUploader } from "@plug/v1/admin/pages/facility/hook/useFileUploader";
import {FileType} from "@plug/v1/admin/pages/facility/types/file";

interface FacilityProps {
    onClose: () => void;
    onSuccess?: () => void;
}

const MESSAGES = {
    SUCCESS: '도면이 성공적으로 등록되었습니다.',
    ERROR: '도면 등록에 실패하였습니다.'
} as const;

export const useFacility = ({ onClose, onSuccess }: FacilityProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [facilityName, setFacilityName] = useState('');

    const {
        files,
        modelData,
        resetModelData,
        isUploading,
        fileError,
        handleFileUpload: originalHandleFileUpload,
        resetFiles
    } = useFileUploader(setFacilityName);

    const handleFileUpload = async (
        event: React.ChangeEvent<HTMLInputElement>,
        fileType: FileType
    ) => {
        const result = await originalHandleFileUpload(event, fileType);
        return result;
    };

    const resetForm = useCallback(() => {
        setFacilityName('');
        resetFiles();
        resetModelData();
        onClose();
    }, [onClose, resetFiles, resetModelData]);


    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleFinish = useCallback(async (values: Record<string, any>) => {
        setIsLoading(true);
        try {
            
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const floors = values.floors.map((item: any) => {
                const parsed = JSON.parse(item);
                return {
                    floorId: parsed.floorId,
                    name: parsed.name
                }
            });

            const lineIds = Array.isArray(values.linesId)
                ? values.linesId.map(Number)
                : [Number(values.linesId)];

            const result = await createStation({
                facility: {
                    name: values.name,
                    code: values.code,
                    description: values.description,
                    drawingFileId: files.model.fileId,
                    thumbnailFileId: files.thumbnail.fileId
                },
                floors: floors,
                lineIds: lineIds,
                route: '',
                externalCode: values.externalCode
            });

            if (result) {
                alert(MESSAGES.SUCCESS);
                onSuccess?.();
                resetForm();
                onClose();
                window.location.reload();
            }
        } catch (error) {
            console.error(MESSAGES.ERROR, error);
        } finally {
            setIsLoading(false);
        }
    }, [files.model.fileId, files.thumbnail.fileId, onClose, onSuccess, resetForm]);

    return {
        isLoading,
        facilityName,
        files,
        isUploading,
        fileError,
        handleFileUpload,
        handleFinish,
        resetForm,
        modelData
    };

};