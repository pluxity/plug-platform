import { useState, useEffect } from 'react';
import { FileType } from '../types/file';
import { useFileUploader } from './useFileUploader';
import {useToastStore} from "@plug/v1/admin/components/hook/useToastStore";
import DateFormatter from "@plug/v1/app/utils/dateFormatter";
import { StationDetail, useDeleteStation, useStationDetailSWR, useUpdateStation } from '@plug/common-services';

interface FormValues {
  name: string;
  description: string;
  code: string;
  lineIds: string[];
  updatedBy: string;
  id: string;
  updatedAt: string;
  floors: Array<{ name: string; floorId: string }>;
  externalCode: string;
}

export const useStationDetail = (stationId: string) => {
  const [station, setStation] = useState<StationDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const {
    isUploading,
    fileError,
    handleFileUpload
  } = useFileUploader();

  const [formValues, setFormValues] = useState<FormValues>({
    name: '',
    description: '',
    code: '',
    lineIds: [],
    updatedBy: '',
    id: '',
    updatedAt: '',
    floors: [],
    externalCode: ''
  });

  const [fileStates, setFileStates] = useState({
    model: { fileId: null as number | null, file: null as File | null, originalFileName: '' },
    thumbnail: { fileId: null as number | null, file: null as File | null, originalFileName: '' }
  });

  const { data, error: detailError, mutate } = useStationDetailSWR(Number(stationId));
  const { execute: deleteStation, error: deleteError } = useDeleteStation(Number(stationId));
  const { execute: patchStation, error: updateError } = useUpdateStation(Number(stationId));
  const addToast = useToastStore((state) => state.addToast);

  const loadStationDetail = async () => {
    if (!data) return;

    try {
      setStation(data);
      initializeFormValues(data);
      initializeFileStates(data);
      if (detailError) {
        console.error('역사 정보를 불러오는데 실패했습니다:', error);
        addToast({
          title: '역사 정보 불러오기 실패',
          description: error.message || '역사 정보를 불러오는데 실패했습니다.',
          variant: 'critical',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const initializeFormValues = (data: StationDetail) => {
    setFormValues({
      name: data.facility.name || '',
      description: data.facility.description || '',
      code: data.facility.code || '',
      lineIds: data.lineIds.map(id => String(id)),
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
      if (name === 'lineIds') {
        const newValue = Array.isArray(value) ? value : [value];
        setFormValues(prev => ({
          ...prev,
          [name]: newValue
        }));
      } else {
        setFormValues(prev => ({
          ...prev,
          [name]: value
        }));
    }
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
      if (fileError) {
        addToast({
          title: '업로드 실패',
          description: fileError.message || '파일 업로드 중 오류가 발생했습니다.',
          variant: 'critical',
        });
      }
    } finally {
      setIsLoading(false);
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
          ...(fileStates.thumbnail.fileId && { thumbnailFileId: fileStates.thumbnail.fileId }),
        },
        lineIds: formValues.lineIds.map(id => Number(id)),
        floors: formValues.floors.map(floor => ({
          name: floor.name,
          floorId: floor.floorId,
        })),
        externalCode: formValues.externalCode,
      };

      const result = await patchStation({ id: Number(stationId), ...updateData });

      if (result) {
        await mutate();
        addToast({
          title: '수정 완료',
          description: '역사 정보가 수정되었습니다.',
          variant: 'normal',
        });
      }

      if (updateError) {
        addToast({
          title: '수정 실패',
          description: updateError.message,
          variant: 'critical',
        });
        console.error('수정 실패:', error);
      }
    } finally {
      setIsLoading(false);
    }
  }

  const handleDelete = async () => {
    try {
      const confirmed = confirm('정말 삭제하시겠습니까?');
      if (!confirmed) return;

      setIsLoading(true);
      await deleteStation();
      alert('성공적으로 삭제되었습니다.');
      window.location.href = '/admin/dashboard/facility';

      addToast({
        title: '삭제 완료',
        description: '역사 정보가 삭제되었습니다.',
        variant: 'normal',
      })

      if(deleteError) {
      addToast({
        title: '삭제 실패',
        description: deleteError.message,
        variant: 'critical',
      })}
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