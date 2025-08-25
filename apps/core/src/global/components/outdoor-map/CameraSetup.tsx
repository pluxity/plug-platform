import React, { useEffect, useRef } from 'react'
import * as Cesium from 'cesium'
import { useCesium } from 'resium'
import { HOME_TARGET, HOME_OVERVIEW_VIEW } from './camera-settings'

interface CameraSetupProps {
  onInitialSetupComplete?: () => void
  hasInitialized?: boolean
}

const DEFAULT_INITIAL_POSITION = {
  longitude: HOME_TARGET.longitude,
  latitude: HOME_TARGET.latitude,
  altitude: HOME_OVERVIEW_VIEW.range,
}

const InitialCameraSetup: React.FC<CameraSetupProps> = ({
  onInitialSetupComplete,
  hasInitialized = false,
}) => {
  const { viewer } = useCesium()
  const initializedRef = useRef(false)
  const initPos = DEFAULT_INITIAL_POSITION

  useEffect(() => {
    if (!viewer) return
    if (initializedRef.current || hasInitialized) return
    initializedRef.current = true

    // 사용자 입력 이벤트 기본 설정 (필요 시 조정)
    const controller = viewer.scene.screenSpaceCameraController
    controller.tiltEventTypes = [Cesium.CameraEventType.LEFT_DRAG]
    controller.rotateEventTypes = [Cesium.CameraEventType.RIGHT_DRAG]
    controller.zoomEventTypes = [Cesium.CameraEventType.WHEEL, Cesium.CameraEventType.PINCH]
    controller.translateEventTypes = [Cesium.CameraEventType.MIDDLE_DRAG]

    const target = Cesium.Cartesian3.fromDegrees(initPos.longitude, initPos.latitude, 0)
    const heading = Cesium.Math.toRadians(HOME_OVERVIEW_VIEW.headingDeg)
    const pitch = Cesium.Math.toRadians(HOME_OVERVIEW_VIEW.pitchDeg)
    const range = Math.max(500, initPos.altitude ?? HOME_OVERVIEW_VIEW.range)

    viewer.camera.flyToBoundingSphere(new Cesium.BoundingSphere(target, 80), {
      offset: new Cesium.HeadingPitchRange(heading, pitch, range),
      duration: 0,
      complete: () => onInitialSetupComplete?.()
    })
  }, [viewer, hasInitialized, initPos.longitude, initPos.latitude, initPos.altitude, onInitialSetupComplete])

  return null
}

export default InitialCameraSetup
