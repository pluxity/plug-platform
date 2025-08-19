import React, { useState, useEffect, useRef } from 'react'
import { useCesium } from 'resium'
import * as Cesium from 'cesium'
import MapControls from '@/global/components/outdoor-map/MapControls'
import FacilitySearchForm from './FacilitySearchForm'
import { useFacilityStore } from '@/app/store/facilityStore'
import type { FacilityType } from '@plug/common-services'
import { OSMBuildingsMap } from '@/global/components/outdoor-map'

interface OutdoorMapProps {
  onFacilitySelect?: (facilityId: number, facilityType: FacilityType) => void;
}

// POIs are rendered once after facilities are fetched and viewer is ready
const FacilityPOIs: React.FC<{
  onFacilitySelect?: (facilityId: number, facilityType: FacilityType) => void
  onViewerReady?: (viewer: Cesium.Viewer) => void
}> = React.memo(({ onFacilitySelect, onViewerReady }) => {
  const { viewer } = useCesium()
  const facilities = useFacilityStore(s => s.facilities)
  const facilitiesFetched = useFacilityStore(s => s.facilitiesFetched)
  const didInitRef = useRef(false)

  useEffect(() => {
    if (viewer) onViewerReady?.(viewer)
  }, [viewer, onViewerReady])

  useEffect(() => {
    if (!viewer || didInitRef.current) return
    if (!facilitiesFetched || Object.keys(facilities).length === 0) return

    Cesium.Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_ION_ACCESS_TOKEN

  let hoveredEntity: Cesium.Entity | null = null
  let screenHandler: Cesium.ScreenSpaceEventHandler | null = null

    const createPOIs = async () => {
      let resource: Cesium.Resource | undefined
      try {
        resource = await Cesium.IonResource.fromAssetId(3589754)
      } catch (e) {
        console.error('Failed to resolve Cesium Ion resource for facility POIs', e)
        return
      }
      viewer.clock.shouldAnimate = false
      viewer.clock.multiplier = 1
      viewer.entities.removeAll()

      const facilityTypeConfigs = {
        buildings: { color: Cesium.Color.WHITE, silhouetteColor: Cesium.Color.YELLOW, facilityType: 'building' as FacilityType },
        stations: { color: Cesium.Color.WHITE, silhouetteColor: Cesium.Color.YELLOW, facilityType: 'station' as FacilityType },
        parks: { color: Cesium.Color.WHITE, silhouetteColor: Cesium.Color.YELLOW, facilityType: 'park' as FacilityType },
      }

      const keyMap: Record<string, keyof typeof facilityTypeConfigs> = {
        building: 'buildings',
        station: 'stations',
        park: 'parks',
      }

      Object.entries(facilities).forEach(([facilityTypeKey, facilitiesOfType]) => {
        const normalizedKey = (facilityTypeKey in facilityTypeConfigs)
          ? facilityTypeKey as keyof typeof facilityTypeConfigs
          : (keyMap[facilityTypeKey] ?? (facilityTypeKey as keyof typeof facilityTypeConfigs))
        const config = facilityTypeConfigs[normalizedKey]
        if (!config || !Array.isArray(facilitiesOfType)) return

        type FlatFacility = { id: number; name?: string; lat?: number; lon?: number }
        type NestedFacility = { facility?: FlatFacility }
        const getFlat = (f: unknown): FlatFacility | undefined => {
          if (!f || typeof f !== 'object') return undefined
          const maybeFlat = f as Partial<FlatFacility>
          if (typeof maybeFlat.id === 'number' && ('lat' in maybeFlat || 'lon' in maybeFlat)) {
            return maybeFlat as FlatFacility
          }
          const maybeNested = f as NestedFacility
          if (maybeNested.facility && typeof maybeNested.facility.id === 'number') return maybeNested.facility
          return undefined
        }

        facilitiesOfType.forEach((facility: unknown) => {
          const base = getFlat(facility)
          const lat: number | undefined = base?.lat
          const lon: number | undefined = base?.lon
          const id: number | undefined = base?.id
          const name: string | undefined = base?.name
          if (lat == null || lon == null || id == null) return
          const position = Cesium.Cartesian3.fromDegrees(lon, lat, 0)

          const rotationCallback = new Cesium.CallbackProperty(() => {
            const time = Date.now() / 500
            const angle = (time * Math.PI * 2) / 30
            return Cesium.Transforms.headingPitchRollQuaternion(position, new Cesium.HeadingPitchRoll(angle, 0, 0))
          }, false)

          const scaleCallback = new Cesium.CallbackProperty(() => {
            const cameraPosition = viewer.camera.position
            const distance = Cesium.Cartesian3.distance(cameraPosition, position)
            const baseScale = 10.0
            const maxScale = 25.0
            const scaleDistance = 5000
            const scaleFactor = Math.min(distance / scaleDistance, 2.5)
            return baseScale + (scaleFactor * (maxScale - baseScale) / 2.5)
          }, false)

          const entityId = `facility-${id}`

          viewer.entities.add({
            id: entityId,
            name: name ?? String(id),
            position,
            orientation: rotationCallback,
            model: {
              uri: resource!,
              scale: scaleCallback,
              color: config.color,
              silhouetteColor: config.silhouetteColor,
              silhouetteSize: new Cesium.ConstantProperty(0),
              heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
            },
            properties: {
              facilityId: id,
              facilityData: facility,
              facilityType: config.facilityType
            }
          })
        })
      })

      // Use Cesium's ScreenSpaceEventHandler for proper canvas-relative coords
      screenHandler = new Cesium.ScreenSpaceEventHandler(viewer.canvas)

      screenHandler.setInputAction((movement: unknown) => {
        const endPosition = (movement as { endPosition: Cesium.Cartesian2 }).endPosition
        if (!endPosition) return
        const pickedObject = viewer.scene.pick(endPosition)
        if (hoveredEntity?.model) {
          hoveredEntity.model.silhouetteSize = new Cesium.ConstantProperty(0)
        }
        if (pickedObject && pickedObject.id && pickedObject.id.id?.startsWith('facility-')) {
          hoveredEntity = pickedObject.id as Cesium.Entity
          if (hoveredEntity?.model) {
            hoveredEntity.model.silhouetteSize = new Cesium.ConstantProperty(3.0)
          }
          ;(viewer.container as HTMLElement).style.cursor = 'pointer'
        } else {
          hoveredEntity = null
          ;(viewer.container as HTMLElement).style.cursor = 'default'
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

      screenHandler.setInputAction((click: unknown) => {
        const position = (click as { position: Cesium.Cartesian2 }).position
        if (!position) return
        const pickedObject = viewer.scene.pick(position)
        if (pickedObject && pickedObject.id && pickedObject.id.id?.startsWith('facility-')) {
          const entity = pickedObject.id as Cesium.Entity
          const facilityId = entity.properties?.facilityId?.getValue()
          const facilityType = entity.properties?.facilityType?.getValue()
          if (facilityId && facilityType && onFacilitySelect) onFacilitySelect(facilityId, facilityType)
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    }

    createPOIs()
    didInitRef.current = true

    return () => {
      if (screenHandler) {
        screenHandler.destroy()
        screenHandler = null
      }
    }
  }, [viewer, facilitiesFetched, facilities, onFacilitySelect])

  return null
})

const OutdoorMap: React.FC<OutdoorMapProps> = ({ onFacilitySelect }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [cesiumViewer, setCesiumViewer] = useState<Cesium.Viewer | null>(null)

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
      
      <div className="absolute top-4 left-4 z-40">
        <FacilitySearchForm viewer={cesiumViewer} />
      </div>
      
      <OSMBuildingsMap className="w-full h-full">
        <MapControls onInitialLoadComplete={handleInitialLoadComplete} />
  <FacilityPOIs onFacilitySelect={onFacilitySelect} onViewerReady={setCesiumViewer} />
      </OSMBuildingsMap>
    </div>
  )
}

export default OutdoorMap
