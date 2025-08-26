import React, { useEffect, useCallback, useState } from 'react'
import { FacilityType } from '@plug/common-services'
import { useFacilityStore } from '@/app/store/facilityStore'
import { useAssets } from '@/global/store/assetStore'
import { useIndoorEngine } from '@/app/view/hooks/useIndoorEngine'
import { useIndoorFacilityData } from '@/app/view/hooks/useIndoorFacilityData'
import MapScene from '@/global/components/indoor-map/MapScene'
import DeviceSearchForm from './DeviceSearchForm'
import DeviceCategoryChips from './DeviceCategoryChips'
import { DeviceInfoDialog } from '../info-dialog'
import type { GsDeviceResponse } from '@plug/common-services'

interface IndoorMapProps { facilityId: number; facilityType: FacilityType; onGoOutdoor?: () => void }

const IndoorMap: React.FC<IndoorMapProps> = ({ facilityId, facilityType, onGoOutdoor }) => {
  const facilitiesFetched = useFacilityStore(s => s.facilitiesFetched)
  const { assets } = useAssets()
  const { features, floors, has3DDrawing, isLoading, countdown, modelUrl, handleOutdoor } = useIndoorFacilityData({ facilityId, facilityType, onGoOutdoor })
  const { handleLoadComplete } = useIndoorEngine({ features, assets, autoExtendView: true })

  const handleOutdoorClick = useCallback(() => { handleOutdoor() }, [handleOutdoor])

  useEffect(() => () => { handleOutdoor() }, [handleOutdoor])

  const [selectedDevice, setSelectedDevice] = useState<GsDeviceResponse | null>(null)

  if (!facilitiesFetched || isLoading || has3DDrawing === null) {
    return (
      <div className='w-full h-full relative flex items-center justify-center bg-gray-900'>
        <div className='text-center text-white'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4'></div>
          <p className='text-lg'>{!facilitiesFetched || isLoading ? '시설 정보를 불러오는 중...' : '3D 도면을 확인하는 중...'}</p>
        </div>
      </div>
    )
  }

  if (!has3DDrawing) {
    return (
      <div className='w-full h-full relative flex items-center justify-center bg-gray-900'>
        <div className='text-center text-white'>
          <div className='mb-6'>
            <svg className='w-16 h-16 mx-auto mb-4 text-yellow-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 18.5c-.77.833.192 2.5 1.732 2.5z' />
            </svg>
            <h2 className='text-2xl font-bold mb-2'>3D 도면이 없습니다</h2>
            <p className='text-lg mb-6'>잠시 뒤에 실외로 전환됩니다...</p>
            <div className='text-4xl font-bold text-yellow-400 mb-4'>{countdown}</div>
          </div>
          <button onClick={handleOutdoorClick} title='실외 지도로 나가기' className='relative px-6 py-3 bg-blue-600 text-white rounded-xl font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-400/70 focus-visible:ring-offset-blue-900/20 pointer-events-auto' style={{ zIndex: 60 }}>
            <span className='inline-flex items-center gap-2'>
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth={2} aria-hidden>
                <path strokeLinecap='round' strokeLinejoin='round' d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' />
              </svg>
              <span>지금 실외로 나가기</span>
            </span>
          </button>
        </div>
      </div>
    )
  }

  // state moved above early returns

  const overlays = (
    <div className='absolute top-4 left-4 z-20 flex flex-row gap-3 items-start'>
      <DeviceSearchForm
        className='pointer-events-auto'
        features={features}
        onDeviceSelect={(device) => setSelectedDevice(device)}
      />
      <DeviceCategoryChips />
    </div>
  )

  return (
    <>
      <MapScene modelUrl={modelUrl} floors={floors} onLoadComplete={handleLoadComplete} onOutdoor={handleOutdoorClick} overlays={overlays} />
      <DeviceInfoDialog
        device={selectedDevice}
        onClose={() => setSelectedDevice(null)}
      />
    </>
  )
};

export default IndoorMap;
