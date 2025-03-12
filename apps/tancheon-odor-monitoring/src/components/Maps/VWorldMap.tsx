'use client';

import { useEffect, useRef, useState } from 'react';
import MapControls from './MapControls';
import MapToggleControls from './MapToggleControls';

import { TANCHEON_LOCATION } from '@/constants/initialization';
import useCesiumStore from '@/stores/cesiumStore';

interface VWorldMapProps {
  apiKey: string;
  height?: string;
}

declare global {
  interface Window {
    CESIUM_BASE_URL?: string;
    Cesium?: any;
  }
}
const VWorldMap: React.FC<VWorldMapProps> = ({ 
  apiKey, 
  height = '500px'
}) => {
  const cesiumContainerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const { viewer, setViewer } = useCesiumStore();

  // 컴포넌트가 마운트되었는지 확인
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Cesium CSS 로드
  useEffect(() => {
    if (!isMounted) return;

    // CSS 파일을 동적으로 로드하는 함수
    const loadCss = (url: string) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = url;
      document.head.appendChild(link);
      return link;
    };

    // Cesium 위젯 CSS 로드
    const widgetsCss = loadCss('/static/cesium/Widgets/widgets.css');

    return () => {
      // 언마운트 시 CSS 제거
      if (widgetsCss) {
        document.head.removeChild(widgetsCss);
      }
    };
  }, [isMounted]);



  // Cesium 초기화
  useEffect(() => {
    if (!isMounted || !cesiumContainerRef.current) return;

    let viewer: any = null;

    const initCesium = async () => {
      try {
        window.CESIUM_BASE_URL = '/static/cesium/';
        const Cesium = await import('cesium');
        
        // 이미 존재하는 뷰어 제거
        if (viewer) {
          viewer.destroy();
        }

        // cesiumContainerRef.current가 null이 아님을 보장
        if (!cesiumContainerRef.current) {
          console.error('Cesium 컨테이너 요소가 없습니다.');
          return;
        }

        // Cesium 뷰어 생성 - 타입 안전성 보장
        viewer = new Cesium.Viewer(cesiumContainerRef.current, {
          baseLayerPicker: false,
          timeline: false,
          animation: false,
          geocoder: false,
          homeButton: false,
          sceneModePicker: false,
          navigationHelpButton: false,
          fullscreenButton: false,
          creditContainer: document.createElement('div'),
          infoBox: false,
          sceneMode: Cesium.SceneMode.SCENE3D,
          shadows: false,
        });
        
        setViewer(viewer);
        
        viewer.imageryLayers.removeAll();

        const vworldSatelliteProvider = new Cesium.WebMapTileServiceImageryProvider({
          url: `https://api.vworld.kr/req/wmts/1.0.0/${apiKey}/Satellite/{TileMatrix}/{TileRow}/{TileCol}.jpeg`,
          layer: 'Satellite',
          style: 'default',
          format: 'image/jpeg',
          tileMatrixSetID: 'EPSG:3857',
          credit: new Cesium.Credit('VWorld Satellite Imagery'),
          maximumLevel: 19
        });
        viewer.imageryLayers.addImageryProvider(vworldSatelliteProvider);
        
        try {
          const worldTerrain = await Cesium.createWorldTerrainAsync({
            requestVertexNormals: true, 
            requestWaterMask: true
          });
          viewer.terrainProvider = worldTerrain;
        } catch (error) {
          console.warn('지형 데이터 로드 실패, 기본 타원체 지형을 사용합니다:', error);
          const ellipsoidTerrainProvider = new Cesium.EllipsoidTerrainProvider();
          viewer.terrainProvider = ellipsoidTerrainProvider;
        }

        viewer.scene.globe.enableLighting = true;
        viewer.scene.globe.depthTestAgainstTerrain = true;

        viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(
            TANCHEON_LOCATION.longitude,
            TANCHEON_LOCATION.latitude,
            TANCHEON_LOCATION.height
          ),
          orientation: {
            heading: TANCHEON_LOCATION.heading || 0,
            pitch: TANCHEON_LOCATION.pitch || -0.5,
            roll: TANCHEON_LOCATION.roll || 0
          }
        });
        
        setIsLoading(false);
      } catch (error) {
        console.error('Cesium 초기화 오류:', error);
        setError('지도를 로드하는 중 오류가 발생했습니다.');
        setIsLoading(false);
      }
    };

    initCesium();

    // 컴포넌트 언마운트 시 정리
    return () => {
      if (viewer) {
        viewer.destroy();
      }
    };
  }, [isMounted, apiKey]);

  if (!isMounted) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="animate-pulse">지도 초기화 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className={"w-full h-full relative"}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      <MapControls 
        initialPosition={TANCHEON_LOCATION}
        className="right-4 top-4" // 오른쪽 상단에 위치
      />
      
      <MapToggleControls className="left-4 bottom-4"  />
      
      <div
        ref={cesiumContainerRef}
        className="cesium-container w-full h-full"
      />
    </div>
  );
};

export default VWorldMap; 