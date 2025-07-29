import React, { useEffect, useState, useRef } from 'react';
import { useParams, useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { PageContainer } from '@/backoffice/common/view/layouts';
import { FacilityType, useFacilityListStore } from "./store/FacilityListStore";
import { useHistory, FacilityDrawingUpdateRequest } from "@plug/common-services";
import { FacilityDetailLayout } from "@/backoffice/domains/facility/components/layout/FacilityDetailLayout";
import { FacilityUpdateRequest } from "@/backoffice/domains/facility/types/facilityTypeGuard";
import { api } from "@plug/api-hooks";

const FacilityDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const isEditMode = searchParams.get('mode') === 'edit';
  const navigate = useNavigate();
  const mountedRef = useRef(false);

  const getFacilityTypeFromPath = (): FacilityType | null => {
    const pathSegments = location.pathname.split('/');
    const facilityIndex = pathSegments.findIndex(segment => segment === 'facility');
    if (facilityIndex >= 0 && facilityIndex + 1 < pathSegments.length) {
      const type = pathSegments[facilityIndex + 1];
      if (type === 'buildings' || type === 'stations') {
        return type;
      }
    }
    return null;
  };

  const facilityType = getFacilityTypeFromPath();
  const { selectedId, setSelected, previousRoute } = useFacilityListStore();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [facilityData, setFacilityData] = useState<any>(null);
  const [facilityError, setFacilityError] = useState<any>(null);
  const [formData, setFormData] = useState<FacilityUpdateRequest>({
    facility: {
      name: '',
      description: '',
      code: '',
      thumbnailFileId: 0
    }
  });

  const facilityId = id ? Number(id) : 0;

  const fetchFacilityData = async () => {
    if (!facilityType || !facilityId) {
      console.log('API 호출 중단: facilityType 또는 facilityId가 없음');
      return;
    }
    
    try {
      console.log(`API 호출 시작: /api/v1/${facilityType}/${facilityId}`);
      setIsLoading(true);
      
      const response = await api.get(`${facilityType}/${facilityId}`, { requireAuth: true });
      console.log('API 응답:', response);
      
      if (response && 'data' in response) {
        setFacilityData(response.data);
      } else {
        setFacilityData(response);
      }
      
      setFacilityError(null);
    } catch (error) {
      console.error('시설 데이터 로드 오류:', error);
      setFacilityError(error);
      setFacilityData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      console.log('=== 컴포넌트 최초 마운트 ===');
    }
    
    if (!id || !facilityType) {
      setIsLoading(false);
      if (!facilityType) {
        setError('URL에서 시설 유형을 찾을 수 없습니다.');
      }
      return;
    }
    
    console.log(`데이터 로드 시작 - facilityType: ${facilityType}, id: ${id}`);
    fetchFacilityData();
    return () => {
      console.log('=== 컴포넌트 언마운트 ===');
    };
  }, [id, facilityType]);

  useEffect(() => {
    if (facilityData && selectedId !== id && id) {
      if (facilityType) {
        console.log(`선택 상태 업데이트: ${facilityType}, ${id}`);
        setSelected(facilityType, id);
      }
    }
  }, [facilityData, id, facilityType, selectedId, setSelected]);

  const { data: historyData, mutate: mutateHistoryData } = useHistory(facilityType, facilityId);

  const mutateFacilityData = async () => {
    console.log('시설 데이터 뮤테이션 시작');
    await fetchFacilityData();
  };

  const deleteFacility = async () => {
    if (!facilityType) {
      throw new Error('시설 유형이 정의되지 않았습니다.');
    }
    try {
      console.log(`삭제 API 호출: /api/v1/${facilityType}/${facilityId}`);
      await api.delete(`/api/v1/${facilityType}/${facilityId}`, { requireAuth: true });
      return true;
    } catch (error) {
      console.error('시설 삭제 오류:', error);
      throw error;
    }
  };

  const updateFacility = async (data: FacilityUpdateRequest) => {
    try {
      if (!facilityType) {
        throw new Error('시설 유형이 정의되지 않았습니다.');
      }
      console.log(`업데이트 API 호출: /api/v1/${facilityType}/${facilityId}`, data);
      await api.put(`/api/v1/${facilityType}/${facilityId}`, data, { requireAuth: true });
      return true;
    } catch (error) {
      console.error("시설 업데이트 오류:", error);
      throw error;
    }
  };

  const updateFacilityDrawing = async (data: FacilityDrawingUpdateRequest) => {
    try {
      if (!facilityType) {
        throw new Error('시설 유형이 정의되지 않았습니다.');
      }
      console.log(`도면 업데이트 API 호출: /api/v1/${facilityType}/${facilityId}/drawing`, data);
      await api.put(`/api/v1/${facilityType}/${facilityId}/drawing`, data, { requireAuth: true });
      return true;
    } catch (error) {
      console.error("도면 업데이트 오류:", error);
      throw error;
    }
  };

  const handleBack = () => {
    if (previousRoute) {
      navigate(previousRoute.path);
    } else {
      navigate('/admin/facility');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteFacility();
      navigate('/admin/facility');
    } catch (err) {
      console.error("시설 삭제 오류:", err);
      alert("시설을 삭제하는 중 오류가 발생했습니다.");
    }
  };

  const handleUpdate = async (data: FacilityUpdateRequest) => {
    try {
      await updateFacility(data);
      await mutateFacilityData();
    } catch (err) {
      console.error("시설 정보 업데이트 오류:", err);
      throw err;
    }
  };

  const handleDrawingUpdate = async (data: FacilityDrawingUpdateRequest) => {
    try {
      await updateFacilityDrawing(data);
      await mutateFacilityData();
      if (mutateHistoryData) {
        await mutateHistoryData();
      }
    } catch (err) {
      console.error("도면 업데이트 오류:", err);
      throw err;
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

  if (!facilityType) {
    return (
      <PageContainer title="시설 상세 정보">
        <div className="bg-orange-50 border border-orange-200 p-4 rounded-md">
          <h2 className="text-orange-700 text-lg font-medium mb-2">
            알 수 없는 시설 유형
          </h2>
          <p className="text-orange-600">
            URL에서 시설 유형을 확인할 수 없습니다.
          </p>
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

  const typeTitle = facilityType === 'buildings' ? '건물' : facilityType === 'stations' ? '역' : '시설';

  return (
    <>
      <FacilityDetailLayout
        title={isEditMode ? `${typeTitle} 편집` : `${typeTitle} 상세 정보`}
        itemId={Number(id)}
        data={facilityData}
        isLoading={isLoading}
        error={facilityError}
        urlMode={searchParams.get('mode')}
        formData={formData}
        setFormData={setFormData}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
        onDrawingUpdate={handleDrawingUpdate}
        onMutate={mutateFacilityData}
        onHistoryMutate={mutateHistoryData}
        history={historyData}
        detailUrl="/admin/facility"
      />
    </>
  );
};

export default FacilityDetailPage;