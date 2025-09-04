import FacilityInfoDialog from '../dialogs/FacilityInfoDialog'

import * as Cesium from 'cesium'
import React, { useState } from 'react'

import type { FacilityType, FacilityResponse } from '@plug/common-services'

import { useEnsureFacilities } from '@/app/hooks/useEnsureFacilities'
import { useFacilityStore } from '@/app/store/facilityStore'
import { OSMBuildingsMap, MapControls, CameraSetup } from '@/global/components/outdoor-map'

import FacilityPOIs from './FacilityPOIs'
import FacilitySearchForm from './FacilitySearchForm'
interface OutdoorMapProps {
  onFacilitySelect?: (facilityId: number, facilityType: FacilityType) => void;
}

const OutdoorMap: React.FC<OutdoorMapProps> = ({ onFacilitySelect }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [cesiumViewer, setCesiumViewer] = useState<Cesium.Viewer | null>(null)
  const [selectedFacility, setSelectedFacility] = useState<FacilityResponse | null>(null)

  const facilitiesFetched = useFacilityStore(s => s.facilitiesFetched)
  useEnsureFacilities({ revalidateIfStale: true })

  const handleInitialLoadComplete = () => {
    setIsLoading(false)
  }

  return (
    <div className="w-full h-full relative">
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-lg font-medium">실외 지도 로딩 중...</span>
          </div>
        </div>
      )}
      
      {facilitiesFetched && (
        <div className="absolute top-4 left-4 z-40">
          <FacilitySearchForm
            viewer={cesiumViewer}
            onFacilityPreSelect={() => setSelectedFacility(null)}
            onFacilitySelectInfo={(facility) => {
              setSelectedFacility(facility)
            }}
          />
        </div>
      )}
      <FacilityInfoDialog
        facility={selectedFacility}
        onClose={() => setSelectedFacility(null)}
      />
      
    <OSMBuildingsMap className="w-full h-full">
      <CameraSetup onInitialSetupComplete={handleInitialLoadComplete} />
      <MapControls />
          {facilitiesFetched && (
            <FacilityPOIs
              onFacilitySelect={(facilityId, facilityType) => {
                onFacilitySelect?.(facilityId, facilityType)
              }}
              onViewerReady={setCesiumViewer}
            />
          )}
      </OSMBuildingsMap>
    </div>
  )
}

export default OutdoorMap
