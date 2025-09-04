import * as Cesium from 'cesium';
import { VWORLD_API_KEY, VWORLD_MAP_URL, MapProvider } from '../constants';

export function createImageryProvider(provider: MapProvider): Cesium.ImageryProvider {
  switch (provider) {
    case 'vworld':
      return new Cesium.WebMapTileServiceImageryProvider({
        url: `${VWORLD_MAP_URL}${VWORLD_API_KEY}/Satellite/{TileMatrix}/{TileRow}/{TileCol}.png`,
        layer: 'Satellite', style: 'default', format: 'png', tileMatrixSetID: 'EPSG:3857',
        credit: new Cesium.Credit('VWorld Satellite Imagery'), maximumLevel: 18
      });
    case 'google':
      return new Cesium.UrlTemplateImageryProvider({
        url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
        credit: new Cesium.Credit('Google Satellite Imagery'), maximumLevel: 18
      });
    case 'osm':
      return new Cesium.OpenStreetMapImageryProvider({ url: 'https://a.tile.openstreetmap.org/', credit: new Cesium.Credit('OpenStreetMap contributors') });
    default:
      return new Cesium.WebMapTileServiceImageryProvider({
        url: `${VWORLD_MAP_URL}${VWORLD_API_KEY}/Satellite/{TileMatrix}/{TileRow}/{TileCol}.png`,
        layer: 'Satellite', style: 'default', format: 'png', tileMatrixSetID: 'EPSG:3857',
        credit: new Cesium.Credit('VWorld Satellite Imagery'), maximumLevel: 18
      });
  }
}

export function optimizeTileset(t: Cesium.Cesium3DTileset) {
  t.maximumScreenSpaceError = 16;
  t.skipLevelOfDetail = true;
  t.baseScreenSpaceError = 1024;
  t.skipScreenSpaceErrorFactor = 16;
  t.skipLevels = 1;
  t.immediatelyLoadDesiredLevelOfDetail = false;
  t.loadSiblings = false;
}

export function createTerrainProvider() {
  return Cesium.createWorldTerrainAsync({ requestWaterMask: true, requestVertexNormals: true });
}
