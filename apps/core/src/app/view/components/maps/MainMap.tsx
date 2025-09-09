import { UserProfile } from '@/global/components';

import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import type { FacilityType } from '@plug/common-services';

import { useEnsureFacilities } from '@/app/hooks/useEnsureFacilities';

import IndoorMap from './IndoorMap';
import OutdoorMap from './OutdoorMap';
enum MapMode {
  OUTDOOR = 'outdoor',
  INDOOR = 'indoor',
}

const MainMap: React.FC = () => {
  const location = useLocation();
  const navState = location.state as { facilityId?: number; facilityType?: FacilityType; mode?: string } | null;

  const initialIsIndoor = !!(navState?.mode === 'indoor' && navState.facilityId && navState.facilityType);
  const [mapMode, setMapMode] = useState<MapMode>(initialIsIndoor ? MapMode.INDOOR : MapMode.OUTDOOR);
  const [selectedFacilityId, setSelectedFacilityId] = useState<number | null>(initialIsIndoor ? navState?.facilityId ?? null : null);
  const [selectedFacilityType, setSelectedFacilityType] = useState<FacilityType | null>(initialIsIndoor ? navState?.facilityType ?? null : null);
  useEnsureFacilities({ revalidateIfStale: true });
  const navigate = useNavigate();

  useEffect(() => {
    if (initialIsIndoor && location.state) {
      navigate(location.pathname, { replace: true });
    }
  }, [initialIsIndoor, location.state, location.pathname, navigate]);

  const goOutdoor = useCallback(() => {
    setMapMode(MapMode.OUTDOOR);
    setSelectedFacilityId(null);
    setSelectedFacilityType(null);
  }, []);

  useEffect(() => {
    const handler = () => {
      goOutdoor();
    };
    window.addEventListener('indoor:goOutdoor', handler);
    return () => window.removeEventListener('indoor:goOutdoor', handler);
  }, [goOutdoor]);

  const handleFacilitySelect = (facilityId: number, facilityType: FacilityType) => {
    setSelectedFacilityId(facilityId);
    setSelectedFacilityType(facilityType);
    setMapMode(MapMode.INDOOR);
  };

  return (
    <div className="w-full h-full relative">
      {mapMode === MapMode.OUTDOOR && (
        <div className="absolute top-4 right-4 z-50 pointer-events-auto">
        <UserProfile />
      </div>
      )}
      {mapMode === MapMode.INDOOR && (
        <div className="absolute top-4 right-4 z-50 flex items-center gap-3 pointer-events-auto">
          <button
            type="button"
            onClick={goOutdoor}
            className="group relative h-11 inline-flex items-center justify-center rounded-full bg-gradient-to-br from-primary-500/60 to-primary-600/70 text-white shadow-lg shadow-primary-600/30 hover:from-primary-400/60 hover:to-primary-500/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-300/70 transition-all duration-300 px-0 pl-0 pr-0 overflow-hidden cursor-pointer"
            title="실외 지도로 나가기"
            aria-label="실외 지도로 나가기"
          >
            <div className="flex items-center">
              <span className="flex items-center justify-center w-11">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </span>
              <span className="whitespace-nowrap text-sm font-medium opacity-0 w-0 group-hover:opacity-100 group-hover:w-auto group-hover:pr-4 group-hover:pl-1 transition-all duration-300">
                실외로 나가기
              </span>
            </div>
          </button>
          <UserProfile />
        </div>
      )}

      {mapMode === MapMode.OUTDOOR && (
        <OutdoorMap
          onFacilitySelect={handleFacilitySelect}
        />
      )}

      {mapMode === MapMode.INDOOR && selectedFacilityId && selectedFacilityType && (
        <IndoorMap
          facilityId={selectedFacilityId}
          facilityType={selectedFacilityType}
          onGoOutdoor={goOutdoor}
        />
      )}
    </div>
  );
};

export default MainMap;
