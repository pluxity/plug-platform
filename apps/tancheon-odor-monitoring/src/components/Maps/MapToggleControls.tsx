import React from 'react';

import { useRef, useState } from 'react';

import { HeightHeatmaps } from '@/types/pollution';

import useCesiumStore from '@/stores/cesiumStore';

import { TANCHEON_LOCATION } from '@/constants/initialization';
import { POLLUTION_DATA } from '@/constants/pollutation';

interface VisibleHeatmaps extends Record<string, boolean> {
  '30m': boolean;
  '60m': boolean;
  '90m': boolean;
}

interface MapToggleControlsProps {
  className?: string;
}

/**
 * 맵 토글 컨트롤 컴포넌트 - 건물, 히트맵 등의 표시/숨김 토글 및 고도 선택 기능
 * VWorldMap과 OSMMap 모두에서 재사용 가능합니다.
 */
export const MapToggleControls: React.FC<MapToggleControlsProps> = ({  
  className = ''
}) => {

  const { viewer, setViewer } = useCesiumStore();
  
  const [showBuildings, setShowBuildings] = useState(false);
  const buildingsRef = useRef<any[]>([]);
  const [savedCameraPosition, setSavedCameraPosition] = useState<any>(null);
  const [showHeatmap, setShowHeatmap] = useState(false);

  // 고도 선택 옵션
  const heightOptions = [30, 60, 90];
  const [selectedHeight, setSelectedHeight] = useState<number>(30);
  
  // 히트맵 고도 옵션
  const heightHeatmapOptions: Array<keyof VisibleHeatmaps> = ['30m', '60m', '90m'];

  const heatmapPrimitiveRef = useRef<{[key in keyof HeightHeatmaps]: any | null}>({
    '30m': null,
    '60m': null,
    '90m': null
  });

  const [heatmapHeight, setHeatmapHeight] = useState<number>(30); // 히트맵 높이 (기본값 30m)
  const [visibleHeatmaps, setVisibleHeatmaps] = useState<VisibleHeatmaps>({
    '30m': true,
    '60m': false,
    '90m': false
  });

  // 고도 변경 처리 함수
  const onHeightChange = (height: number) => {
    setSelectedHeight(height);
    changeHeatmapHeight(height);
  };
  
  // 건물 추가/제거 함수
  const toggleBuildings = async () => {
    if (!viewer) return;
    
    try {
      const Cesium = await import('cesium');
      
      if (!showBuildings) {
        // 기존 건물 제거
        buildingsRef.current.forEach(entity => {
          if (entity && viewer.entities.contains(entity)) {
            viewer.entities.remove(entity);
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
        
        const funeralHall = viewer.entities.add({
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
          if (entity && viewer.entities.contains(entity)) {
            viewer.entities.remove(entity);
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

  // 타입 안전성을 위한 헬퍼 함수
  const safeObjectKeys = <T extends object>(obj: T): Array<keyof T> => {
    return Object.keys(obj) as Array<keyof T>;
  };
  
  // 히트맵 높이 변경 함수
  const changeHeatmapHeight = async (newHeight: number) => {
    if (!viewer) return;
    
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
    if (!viewer) return;
    
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
            const heightValue = parseInt(height as string);
            const heatmapEntity = viewer.entities.add({
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

  // 고도별 히트맵 동시 표시 토글 함수
  const toggleHeightHeatmap = (height: keyof HeightHeatmaps) => {
    if (!viewer || !showHeatmap) return;
    
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

  return (
    <div className={`absolute bottom-4 left-4 z-10 flex flex-col space-y-2 ${className}`}>

      <button
        className={`px-4 py-2 rounded-lg shadow-md font-medium ${
          showBuildings ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'
        }`}
        onClick={toggleBuildings}
      >
        {showBuildings ? `건물 숨기기` : `건물 표시하기`}
      </button>
      
      <button
        className={`px-4 py-2 rounded-lg shadow-md font-medium ${
          showHeatmap ? 'bg-green-500 text-white' : 'bg-white text-gray-800'
        }`}
        onClick={toggleHeatmap}
      >
        {showHeatmap ? `히트맵 숨기기` : `히트맵 표시하기`}
      </button>
      
      {showHeatmap && visibleHeatmaps && (
        <div className="mt-2 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-4 py-2 bg-gray-100 text-gray-800 font-medium text-center border-b border-gray-200">
            히트맵 고도 선택
          </div>
          <div className="flex flex-col">
            <div className="flex flex-row">
              {heightHeatmapOptions.map((height, index) => (
                <button
                  key={height}
                  className={`flex-1 px-2 py-2 text-sm font-medium ${
                    visibleHeatmaps[height] ? 'bg-blue-500 text-white' : 'hover:bg-gray-100 text-gray-800'
                  } ${
                    index > 0 && index < heightHeatmapOptions.length - 1 ? 'border-l border-r border-gray-200' : 
                    index > 0 ? 'border-l border-gray-200' : 
                    index < heightHeatmapOptions.length - 1 ? 'border-r border-gray-200' : ''
                  }`}
                  onClick={() => toggleHeightHeatmap(height)}
                >
                  {height} {visibleHeatmaps[height] ? '✓' : ''}
                </button>
              ))}
            </div>
            <div className="px-4 py-2 bg-gray-100 text-xs text-center border-t border-gray-200">
              여러 고도를 동시에 선택할 수 있습니다
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapToggleControls; 