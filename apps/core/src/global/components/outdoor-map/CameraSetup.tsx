import React, { useEffect, useRef } from 'react'
import * as Cesium from 'cesium'
import { useCesium } from 'resium'

interface CameraSetupProps {
  initialPosition?: {
    longitude: number
    latitude: number
    altitude: number
  }
  onInitialSetupComplete?: () => void
  hasInitialized?: boolean
}

const DEFAULT_INITIAL_POSITION = {
  longitude: 126.9905, // 용산구청 경도
  latitude: 37.5326,   // 용산구청 위도
  altitude: 1000,
}

const InitialCameraSetup: React.FC<CameraSetupProps> = ({
  initialPosition,
  onInitialSetupComplete,
  hasInitialized = false,
}) => {
  const { viewer } = useCesium()
  const initializedRef = useRef(false)
  const initPos = initialPosition ?? DEFAULT_INITIAL_POSITION

  useEffect(() => {
    if (!viewer) return
    if (initializedRef.current || hasInitialized) return
    initializedRef.current = true

    const cameraController = viewer.scene.screenSpaceCameraController
    cameraController.tiltEventTypes = [Cesium.CameraEventType.LEFT_DRAG]
    cameraController.rotateEventTypes = [Cesium.CameraEventType.RIGHT_DRAG]
    cameraController.zoomEventTypes = [
      Cesium.CameraEventType.WHEEL,
      Cesium.CameraEventType.PINCH,
    ]
    cameraController.translateEventTypes = [Cesium.CameraEventType.MIDDLE_DRAG]

    const target = Cesium.Cartesian3.fromDegrees(
      initPos.longitude,
      initPos.latitude,
      0
    )

    const offset = new Cesium.HeadingPitchRange(
      Cesium.Math.toRadians(0),
      Cesium.Math.toRadians(-15),
      Math.max(300, initPos.altitude ?? 1500)
    )

    viewer.camera.flyToBoundingSphere(new Cesium.BoundingSphere(target, 100), {
      offset,
      duration: 1.0,
      maximumHeight: 10000,
      complete: () => {
        onInitialSetupComplete?.()
      },
    })
  }, [viewer, hasInitialized, initPos.longitude, initPos.latitude, initPos.altitude, onInitialSetupComplete])

  return null
}

export default InitialCameraSetup
