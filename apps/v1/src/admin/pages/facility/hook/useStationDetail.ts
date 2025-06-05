import { useState, useEffect } from 'react';
import { FileType } from '../types/file';
import { useFileUploader } from './useFileUploader';
import DateFormatter from "@plug/v1/app/utils/dateFormatter";
import { StationDetail, useDeleteStation, useStationDetailSWR, useUpdateStation } from '@plug/common-services';

export const useStationDetail = (stationId: string) => {
  const [station, setStation] = useState<StationDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const {
    isUploading,
    fileError,
    handleFileUpload
  } = useFileUploader();

  const [formValues, setFormValues] = useState({
    name: '',
    description: '',
    code: '',
    lineIds: [] as string[],
    updatedBy: '',
    id: '',
    updatedAt: '',
    floors: [] as Array<{ name: string; floorId: string }>,
    externalCode: ''
  });

  const [fileStates, setFileStates] = useState({
    model: { fileId: null as number | null, file: null as File | null, originalFileName: '' },
    thumbnail: { fileId: null as number | null, file: null as File | null, originalFileName: '' }
  });

  const { data } = useStationDetailSWR(Number(stationId));
  const { execute: deleteStation } = useDeleteStation(Number(stationId));
  const { execute: patchStation } = useUpdateStation(Number(stationId));

  const loadStationDetail = async () => {
    if (!data) return;

    try {
      setStation(data);
      initializeFormValues(data);
      initializeFileStates(data);
    } catch (error) {
      console.error('역사 정보를 불러오는데 실패했습니다:', error);
    }
  };

  const initializeFormValues = (data: StationDetail) => {
    setFormValues({
      name: data.facility.name || '',
      description: data.facility.description || '',
      code: data.facility.code || '',
      lineIds: data.lineIds.map(String) || [],
      updatedBy: data.facility.updatedBy || '',
      id: data.facility.id.toString(),
      updatedAt: DateFormatter(data.facility.updatedAt),
      floors: data.floors.map((floor) => ({
        name: floor.name,
        floorId: String(floor.floorId),
      })),
      externalCode: data.externalCode || '',
    });
  };

  const initializeFileStates = (data: StationDetail) => {
    setFileStates({
      model: {
        fileId: data.facility.drawing.id,
        file: null,
        originalFileName: data.facility.drawing.originalFileName,
      },
      thumbnail: {
        fileId: data.facility.thumbnail.id,
        file: null,
        originalFileName: data.facility.thumbnail.originalFileName,
      },
    });
  };

  useEffect(() => {
    if (data) {
      loadStationDetail();
    }
  }, [data, stationId]);

  const handleChange = (name: string, value: string | string[]) => {
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>, type: FileType) => {
    try {
      const fileId = await handleFileUpload(event, type);
      if (fileId && event.target.files?.[0]) {
        setFileStates(prev => ({
          ...prev,
          [type]: {
            fileId,
            file: event.target.files![0],
            originalFileName: event.target.files![0].name
          }
        }));
      }
    } catch (error) {
      console.error(`${type} 파일 업로드 실패:`, error);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const updateData = {
        facility: {
          name: formValues.name,
          description: formValues.description,
          code: formValues.code,
          ...(fileStates.model.fileId && { drawingFileId: fileStates.model.fileId }),
          ...(fileStates.thumbnail.fileId && { thumbnailFileId: fileStates.thumbnail.fileId })
        },
        lineIds: formValues.lineIds.map(Number),
        floors: formValues.floors.map(floor => ({
          name: floor.name,
          floorId: floor.floorId // floorId를 문자열로 유지
        })),
        externalCode: formValues.externalCode,
      };

      await patchStation({ id: Number(stationId), ...updateData });
      await loadStationDetail();
    } catch (error) {
      console.error('수정 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const confirmed = confirm('정말 삭제하시겠습니까?');
      if (!confirmed) return;

      setIsLoading(true);
      await deleteStation();
      alert('성공적으로 삭제되었습니다.');
      window.location.href = '/admin/dashboard/facility';
    } catch (error) {
      console.error('삭제 실패:', error);
      alert('삭제에 실패했습니다.');
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