import React from 'react';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { 
  FacilityResponse, 
  FacilityType, 
  DOMAINS,
  facilityService,
  deleteFacility
} from '@plug/common-services';

interface FacilityState {
  facilitiesByType: Record<FacilityType, FacilityResponse[]>;
  isLoading: boolean;
  error: string | null;
  
  setFacilitiesByType: (facilities: Record<FacilityType, FacilityResponse[]>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  loadFacilities: () => Promise<void>;
  deleteFacility: (id: number) => Promise<void>;
  
  getFacilityCount: () => Record<FacilityType, number>;
  getAllFacilities: () => (FacilityResponse & { facilityType: FacilityType })[];
}

const mapApiKeyToFacilityType = (apiKey: string): FacilityType => {
  const keyMapping: Record<string, FacilityType> = {
    'stations': 'station',
    'buildings': 'building', 
    'parks': 'park',
  };
  
  return keyMapping[apiKey] || 'building';
};

export const useFacilityStore = create<FacilityState>()(
  devtools(
    (set, get) => ({
      facilitiesByType: Object.keys(DOMAINS).reduce((acc, key) => {
        acc[key as FacilityType] = [];
        return acc;
      }, {} as Record<FacilityType, FacilityResponse[]>),
      isLoading: false,
      error: null,

      setFacilitiesByType: (facilities) => set({ facilitiesByType: facilities }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      loadFacilities: async () => {
        const { isLoading } = get();
        
        if (isLoading) return;
        
        set({ isLoading: true, error: null });
        
        try {
          const response = await facilityService.getAllFacilities();
          const facilitiesData = response.data || {};
          
          if (Object.keys(facilitiesData).length > 0) {
            set({ facilitiesByType: facilitiesData, isLoading: false });
          } else {
            set({ 
              facilitiesByType: Object.keys(DOMAINS).reduce((acc, key) => {
                acc[key as FacilityType] = [];
                return acc;
              }, {} as Record<FacilityType, FacilityResponse[]>),
              isLoading: false 
            });
          }
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to load facilities',
            isLoading: false 
          });
        }
      },

      deleteFacility: async (id: number) => {
        await deleteFacility(id);
        await get().loadFacilities();
      },

      getFacilityCount: () => {
        const { facilitiesByType } = get();
        console.log('getFacilityCount called', facilitiesByType);
        return Object.entries(facilitiesByType).reduce((acc, [type, facilities]) => {
          acc[type as FacilityType] = facilities.length;
          return acc;
        }, {} as Record<FacilityType, number>);
      },

      getAllFacilities: () => {
        const { facilitiesByType } = get();
        return Object.entries(facilitiesByType).flatMap(([type, facilities]) =>
          facilities.map(facility => ({
            ...facility,
            facilityType: mapApiKeyToFacilityType(type)
          }))
        );
      }
    }),
    {
      name: 'facility-store',
    }
  )
);

export const useFacilities = () => {
  const { 
    facilitiesByType, 
    isLoading, 
    error, 
    loadFacilities, 
    deleteFacility, 
    getFacilityCount, 
    getAllFacilities 
  } = useFacilityStore();
  
  React.useEffect(() => {
    if (!isLoading && Object.values(facilitiesByType).every(arr => arr.length === 0)) {
      loadFacilities();
    }
  }, [isLoading, facilitiesByType, loadFacilities]);
  
  return {
    facilitiesByType,
    isLoading,
    error,
    loadFacilities,
    deleteFacility,
    getFacilityCount,
    getAllFacilities
  };
};
