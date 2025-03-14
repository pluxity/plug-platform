'use client';

import { useEffect, useRef, useState } from 'react';
import MapControls from './MapControls';
import MapToggleControls from './MapToggleControls';

import * as Cesium from 'cesium';
import { TANCHEON_LOCATION } from '@/constants/initialization';
import useCesiumStore from '@/stores/cesiumStore';

interface VWorldMapProps {
  apiKey: string;
  height?: string;
}

declare global {
  interface Window {
    CESIUM_BASE_URL?: string;
    Cesium?: Cesium.Viewer;
  }
}
const VWorldMap: React.FC<VWorldMapProps> = ({ 
  apiKey
}) => {
  const cesiumContainerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const { setViewer } = useCesiumStore();

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
  }, [isMounted, setViewer]);



  // Cesium 초기화
  useEffect(() => {
    if (!isMounted || !cesiumContainerRef.current) return;

    let viewer: Cesium.Viewer | null = null;

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
          // 초기 로딩을 위한 기본 지형 제공자
          terrainProvider: new Cesium.EllipsoidTerrainProvider(),
        });
        
        // 뷰어 생성 직후 바로 카메라 위치 설정 (애니메이션 없이 즉시 이동)
        viewer.camera.setView({
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
        
        setViewer(viewer);
        
        viewer.imageryLayers.removeAll();

        // 이미지 레이어 로드 후 지형 데이터 처리 함수
        const loadTerrainAfterImagery = async () => {
          try {
            const worldTerrain = await Cesium.createWorldTerrainAsync({
              requestVertexNormals: true, 
              requestWaterMask: true
            });
            
            if (viewer && !viewer.isDestroyed()) {
              viewer.terrainProvider = worldTerrain;
              viewer.scene.globe.enableLighting = true;
              viewer.scene.globe.depthTestAgainstTerrain = true;
            }
          } catch (error) {
            console.warn('지형 데이터 로드 실패, 기본 타원체 지형을 사용합니다:', error);
            if (viewer && !viewer.isDestroyed()) {
              const ellipsoidTerrainProvider = new Cesium.EllipsoidTerrainProvider();
              viewer.terrainProvider = ellipsoidTerrainProvider;
            }
          } finally {
            setIsLoading(false);
          }
        };

        // 이미지 레이어 로드
        try {
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
          
          // 이미지 로드 완료 후 지형 데이터 로드
          setTimeout(loadTerrainAfterImagery, 500); // 500ms 지연 후 지형 데이터 로드
        } catch (error) {
          console.warn('VWorld 이미지 레이어 초기화 실패:', error);
          setIsLoading(false);
        }
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
  }, [isMounted, setViewer, apiKey]);

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