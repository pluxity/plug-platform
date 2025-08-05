import { useFacilitiesSWR, FacilityType, FacilityResponse, DOMAINS, FacilityService } from '@plug/common-services';
import { useMemo } from 'react';
import { toast } from 'sonner';

export const useFacilityData = () => {
  const { data: facilitiesByType, error, isLoading, mutate } = useFacilitiesSWR();

  const getFacilityCount = useMemo(() => {
    if (!facilitiesByType) return {} as Record<FacilityType, number>;
    
    // endpoint 키를 facility type 키로 변환하여 카운트 생성
    return Object.entries(facilitiesByType).reduce((acc, [endpointKey, facilities]) => {
      // endpoint에서 facility type으로 역매핑
      const domainEntry = Object.entries(DOMAINS).find(([, config]) => config.endpoint === endpointKey);
      const facilityType = domainEntry ? domainEntry[0] as FacilityType : 'building';
      
      acc[facilityType] = facilities.length;
      return acc;
    }, {} as Record<FacilityType, number>);
  }, [facilitiesByType]);

  const getAllFacilities = useMemo(() => {
    if (!facilitiesByType) return [];
    
    const mapApiKeyToFacilityType = (apiKey: string): FacilityType => {
      // DOMAINS 객체를 활용해서 endpoint에서 도메인 키로 역매핑
      const domainEntry = Object.entries(DOMAINS).find(([, config]) => config.endpoint === apiKey);
      return domainEntry ? domainEntry[0] as FacilityType : 'building';
    };

    return Object.entries(facilitiesByType).flatMap(([type, facilities]) =>
      facilities.map(facility => ({
        ...facility,
        facilityType: mapApiKeyToFacilityType(type)
      }))
    );
  }, [facilitiesByType]);

  const handleDeleteFacility = async (id: number, facilityType: FacilityType) => {
    try {
      await FacilityService.delete(facilityType, id);
      await mutate(); // SWR 캐시 갱신
      toast.success('시설이 성공적으로 삭제되었습니다.');
    } catch (error: unknown) {
      const errorObj = error as { status?: number; message?: string };
      if (errorObj?.status === 400) {
        toast.error('시설을 삭제할 수 없습니다', {
          description: '다른 데이터에서 사용 중인 시설입니다.'
        });
      } else if (errorObj?.status === 409) {
        toast.error('시설을 삭제할 수 없습니다', {
          description: '관련된 데이터가 있어 삭제할 수 없습니다.'
        });
      } else {
        toast.error('시설 삭제에 실패했습니다', {
          description: errorObj?.message || '알 수 없는 오류가 발생했습니다.'
        });
      }
      throw error;
    }
  };

  return {
    facilitiesByType: facilitiesByType || Object.keys(DOMAINS).reduce((acc, key) => {
      acc[key as FacilityType] = [];
      return acc;
    }, {} as Record<FacilityType, FacilityResponse[]>),
    isLoading,
    error: error?.message || null,
    getFacilityCount,
    getAllFacilities,
    deleteFacility: handleDeleteFacility,
    refetch: mutate
  };
};
