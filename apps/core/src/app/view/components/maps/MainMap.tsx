import React, { useState } from 'react'
import OutdoorMap from './OutdoorMap'
import IndoorMap from './IndoorMap'
import { MapMode, MapState, OutdoorMapState } from '@/app/model/types/MapTypes'
import { useBuildingsSWR } from '@plug/common-services'

const MainMap: React.FC = () => {
  // Building API 데이터 가져오기
  const { data: buildingsData } = useBuildingsSWR()

  console.log('MainMap buildingsData:', buildingsData)

  // 초기 실외 지도 상태
  const [mapState] = useState<MapState>({
    mode: MapMode.OUTDOOR,
    center: { lat: 37.5547, lng: 126.9706 }, // 서울역
    zoom: 15,
    markers: [],
    activePoints: 15,
    systemHealth: 95,
    connectedUsers: 42,
    dataStreamStatus: 'live' as const,
    selectedEntity: undefined,
    entities: [],
    buildings: []
  } as OutdoorMapState)

  return (
    <div className="w-full h-full relative">
      {mapState.mode === MapMode.OUTDOOR ? (
        <OutdoorMap />
      ) : (
        <IndoorMap />
      )}
    </div>
  )
}

export default MainMap
