import React, { useState, useEffect } from 'react'
import { useCesium } from 'resium'
import * as Cesium from 'cesium'
import MapControls from '@/global/components/maps/MapControls'
import FacilitySearchForm from './FacilitySearchForm'
import { useFacilityStore } from '@/app/store/facilityStore'
import type { BaseFacilityResponse } from '@plug/common-services'
import { GoogleMap } from '@/global/components/maps'

const OutdoorMap: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [cesiumViewer, setCesiumViewer] = useState<Cesium.Viewer | null>(null)
  const { facilities, facilitiesFetched, loadFacilities } = useFacilityStore()

  useEffect(() => {
    if (!facilitiesFetched) {
      loadFacilities()
    }
  }, [facilitiesFetched, loadFacilities])

  const handleInitialLoadComplete = () => {
    setIsLoading(false)
  }

  const FacilityPOIs: React.FC = () => {
    const { viewer } = useCesium()

    useEffect(() => {
      if (viewer && !cesiumViewer) {
        setCesiumViewer(viewer)
      }
    }, [viewer])

    useEffect(() => {
      if (!viewer || !facilitiesFetched) return

      if (viewer.canvas.dataset.eventListenersAdded === 'true') {
        return
      }

      const allFacilities = Object.values(facilities).flat().filter(Boolean) as BaseFacilityResponse[]
      
      Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmNWJmZWEzOS1jMTJjLTQ0ZTYtOTFkNC1jZDMxMDlmYTRjMWEiLCJpZCI6MjgzMTA2LCJpYXQiOjE3NDE2NjE3OTR9.dZID1nZdOJeEv18BhwGwWlAjJQtWAFUDipJw7M4r0-w'

      let hoveredEntity: Cesium.Entity | null = null
      let handleMouseMove: ((event: MouseEvent) => void) | null = null
      let handleClick: ((event: MouseEvent) => void) | null = null

      const createPOIs = async () => {
        const resource = await Cesium.IonResource.fromAssetId(3589754)

        viewer.clock.shouldAnimate = true
        viewer.clock.multiplier = 1

        allFacilities.forEach((facility) => {
          if (facility.lat && facility.lon) {
            const position = Cesium.Cartesian3.fromDegrees(
              facility.lon,
              facility.lat,
              0
            )

            const rotationCallback = new Cesium.CallbackProperty(() => {
              const time = Date.now() / 1000;
              const angle = (time * Math.PI * 2) / 15;
              return Cesium.Transforms.headingPitchRollQuaternion(
                position,
                new Cesium.HeadingPitchRoll(angle, 0, 0)
              );
            }, false);

            const scaleCallback = new Cesium.CallbackProperty(() => {
              const cameraPosition = viewer.camera.position
              const distance = Cesium.Cartesian3.distance(cameraPosition, position)
              
              const baseScale = 10.0
              const maxScale = 25.0
              const scaleDistance = 5000 
              
              const scaleFactor = Math.min(distance / scaleDistance, 2.5)
              return baseScale + (scaleFactor * (maxScale - baseScale) / 2.5)
            }, false)

            viewer.entities.add({
              id: `facility-${facility.id}`,
              name: facility.name,
              position: position,
              orientation: rotationCallback,
              model: {
                uri: resource,
                scale: scaleCallback,
                color: Cesium.Color.WHITE,
                silhouetteColor: Cesium.Color.YELLOW,
                silhouetteSize: new Cesium.ConstantProperty(0),
              },
              properties: {
                facilityId: facility.id,
                facilityData: facility
              }
            })
          }
        })

        handleMouseMove = (event: MouseEvent) => {
          const canvasPosition = new Cesium.Cartesian2(event.clientX, event.clientY)
          
          const pickedObject = viewer.scene.pick(canvasPosition)
          
          if (hoveredEntity?.model) {
            hoveredEntity.model.silhouetteSize = new Cesium.ConstantProperty(0)
          }

          if (pickedObject && pickedObject.id) {
            if (pickedObject.id.id && pickedObject.id.id.startsWith('facility-')) {
              hoveredEntity = pickedObject.id
              if (hoveredEntity?.model) {
                hoveredEntity.model.silhouetteSize = new Cesium.ConstantProperty(3.0)
              }
              viewer.canvas.style.cursor = 'pointer'
            } else {
              hoveredEntity = null
              viewer.canvas.style.cursor = 'default'
            }
          } else {
            hoveredEntity = null
            viewer.canvas.style.cursor = 'default'
          }
        }

        handleClick = () => {}

        viewer.canvas.addEventListener('mousemove', handleMouseMove)
        viewer.canvas.addEventListener('click', handleClick)
        
        viewer.canvas.dataset.eventListenersAdded = 'true'
      }

      createPOIs()

      return () => {
        allFacilities.forEach((facility) => {
          const entity = viewer.entities.getById(`facility-${facility.id}`)
          if (entity) {
            viewer.entities.remove(entity)
          }
        })
        
        if (handleMouseMove) {
          viewer.canvas.removeEventListener('mousemove', handleMouseMove)
        }
        if (handleClick) {
          viewer.canvas.removeEventListener('click', handleClick)
        }
        
        delete viewer.canvas.dataset.eventListenersAdded
      }
    }, [viewer])

    return null
  }

  return (
    <>
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-lg font-medium">실외 지도 로딩 중...</span>
            </div>
          </div>
        </div>
      )}
      
      <div className="absolute top-4 left-4 z-40">
        <FacilitySearchForm viewer={cesiumViewer} />
      </div>
      
      <div className="w-full h-full">
        <GoogleMap className="w-full h-full relative">
          <MapControls onInitialLoadComplete={handleInitialLoadComplete} />
          <FacilityPOIs />
        </GoogleMap>
      </div>
    </>
  )
}

export default OutdoorMap
