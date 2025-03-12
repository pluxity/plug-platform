'use client';

import React, { useEffect, useRef, useState } from 'react';
import MapControls from './MapControls';
import MapToggleControls from './MapToggleControls';

import { TANCHEON_LOCATION } from '@/constants/initialization';
import useCesiumStore from '@/stores/cesiumStore';

interface OSMMapProps {
  height?: string;
}

// 타입 확장
declare global {
  interface Window {
    CESIUM_BASE_URL?: string;
  }
}

// 탄천 좌표 (대략적인 위치)
const OSMMap: React.FC<OSMMapProps> = ({ height = '500px' }) => {
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
        
        if (viewer) {
          viewer.destroy();
        }

        // 컨테이너 요소가 있는지 다시 확인
        if (!cesiumContainerRef.current) return;

        // Cesium Viewer 생성
        viewer = new Cesium.Viewer(cesiumContainerRef.current, {
          baseLayerPicker: false,
          timeline: false,
          animation: false,
          geocoder: false,
          homeButton: false,
          sceneModePicker: false,
          navigationHelpButton: false,
          fullscreenButton: false,
          creditContainer: document.createElement('div'), // 크레딧 정보 숨김
          infoBox: false, // InfoBox 비활성화
          terrainProvider: new Cesium.EllipsoidTerrainProvider(), // 초기 지형 제공자
        });

        // 즉시 카메라 위치 설정
        viewer.camera.setView({
          destination: Cesium.Cartesian3.fromDegrees(
            TANCHEON_LOCATION.longitude,
            TANCHEON_LOCATION.latitude,
            TANCHEON_LOCATION.height
          ),
          orientation: {
            heading: Cesium.Math.toRadians(0),
            pitch: Cesium.Math.toRadians(-45),
            roll: 0.0
          }
        });

        setViewer(viewer);

        viewer.imageryLayers.removeAll();

        const osmProvider = new Cesium.OpenStreetMapImageryProvider({
          url: 'https://a.tile.openstreetmap.org/'
        });
        viewer.imageryLayers.addImageryProvider(osmProvider);

        // 기본 지형 제공자 설정은 이미 초기화할 때 설정했으므로 제거
        // const terrainProvider = new Cesium.EllipsoidTerrainProvider();
        // viewer.terrainProvider = terrainProvider;

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
  }, [isMounted]);

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

export default OSMMap; 