import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '@/backoffice/common/view/layouts';
import { useFacilityListStore, } from './store/FacilityListStore';
import { useDetail } from "@plug/common-services";
import { FacilityForm } from "@/backoffice/domains/facility/plugin/FacilityForm";

const FacilityDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const isEditMode = searchParams.get('mode') === 'edit';
  const navigate = useNavigate();

  const {
    selectedType,
    selectedId,
    setSelected,
    previousRoute
  } = useFacilityListStore();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    data: buildingData,
    isLoading: isBuildingLoading,
    error: buildingError
  } = useDetail('buildings',Number(id));

  const {
    data: stationData,
    isLoading: isStationLoading,
    error: stationError
  } = useDetail('buildings', Number(id));

  useEffect(() => {
    if (!id) return;

    if (selectedId === id) {
      setIsLoading(
        selectedType === 'buildings' ? isBuildingLoading :
          selectedType === 'stations' ? isStationLoading : false
      );

      return;
    }
    if (!selectedType || selectedType === 'facilities') {
      if (!isBuildingLoading && buildingData) {
        setSelected('buildings', id);
        setIsLoading(false);
        return;
      }

      if (!isStationLoading && stationData) {
        setSelected('stations', id);
        setIsLoading(false);
        return;
      }

      if (!isBuildingLoading && !isStationLoading && !buildingData && !stationData) {
        setError('시설을 찾을 수 없습니다.');
        setIsLoading(false);
      }

      setIsLoading(isBuildingLoading || isStationLoading);
    }
  }, [
    id, selectedId, selectedType, setSelected,
    buildingData, stationData,
    isBuildingLoading, isStationLoading,
    buildingError, stationError
  ]);

  const handleBack = () => {
    if (previousRoute) {
      navigate(previousRoute.path);
    } else {
      navigate('/admin/facility');
    }
  };

  const handleSaveSuccess = () => {
    if (isEditMode) {
      navigate(`/admin/facility/${id}`);
    } else {
      handleBack();
    }
  };

  if (isLoading) {
    return (
      <PageContainer title="시설 상세 정보">
        <div className="flex justify-center items-center h-64">
          <p>로딩 중...</p>
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer title="시설 상세 정보">
        <div className="bg-red-50 border border-red-200 p-4 rounded-md">
          <h2 className="text-red-700 text-lg font-medium mb-2">오류 발생</h2>
          <p className="text-red-600">{error}</p>
          <button
            onClick={handleBack}
            className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md"
          >
            목록으로 돌아가기
          </button>
        </div>
      </PageContainer>
    );
  }

  const renderForm = () => {
    switch (selectedType) {
      case 'buildings':
        return (
          <FacilityForm
            onSaveSuccess={handleSaveSuccess}
            facilityType={"buildings"}
          />
        );
      case 'stations':
        return (
          <FacilityForm
            onSaveSuccess={handleSaveSuccess}
            facilityType={"stations"}
          />
        );
      default:
        return (
          <div className="bg-orange-50 border border-orange-200 p-4 rounded-md">
            <h2 className="text-orange-700 text-lg font-medium mb-2">
              알 수 없는 시설 유형
            </h2>
            <p className="text-orange-600">
              해당 시설의 유형을 확인할 수 없습니다.
            </p>
            <button
              onClick={handleBack}
              className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              목록으로 돌아가기
            </button>
          </div>
        );
    }
  };

  return (
    <PageContainer
      title={isEditMode ? "시설 편집" : "시설 상세 정보"}
    >
      {renderForm()}
    </PageContainer>
  );
};

export default FacilityDetailPage;