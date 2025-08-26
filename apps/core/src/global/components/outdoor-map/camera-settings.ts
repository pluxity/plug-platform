import * as Cesium from 'cesium'

export const HOME_TARGET = {
  longitude: 126.99031410564186,
  latitude: 37.53232551605517,
  height: 20
}

export const HOME_VIEW = {
  headingDeg: 20,
  pitchDeg: -25,
  range: 1800
}

// 보다 멀리서 전체를 조망하는 기본(오버뷰) 카메라 뷰
export const HOME_OVERVIEW_VIEW = {
  headingDeg: 20,
  pitchDeg: -30,
  range: 5200 // 기존 1800 보다 멀리서 보기 위함
}

export function flyToHome(viewer: Cesium.Viewer, opts?: { duration?: number }) {
  if (!viewer) return
  const target = Cesium.Cartesian3.fromDegrees(HOME_TARGET.longitude, HOME_TARGET.latitude, HOME_TARGET.height)
  const offset = new Cesium.HeadingPitchRange(
    Cesium.Math.toRadians(HOME_OVERVIEW_VIEW.headingDeg),
    Cesium.Math.toRadians(HOME_OVERVIEW_VIEW.pitchDeg),
    HOME_OVERVIEW_VIEW.range
  )
  viewer.scene.camera.flyToBoundingSphere(new Cesium.BoundingSphere(target, 80), {
    offset,
    duration: opts?.duration ?? 1.5
  })
}

export function setHomeViewInstant(viewer: Cesium.Viewer) {
  if (!viewer) return
  const target = Cesium.Cartesian3.fromDegrees(HOME_TARGET.longitude, HOME_TARGET.latitude, HOME_TARGET.height)
  const offset = new Cesium.HeadingPitchRange(
    Cesium.Math.toRadians(HOME_OVERVIEW_VIEW.headingDeg),
    Cesium.Math.toRadians(HOME_OVERVIEW_VIEW.pitchDeg),
    HOME_OVERVIEW_VIEW.range
  )
  // 0초 flyToBoundingSphere 사용 (깜빡임 최소화)
  viewer.scene.camera.flyToBoundingSphere(new Cesium.BoundingSphere(target, 80), {
    offset,
    duration: 0
  })
}