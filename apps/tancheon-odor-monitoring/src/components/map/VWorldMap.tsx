'use client';

import React, { useEffect, useRef, useState } from 'react';
import MapControls from './MapControls';
import MapToggleControls from './MapToggleControls';
import Cesium from 'cesium';

import { HeightHeatmaps } from '@/types/pollution';

import { TANCHEON_LOCATION } from '@/constants/initialization';
import { POLLUTION_DATA } from '@/constants/pollutation';

interface VWorldMapProps {
  apiKey: string;
  height?: string;
}

// 타입 확장
declare global {
  interface Window {
    CESIUM_BASE_URL?: string;
    Cesium?: any;
  }
}
interface VisibleHeatmaps extends Record<string, boolean> {
  '30m': boolean;
  '60m': boolean;
  '90m': boolean;
}

const VWorldMap: React.FC<VWorldMapProps> = ({ 
  apiKey, 
  height = '500px'
}) => {
  const cesiumContainerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const viewerRef = useRef<any>(null);

  const [showBuildings, setShowBuildings] = useState(false);
  const buildingsRef = useRef<any[]>([]);
  const [savedCameraPosition, setSavedCameraPosition] = useState<any>(null);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const heatmapPrimitiveRef = useRef<{[key in keyof HeightHeatmaps]: any | null}>({
    '30m': null,
    '60m': null,
    '90m': null
  }); // 고도별 히트맵 프리미티브 참조
  const [heatmapHeight, setHeatmapHeight] = useState<number>(30); // 히트맵 높이 (기본값 30m)
  const [visibleHeatmaps, setVisibleHeatmaps] = useState<VisibleHeatmaps>({
    '30m': true,
    '60m': false,
    '90m': false
  }); // 각 고도별 히트맵 표시 여부

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

  // 건물 추가/제거 함수
  const toggleBuildings = async () => {
    if (!viewerRef.current) return;
    
    try {
      const Cesium = await import('cesium');
      
      if (!showBuildings) {
        // 기존 건물 제거
        buildingsRef.current.forEach(entity => {
          if (entity && viewerRef.current.entities.contains(entity)) {
            viewerRef.current.entities.remove(entity);
          }
        });
        buildingsRef.current = [];
        
        const modelPosition = {
          longitude: TANCHEON_LOCATION.longitude,
          latitude: TANCHEON_LOCATION.latitude,
          height: 0
        };
        
        const position = Cesium.Cartesian3.fromDegrees(
          modelPosition.longitude,
          modelPosition.latitude,
          modelPosition.height
        );
        
        const orientation = Cesium.Transforms.headingPitchRollQuaternion(
          position,
          new Cesium.HeadingPitchRoll(0, 0, 0)
        );
        
        const funeralHall = viewerRef.current.entities.add({
          name: 'FuneralHallModel',
          position: position,
          orientation: orientation,
          model: {
            uri: '/models/funeralhall.glb',
            scale: 10.0,
            heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND
          }
        });
        
        buildingsRef.current.push(funeralHall);       
        
      } else {
        // 건물 제거
        buildingsRef.current.forEach(entity => {
          if (entity && viewerRef.current.entities.contains(entity)) {
            viewerRef.current.entities.remove(entity);
          }
        });
        buildingsRef.current = [];
        console.log('장례식장 모델 제거 완료');
      }
      
      // 상태 업데이트
      setShowBuildings(!showBuildings);
      
    } catch (error) {
      console.error('모델 토글 오류:', error);
    }
  };

  // 현재 카메라 위치 저장
  const saveCurrentCameraPosition = () => {
    if (!viewerRef.current) return;
    
    try {
      const camera = viewerRef.current.camera;
      const position = camera.positionCartographic;
      const heading = camera.heading;
      const pitch = camera.pitch;
      const roll = camera.roll;
      
      const savedPosition = {
        longitude: position.longitude,
        latitude: position.latitude,
        height: position.height,
        heading: heading,
        pitch: pitch,
        roll: roll
      };
      
      setSavedCameraPosition(savedPosition);
      console.log('카메라 위치 저장 완료:', savedPosition);
      
      // 사용자에게 알림
      alert('현재 카메라 위치가 저장되었습니다.');
    } catch (error) {
      console.error('카메라 위치 저장 오류:', error);
    }
  };

  // 저장된 카메라 위치로 이동
  const flyToSavedPosition = async () => {
    if (!viewerRef.current || !savedCameraPosition) return;
    
    try {
      const Cesium = await import('cesium');
      
      viewerRef.current.camera.flyTo({
        destination: Cesium.Cartesian3.fromRadians(
          savedCameraPosition.longitude,
          savedCameraPosition.latitude,
          savedCameraPosition.height
        ),
        orientation: {
          heading: savedCameraPosition.heading,
          pitch: savedCameraPosition.pitch,
          roll: savedCameraPosition.roll
        },
        duration: 1.5
      });
      
      console.log('저장된 카메라 위치로 이동 완료');
    } catch (error) {
      console.error('카메라 이동 오류:', error);
    }
  };

  // 확대
  const zoomIn = () => {
    if (!viewerRef.current) return;
    
    try {
      const camera = viewerRef.current.camera;
      const zoomAmount = camera.positionCartographic.height * 0.5;
      camera.zoomIn(zoomAmount);
    } catch (error) {
      console.error('확대 오류:', error);
    }
  };

  // 축소
  const zoomOut = () => {
    if (!viewerRef.current) return;
    
    try {
      const camera = viewerRef.current.camera;
      const zoomAmount = camera.positionCartographic.height * 0.5;
      camera.zoomOut(zoomAmount);
    } catch (error) {
      console.error('축소 오류:', error);
    }
  };

  // 타입 안전성을 위한 헬퍼 함수
  const safeObjectKeys = <T extends object>(obj: T): Array<keyof T> => {
    return Object.keys(obj) as Array<keyof T>;
  };

  // 히트맵 높이 변경 함수
  const changeHeatmapHeight = async (newHeight: number) => {
    if (!viewerRef.current) return;
    
    try {
      // 높이 변경
      setHeatmapHeight(newHeight);
      
      // 해당 고도의 히트맵 표시
      const heightKey = `${newHeight}m` as keyof HeightHeatmaps;
      
      // 모든 고도의 히트맵 표시 상태 업데이트
      const newVisibleHeatmaps = {
        '30m': heightKey === '30m',
        '60m': heightKey === '60m',
        '90m': heightKey === '90m'
      };
      
      // 이미 생성된 히트맵이 있다면 표시/숨김 처리
      safeObjectKeys(heatmapPrimitiveRef.current).forEach(key => {
        if (heatmapPrimitiveRef.current[key]) {
          // 타입 안전성 보장을 위한 타입 가드
          const typedKey = key as keyof typeof newVisibleHeatmaps;
          heatmapPrimitiveRef.current[key].show = newVisibleHeatmaps[typedKey];
        }
      });
      
      setVisibleHeatmaps(newVisibleHeatmaps);
      console.log(`히트맵 높이 변경: ${newHeight}m`);
    } catch (error) {
      console.error('히트맵 높이 변경 오류:', error);
    }
  };

  // 히트맵 토글 함수
  const toggleHeatmap = async () => {
    if (!viewerRef.current) return;
    
    try {
      const Cesium = await import('cesium');
      
      if (!showHeatmap) {
        // 히트맵이 표시되지 않은 상태라면 표시
        const heightKey = `${heatmapHeight}m` as keyof HeightHeatmaps;
        
        // 각 고도별 히트맵 생성 또는 표시
        for (const height of ['30m', '60m', '90m'] as Array<keyof HeightHeatmaps>) {
          if (!heatmapPrimitiveRef.current[height]) {
            // 히트맵 데이터 준비
            console.log(`${height} 오염도 히트맵 생성 시작`);
            
            // 히트맵 영역 경계 계산
            const data = POLLUTION_DATA;
            const west = Math.min(...data.map(p => p.longitude)) - 0.001;
            const south = Math.min(...data.map(p => p.latitude)) - 0.001;
            const east = Math.max(...data.map(p => p.longitude)) + 0.001;
            const north = Math.max(...data.map(p => p.latitude)) + 0.001;
            
            // 히트맵 이미지 생성
            const canvas = document.createElement('canvas');
            const size = 1024; 
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d')!;
            
            // 배경을 투명하게 설정
            ctx.clearRect(0, 0, size, size);
            
            // 컬러맵 캔버스 생성 (그라데이션)
            const colorMapCanvas = document.createElement('canvas');
            colorMapCanvas.width = 256;
            colorMapCanvas.height = 1;
            const colorMapCtx = colorMapCanvas.getContext('2d')!;
            const colorGradient = colorMapCtx.createLinearGradient(0, 0, 256, 0);
            colorGradient.addColorStop(0.0, 'blue');   // 낮은 값
            colorGradient.addColorStop(0.3, 'cyan');   // 낮은-중간 값
            colorGradient.addColorStop(0.5, 'lime');   // 중간 값
            colorGradient.addColorStop(0.7, 'yellow'); // 중간-높은 값
            colorGradient.addColorStop(1.0, 'red');    // 높은 값
            colorMapCtx.fillStyle = colorGradient;
            colorMapCtx.fillRect(0, 0, 256, 1);
            
            // 각 데이터 포인트를 캔버스에 그리기
            data.forEach(point => {
              // 좌표를 캔버스 좌표로 변환
              const x = ((point.longitude - west) / (east - west)) * size;
              const y = size - ((point.latitude - south) / (north - south)) * size; // y축 반전
              
              // 그라디언트 생성
              const radius = 80; // 더 큰 반경
              const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
              
              // 컬러맵에서 색상 가져오기
              const colorIndex = Math.floor(point.value * 255);
              const pixelData = colorMapCtx.getImageData(colorIndex, 0, 1, 1).data;
              const color = `rgba(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]}`;
              
              gradient.addColorStop(0, `${color}, ${point.value * 0.8})`);
              gradient.addColorStop(0.7, `${color}, ${point.value * 0.4})`);
              gradient.addColorStop(1, `rgba(0, 0, 255, 0)`); 
              
              // 원 그리기
              ctx.fillStyle = gradient;
              ctx.beginPath();
              ctx.arc(x, y, radius, 0, Math.PI * 2);
              ctx.fill();
            });
            
            // 히트맵 텍스처 생성
            const heatmapTexture = new Cesium.ImageMaterialProperty({
              image: canvas,
              transparent: true
            });
            
            // 히트맵 영역 생성
            const rectangle = Cesium.Rectangle.fromDegrees(west, south, east, north);
            
            // 히트맵 엔티티 생성
            const heightValue = parseInt(height);
            const heatmapEntity = viewerRef.current.entities.add({
              rectangle: {
                coordinates: rectangle,
                material: heatmapTexture,
                height: heightValue, // 고도별 높이 설정
                heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND
              }
            });
            
            // 히트맵 참조 저장
            heatmapPrimitiveRef.current[height] = heatmapEntity;
            
            // 현재 선택된 고도가 아니면 숨김
            heatmapEntity.show = height === heightKey;
            
            console.log(`${height} 오염도 히트맵 생성 완료`);
          } else {
            // 이미 생성된 히트맵이 있다면 선택된 고도만 표시
            heatmapPrimitiveRef.current[height].show = height === heightKey;
          }
        }
        
        // 현재 표시 상태 업데이트
        setVisibleHeatmaps({
          '30m': heightKey === '30m',
          '60m': heightKey === '60m',
          '90m': heightKey === '90m'
        });
        
      } else {
        // 히트맵이 표시된 상태라면 모두 숨김
        safeObjectKeys(heatmapPrimitiveRef.current).forEach(key => {
          if (heatmapPrimitiveRef.current[key]) {
            heatmapPrimitiveRef.current[key].show = false;
          }
        });
        console.log('모든 오염도 히트맵 숨김');
      }
      
      // 상태 업데이트
      setShowHeatmap(!showHeatmap);
      
    } catch (error) {
      console.error('히트맵 토글 오류:', error);
    }
  };

  // 고도별 히트맵 동시 표시 토글 함수 - 원래 코드로 복원
  const toggleHeightHeatmap = (height: keyof HeightHeatmaps) => {
    if (!viewerRef.current || !showHeatmap) return;
    
    try {
      // 해당 고도의 히트맵 표시 상태 토글
      const newVisibleHeatmaps = { ...visibleHeatmaps };
      newVisibleHeatmaps[height] = !newVisibleHeatmaps[height];
      
      // 히트맵 표시 상태 업데이트
      if (heatmapPrimitiveRef.current[height]) {
        heatmapPrimitiveRef.current[height].show = newVisibleHeatmaps[height];
      }
      
      setVisibleHeatmaps(newVisibleHeatmaps);
    } catch (error) {
      console.error('히트맵 토글 오류:', error);
    }
  };

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
          creditContainer: document.createElement('div'), // 크레딧 정보 숨김
          infoBox: false,
          sceneMode: Cesium.SceneMode.SCENE3D,
          shadows: false,
        });
        
        viewerRef.current = viewer;
        
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
      
      // 바람 방향 표시 제거
      const windDirectionContainer = cesiumContainerRef.current?.querySelector('.wind-direction-container');
      
      if (windDirectionContainer) {
        cesiumContainerRef.current?.removeChild(windDirectionContainer);
      }
    };
  }, [isMounted, apiKey, TANCHEON_LOCATION]);

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
        viewerRef={viewerRef}
        initialPosition={TANCHEON_LOCATION}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        className="right-4 top-4" // 오른쪽 상단에 위치
      />
      
      <MapToggleControls
        showBuildings={showBuildings}
        onToggleBuildings={toggleBuildings}
        buildingLabel="장례식장 모델"
        
        showHeatmap={showHeatmap}
        onToggleHeatmap={toggleHeatmap}
        heatmapLabel="오염도 히트맵"
        
        // 타입 안전성 개선
        visibleHeatmaps={Object.fromEntries(
          Object.entries(visibleHeatmaps)
        ) as Record<string, boolean>}
        onToggleHeightHeatmap={(height: string) => {
          if (height === '30m' || height === '60m' || height === '90m') {
            toggleHeightHeatmap(height);
          }
        }}
        className="left-4 bottom-4" // 왼쪽 하단에 위치
      />
      
      <div
        ref={cesiumContainerRef}
        className="cesium-container w-full h-full"
      />
    </div>
  );
};

export default VWorldMap; 