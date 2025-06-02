import {useState, useEffect} from 'react';
import {FileState, FileType} from '../types/file';
import {useFileUploader} from './useFileUploader';
import DateFormatter from "@plug/v1/app/utils/dateFormatter";
import {
    StationDetail,
    StationFormValues,
    useDeleteStation,
    useStationDetailSWR,
    useUpdateStation
} from "@plug/common-services";
import {useToastStore} from "@plug/v1/admin/components/hook/useToastStore";
import {useNavigate} from "react-router-dom";

interface StationFileStates {
    model: FileState;
    thumbnail: FileState;
}

const initialFormValues: StationFormValues = {
    name: '',
    description: '',
    code: '',
    lineIds: [],
    updatedBy: '',
    id: '',
    updatedAt: '',
    floors: [],
    externalCode: ''
};

const initialFileStates: StationFileStates = {
    model: {fileId: null, file: null},
    thumbnail: {fileId: null, file: null}
};

export const useStationDetail = (stationId: string) => {
    const [station, setStation] = useState<StationDetail | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [formValues, setFormValues] = useState<StationFormValues>(initialFormValues);
    const [fileStates, setFileStates] = useState<StationFileStates>(initialFileStates);

    const {data} = useStationDetailSWR(Number(stationId));
    const {execute: deleteStation} = useDeleteStation(Number(stationId));
    const {execute: patchStation} = useUpdateStation(Number(stationId));
    const {isUploading, fileError, handleFileUpload} = useFileUploader();

    const addToast = useToastStore((state) => state.addToast);
    const navigate = useNavigate();

    const handleError = (action: string, error: Error) => {
        console.error(`${action} 실패:`, error);
        addToast({
            variant: 'critical',
            title: `${action} 실패`,
            description: error.message || `${action}에 실패했습니다.`
        });
    };

    const updateStationData = (stationData: StationDetail) => {
        setStation(stationData);
        setFormValues({
            name: stationData.facility.name,
            description: stationData.facility.description,
            code: stationData.facility.code || '',
            lineIds: stationData.lineIds.map(String),
            updatedBy: stationData.facility.updatedBy,
            id: stationData.facility.id.toString(),
            updatedAt: DateFormatter(stationData.facility.updatedAt),
            floors: stationData.floors.map(floor => ({
                name: floor.name,
                floorId: String(floor.floorId)
            })),
            externalCode: stationData.externalCode || ''
        });

        setFileStates({
            model: {
                fileId: stationData.facility.drawing.id,
                file: null
            },
            thumbnail: {
                fileId: stationData.facility.thumbnail.id,
                file: null
            }
        });
    };

    useEffect(() => {
        if (data) {
            updateStationData(data);
        }
    }, [data]);

    const handleChange = (name: string, value: string | string[]) => {
        setFormValues(prev => ({...prev, [name]: value}));
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>, type: FileType) => {
        try {
            const fileId = await handleFileUpload(event, type);
            const file = event.target.files?.[0];
            if (fileId && file) {
                setFileStates(prev => ({
                    ...prev,
                    [type]: {fileId, file}
                }));
                addToast({
                    variant: 'normal',
                    description: `${type === 'model' ? '모델' : '썸네일'} 파일이 업로드되었습니다.`
                });
            }
        } catch (error) {
            handleError(`${type} 파일 업로드`, error as Error);
        }
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const updateData = {
                id: Number(stationId),
                facility: {
                    name: formValues.name,
                    description: formValues.description,
                    code: formValues.code,
                    ...(fileStates.model.fileId && {drawingFileId: fileStates.model.fileId}),
                    ...(fileStates.thumbnail.fileId && {thumbnailFileId: fileStates.thumbnail.fileId})
                },
                lineIds: formValues.lineIds.map(Number),
                floors: formValues.floors,
                externalCode: formValues.externalCode,
            };

            await patchStation(updateData);
            if (data) {
                updateStationData(data);
            }
            addToast({
                variant: 'normal',
                title: '수정 완료',
                description: '역사 정보가 성공적으로 수정되었습니다.'
            });
        } catch (error) {
            handleError('수정', error as Error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('정말 삭제하시겠습니까?')) return;

        setIsLoading(true);
        try {
            await deleteStation();
            addToast({
                variant: 'normal',
                title: '삭제 완료',
                description: '역사가 성공적으로 삭제되었습니다.'
            });
          navigate('/admin/dashboard/facility');
        } catch (error) {
            handleError('삭제', error as Error);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        station,
        formValues,
        fileStates,
        isLoading,
        isUploading,
        fileError,
        handleChange,
        handleFileChange,
        handleSubmit,
        handleDelete
    };
};