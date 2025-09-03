import * as Cesium from 'cesium';

export const HOME_LOCATION = { longitude: 126.99031410564186, latitude: 37.53232551605517, height: 20 };
export const HOME_VIEW = { headingDeg: 20, pitchDeg: -25, range: 1800 };
export const HOME_OVERVIEW = { headingDeg: 20, pitchDeg: -30, range: 5200 };

export function flyToHome(viewer: Cesium.Viewer, opts?: { duration?: number }) {
  if (!viewer) return;
  const target = Cesium.Cartesian3.fromDegrees(HOME_LOCATION.longitude, HOME_LOCATION.latitude, HOME_LOCATION.height);
  const offset = new Cesium.HeadingPitchRange(
    Cesium.Math.toRadians(HOME_OVERVIEW.headingDeg),
    Cesium.Math.toRadians(HOME_OVERVIEW.pitchDeg),
    HOME_OVERVIEW.range
  );
  viewer.scene.camera.flyToBoundingSphere(new Cesium.BoundingSphere(target, 80), { offset, duration: opts?.duration ?? 1.5 });
}

export function setHomeViewInstant(viewer: Cesium.Viewer) {
  if (!viewer) return;
  const target = Cesium.Cartesian3.fromDegrees(HOME_LOCATION.longitude, HOME_LOCATION.latitude, HOME_LOCATION.height);
  const offset = new Cesium.HeadingPitchRange(
    Cesium.Math.toRadians(HOME_OVERVIEW.headingDeg),
    Cesium.Math.toRadians(HOME_OVERVIEW.pitchDeg),
    HOME_OVERVIEW.range
  );
  viewer.scene.camera.flyToBoundingSphere(new Cesium.BoundingSphere(target, 80), { offset, duration: 0 });
}
