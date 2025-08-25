import React, { useEffect, useMemo, useRef, useState } from 'react'
import { GroupSearchForm, type GroupSearchGroup, type GroupSearchFormRef } from '@/app/view/components/GroupSearchForm'
import { useFacilityStore } from '@/app/store/facilityStore'
import type { FacilityResponse } from '@plug/common-services'
import * as Cesium from 'cesium'

interface FacilitySearchFormProps {
  viewer: Cesium.Viewer | null
}

const FacilitySearchForm: React.FC<FacilitySearchFormProps> = ({ viewer }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const formRef = useRef<GroupSearchFormRef>(null)
  const facilities = useFacilityStore(s => s.facilities)
  const facilitiesFetched = useFacilityStore(s => s.facilitiesFetched)
  const loadFacilities = useFacilityStore(s => s.loadFacilities)

  useEffect(() => {
    if (!facilitiesFetched) loadFacilities()
  }, [facilitiesFetched, loadFacilities])

  const matchesSearch = (facility: FacilityResponse, query: string) => {
    const name = facility.name?.toLowerCase() ?? ''
    const code = facility.code?.toLowerCase() ?? ''
    const description = facility.description?.toLowerCase() ?? ''
    return name.includes(query) || code.includes(query) || description.includes(query)
  }

  const groups: GroupSearchGroup<FacilityResponse>[] = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return []
    const filtered = facilities.filter(f => matchesSearch(f as FacilityResponse, query)) as FacilityResponse[]
    return [{ heading: '시설', items: filtered }]
  }, [searchQuery, facilities])

  const handleSelectFacility = (facility: FacilityResponse) => {
    setSearchQuery('')
    formRef.current?.close()

    if (!viewer) return

    const entityId = `facility-${facility.id}`
    const entity = viewer.entities.getById(entityId)
    if (entity && entity.position) {
    const position = entity.position.getValue(Cesium.JulianDate.now())
    if (position) {
        viewer.camera.flyToBoundingSphere(
          new Cesium.BoundingSphere(position, 1000),
          {
            duration: 2.0,
            offset: new Cesium.HeadingPitchRange(0, Cesium.Math.toRadians(-15), 2000)
          }
        )
        return
      }
    }

    if (facility.lat && facility.lon) {
      const targetPosition = Cesium.Cartesian3.fromDegrees(facility.lon, facility.lat, 0)
      viewer.camera.flyToBoundingSphere(
        new Cesium.BoundingSphere(targetPosition, 1000),
        {
          duration: 2.0,
          offset: new Cesium.HeadingPitchRange(0, Cesium.Math.toRadians(-15), 2000)
        }
      )
    }
  }

  return (
    <GroupSearchForm<FacilityResponse>
  ref={formRef}
  value={searchQuery}
  onValueChange={setSearchQuery}
      groups={groups}
  placeholder={facilitiesFetched ? '시설명 또는 코드를 검색하세요...' : '시설 데이터를 불러오는 중...'}
      disabled={!facilitiesFetched}
      renderItem={(facility) => (
        <div>
          <div className="flex items-center justify-between">
            <div className="font-medium text-gray-900">{facility.name}</div>
            <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{facility.code}</div>
          </div>
          {facility.description && (
            <div className="text-sm text-gray-500 mt-1">{facility.description}</div>
          )}
          <div className="text-xs text-blue-600 mt-1">
            위도: {facility.lat?.toFixed(6)}, 경도: {facility.lon?.toFixed(6)}
          </div>
        </div>
      )}
      onSelect={handleSelectFacility}
  getItemKey={(facility) => facility.id}
    />
  )
}

export default FacilitySearchForm
