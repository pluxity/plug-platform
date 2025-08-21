import React, { useEffect, useMemo, useRef, useState } from 'react'
import { GroupSearchForm, type GroupSearchGroup, type GroupSearchFormRef } from '@/app/view/components/GroupSearchForm'
import { useFacilityStore } from '@/app/store/facilityStore'
import type { FacilityResponse } from '@plug/common-services'
import { domainUtils } from '@plug/common-services'
import * as Cesium from 'cesium'

interface FacilitySearchFormProps {
  viewer: Cesium.Viewer | null
}

const FacilitySearchForm: React.FC<FacilitySearchFormProps> = ({ viewer }) => {
  const [value, setValue] = useState('')
  const formRef = useRef<GroupSearchFormRef>(null)
  const facilities = useFacilityStore(s => s.facilities)
  const facilitiesFetched = useFacilityStore(s => s.facilitiesFetched)
  const loadFacilities = useFacilityStore(s => s.loadFacilities)

  useEffect(() => {
    if (!facilitiesFetched) loadFacilities()
  }, [facilitiesFetched, loadFacilities])

  const match = (f: FacilityResponse, q: string) => {
    const name = f.name?.toLowerCase() ?? ''
    const code = f.code?.toLowerCase() ?? ''
    const desc = f.description?.toLowerCase() ?? ''
    return name.includes(q) || code.includes(q) || desc.includes(q)
  }

  const groups: GroupSearchGroup<FacilityResponse>[] = useMemo(() => {
    const q = value.trim().toLowerCase()
    if (!q) return []
    return domainUtils.getAllDomains().map(domain => {
      const { endpoint, displayName } = domainUtils.getConfig(domain)
      const list = Array.isArray(facilities[endpoint]) ? facilities[endpoint] : []
      const filtered = (list as FacilityResponse[]).filter(f => match(f, q))
      return { heading: displayName, items: filtered }
    }).filter(g => g.items.length > 0)
  }, [value, facilities])

  const handleSelectFacility = (facility: FacilityResponse) => {
    setValue('')
    formRef.current?.close()

    if (!viewer) return

    const entityId = `facility-${facility.id}`
    const entity = viewer.entities.getById(entityId)
    if (entity && entity.position) {
      const pos = entity.position.getValue(Cesium.JulianDate.now())
      if (pos) {
        viewer.camera.flyToBoundingSphere(
          new Cesium.BoundingSphere(pos, 1000),
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
      value={value}
      onValueChange={setValue}
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
      getItemKey={(f) => f.id}
    />
  )
}

export default FacilitySearchForm
