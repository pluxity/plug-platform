import { useFacilitiesSWR, FacilityType, FacilityResponse, domainUtils, FacilityService } from '@plug/common-services';
import { useMemo } from 'react';
import { toast } from 'sonner';

export const useFacilityData = () => {
  const { data: facilitiesArray, error, isLoading, mutate } = useFacilitiesSWR();

  const getFacilityCount = useMemo(() => {
    const counts: Record<FacilityType, number> = {} as Record<FacilityType, number>;
    if (!Array.isArray(facilitiesArray)) return counts;
    facilitiesArray.forEach((f) => {
      const t = (f as FacilityResponse & { type?: FacilityType }).type ?? 'BUILDING';
      counts[t] = (counts[t] ?? 0) + 1;
    });
    return counts;
  }, [facilitiesArray]);

  const getAllFacilities = useMemo(() => {
    if (!Array.isArray(facilitiesArray)) return [];
    return facilitiesArray.map((f) => ({
      ...f,
      facilityType: (f as FacilityResponse & { type?: FacilityType }).type ?? 'BUILDING'
    }));
  }, [facilitiesArray]);

  const handleDeleteFacility = async (id: number, facilityType: FacilityType) => {
    try {
      await FacilityService.delete(facilityType, id);
      await mutate();
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
    facilitiesByType: domainUtils.getAllDomains().reduce((acc, key) => {
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
