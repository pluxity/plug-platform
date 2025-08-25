import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { GroupSearchForm, type GroupSearchGroup, type GroupSearchFormRef } from '@/app/view/components/GroupSearchForm'
import { useFacilityStore } from '@/app/store/facilityStore'
import type { FacilityResponse } from '@plug/common-services'
import * as Cesium from 'cesium'

interface FacilitySearchFormProps {
  viewer: Cesium.Viewer | null
  onFacilitySelectInfo?: (facility: FacilityResponse) => void
  /** 새 시설 선택 즉시(비행 시작 전) 기존 Dialog 닫기 위해 호출 */
  onFacilityPreSelect?: () => void
}

const FacilitySearchForm: React.FC<FacilitySearchFormProps> = ({ viewer, onFacilitySelectInfo, onFacilityPreSelect }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const formRef = useRef<GroupSearchFormRef>(null)
  const facilities = useFacilityStore(s => s.facilities)
  const facilitiesFetched = useFacilityStore(s => s.facilitiesFetched)
  const loadFacilities = useFacilityStore(s => s.loadFacilities)

  useEffect(() => {
    if (!facilitiesFetched) loadFacilities()
  }, [facilitiesFetched, loadFacilities])

  const [pendingFacility, setPendingFacility] = useState<FacilityResponse | null>(null)

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

  const flyToFacility = useCallback((facility: FacilityResponse, done?: () => void) => {
    if (!viewer) return
    try {
      const entityId = `facility-${facility.id}`
      const entity = viewer.entities.getById(entityId)

      let targetCartesian: Cesium.Cartesian3 | undefined
      if (entity?.position) {
        targetCartesian = entity.position.getValue(Cesium.JulianDate.now()) as Cesium.Cartesian3 | undefined
      }
      if (!targetCartesian && facility.lat && facility.lon) {
        targetCartesian = Cesium.Cartesian3.fromDegrees(facility.lon, facility.lat, 0)
      }
      if (!targetCartesian) return

      // 현재와 매우 가깝다면 이동 생략 (불필요한 비행 방지)
      const dist = Cesium.Cartesian3.distance(viewer.camera.position, targetCartesian)
      if (dist < 30) { // already near – skip flight, just run callback
        done?.()
        return
      }
      
      (viewer.camera as unknown as (Cesium.Camera & { cancelFlight?: () => void })).cancelFlight?.()

      const desiredAltitude = 750
      const pitch = -20
      const range = desiredAltitude / Math.sin(Math.abs(pitch) * Math.PI / 180)
      const offset = new Cesium.HeadingPitchRange(0, Cesium.Math.toRadians(pitch), range)

      let lookCenter = targetCartesian
      try {
        const enu = Cesium.Transforms.eastNorthUpToFixedFrame(targetCartesian)
        const eastCol = Cesium.Matrix4.getColumn(enu, 0, new Cesium.Cartesian4()) // Cartesian4
        const east = new Cesium.Cartesian3(eastCol.x, eastCol.y, eastCol.z)
        Cesium.Cartesian3.normalize(east, east)
        const lateral = range * 0.125
        const shift = Cesium.Cartesian3.multiplyByScalar(east, lateral, new Cesium.Cartesian3())
        lookCenter = Cesium.Cartesian3.add(targetCartesian, shift, new Cesium.Cartesian3())
      } catch {
        /* fallback: ignore */
      }

      const sphere = new Cesium.BoundingSphere(lookCenter, Math.min(Math.max(dist * 0.1, 80), 1200))
      viewer.camera.flyToBoundingSphere(sphere, {
        duration: 0.5,
        offset,
        maximumHeight: 20000,
        complete: () => done?.()
      })
    } catch {
      /* noop */
    }
  }, [viewer])

  const handleSelectFacility = (facility: FacilityResponse) => {
    setSearchQuery('')
    formRef.current?.close()
  onFacilityPreSelect?.()
    // 대기 상태에 두고, 카메라 이동 완료 후 Dialog 표시
    setPendingFacility(facility)
  }

  // viewer 준비되었고 대기중인 시설이 있으면 이동
  useEffect(() => {
    if (viewer && pendingFacility) {
      const fac = pendingFacility
      flyToFacility(fac, () => {
        onFacilitySelectInfo?.(fac)
        setPendingFacility(null)
      })
    }
  }, [viewer, pendingFacility, flyToFacility, onFacilitySelectInfo])

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
