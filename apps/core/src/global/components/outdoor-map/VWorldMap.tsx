import React, { useMemo } from 'react';
import * as Cesium from 'cesium';
import { Viewer as ResiumViewer, Scene, ImageryLayer } from 'resium';
import InitialCameraSetup from './CameraSetup';

// VWorld API 정보
export const VWORLD_MAP_URL = 'https://api.vworld.kr/req/wmts/1.0.0/';
export const VWORLD_API_KEY = '8017E982-68EB-3F80-A79F-2FEA16608C65';

// 지도 제공자 타입 정의
export type MapProvider = 'vworld' | 'google' | 'osm';

interface VWorldMapProps {
  className?: string;
  children?: React.ReactNode;
  mapProvider?: MapProvider;
}

export default function VWorldMap({ 
  className = "w-full h-full", 
  children, 
  mapProvider = 'vworld' 
}: VWorldMapProps) {
  
  // 지도 제공자에 따른 ImageryProvider를 메모이제이션
  const imageryProvider = useMemo(() => {
    switch (mapProvider) {
      case 'vworld':
        return new Cesium.WebMapTileServiceImageryProvider({
          url: `${VWORLD_MAP_URL}${VWORLD_API_KEY}/Satellite/{TileMatrix}/{TileRow}/{TileCol}.png`,
          layer: 'Satellite',
          style: 'default',
          format: 'png',
          tileMatrixSetID: 'EPSG:3857',
          credit: new Cesium.Credit('VWorld Satellite Imagery'),
          maximumLevel: 18
        });
      
      case 'google':
        // Google Maps (실제 API 키 필요)
        return new Cesium.UrlTemplateImageryProvider({
          url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
          credit: new Cesium.Credit('Google Satellite Imagery'),
          maximumLevel: 18
        });
      
      case 'osm':
        // OpenStreetMap
        return new Cesium.OpenStreetMapImageryProvider({
          url: 'https://a.tile.openstreetmap.org/',
          credit: new Cesium.Credit('OpenStreetMap contributors')
        });
      
      default:
        return new Cesium.WebMapTileServiceImageryProvider({
          url: `${VWORLD_MAP_URL}${VWORLD_API_KEY}/Satellite/{TileMatrix}/{TileRow}/{TileCol}.png`,
          layer: 'Satellite',
          style: 'default',
          format: 'png',
          tileMatrixSetID: 'EPSG:3857',
          credit: new Cesium.Credit('VWorld Satellite Imagery'),
          maximumLevel: 18
        });
    }
  }, [mapProvider]);

  return (
    <>
      {/* Hidden credit container to suppress Cesium credits */}
      <div id="cesium-credit-container" style={{ display: 'none' }}></div>
      
      <ResiumViewer 
        className={`cesium-container ${className}`}
        full
        sceneMode={Cesium.SceneMode.SCENE3D}
        animation={false}
        timeline={false}
        baseLayerPicker={false}
        fullscreenButton={false}
        vrButton={false}
        geocoder={false}
        homeButton={false}
        infoBox={false}
        sceneModePicker={false}
        selectionIndicator={false}
        navigationHelpButton={false}
        navigationInstructionsInitiallyVisible={false}
        creditContainer="cesium-credit-container"
      >
        <Scene />
        
        <InitialCameraSetup />
        
        {/* 동적 지도 레이어 */}
        <ImageryLayer imageryProvider={imageryProvider} />
        {children}
      </ResiumViewer>
    </>
  );
}
