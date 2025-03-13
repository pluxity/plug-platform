import React, { useRef, useState, useEffect } from 'react';

import { HeightHeatmaps, PollutionPoint } from '@/types/pollution';

import useCesiumStore from '@/stores/cesiumStore';

import { TANCHEON_LOCATION, HEATMAP_GRID_CONFIG } from '@/constants/initialization';
import { POLLUTION_DATA } from '@/constants/pollutation';
import { create3DGridHeatmap, Heatmap3DOptions } from '@/lib/heatmap';
import { create2DHeatmaps, HeatmapOptions } from '@/lib/heatmap_2d';

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
  
  const [showTerrain, setShowTerrain] = useState(true);
  const [showBuildings, setShowBuildings] = useState(false);
  const buildingsRef = useRef<any[]>([]);
  const [savedCameraPosition, setSavedCameraPosition] = useState<any>(null);
  
  // 히트맵 상태
  const [show3DHeatmap, setShow3DHeatmap] = useState(false);
  const [show2DHeatmap, setShow2DHeatmap] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [simulationStep, setSimulationStep] = useState(0);
  const [currentPollutionData, setCurrentPollutionData] = useState<PollutionPoint[]>(POLLUTION_DATA);
  
  // 히트맵 엔티티 관리
  const [heatmap3DEntities, setHeatmap3DEntities] = useState<any[]>([]);
  const [heatmap2DEntities, setHeatmap2DEntities] = useState<any[]>([]);
  
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
            scale: 1.0,
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
    
  // 현재 데이터 반환
  const getCurrentData = () => {
    if (simulating) {
      return currentPollutionData;
    }
    
    return POLLUTION_DATA;
  };
  
  // 3D 히트맵 생성 함수
  const create3DHeatmap = async () => {
    if (!viewer) return;
    
    try {
      // 현재 데이터 가져오기
      const data = getCurrentData();
      
      // 히트맵 옵션 설정
      const options: Heatmap3DOptions = {
        minHeight: 0,
        maxHeight: 10,
        opacity: 0.3,
        segments: HEATMAP_GRID_CONFIG.SEGMENTS,
        colorScheme: [
          "rgba(0, 0, 255, 0)",          // 투명한 파란색 (낮은 값)
          "rgba(0, 0, 255, 0.5)",        // 반투명 파란색
          "rgba(0, 255, 255, 0.6)",      // 청록색
          "rgba(0, 255, 0, 0.7)",        // 초록색
          "rgba(255, 255, 0, 0.8)",      // 노란색
          "rgba(255, 0, 0, 0.9)"         // 빨간색 (높은 값)
        ],
        enhancedSmoothing: true,
        influenceRadius: 15,             // 2D 히트맵의 radius 값과 일치
        valueThreshold: HEATMAP_GRID_CONFIG.VALUE_THRESHOLD,
        colorOffset: 0.1,                
        colorMultiplier: 1.3,            
        weightDivisor: 0.7,              
        lowValueOpacity: 0,              
        transparencyThreshold: 0.25,
        baseHeight: 30
      };
      
      // 3D 격자 히트맵 생성
      console.log('부드러운 3D 격자 히트맵 생성');
      const entities = await create3DGridHeatmap(viewer, data, options);
      
      // 생성된 엔티티 저장
      setHeatmap3DEntities(entities);
      
    } catch (error) {
      console.error('3D 히트맵 생성 오류:', error);
    }
  };
  
  // 2D 히트맵 생성 함수
  const create2DHeatmap = async () => {
    if (!viewer) return;
    
    try {
      // 현재 데이터 가져오기
      const data = getCurrentData();
      
      // 히트맵 옵션 설정
      const options: HeatmapOptions = {
        gridSize: 256,
        canvasSize: 1024,
        radius: 15,
        blurRadius: 12, // 더 강한 블러 효과
        valueThreshold: HEATMAP_GRID_CONFIG.VALUE_THRESHOLD,
        showBorder: true,
        borderColor: 'rgba(255, 255, 255, 0.7)',
        borderWidth: 3,
        rotation: 0
      };
      
      // 2D 히트맵 생성 (고도별로)
      console.log('2D 히트맵 생성 (고도별)');
      const entities = await create2DHeatmaps(viewer, data, options);
      
      // 생성된 엔티티 저장
      setHeatmap2DEntities(entities);
      
    } catch (error) {
      console.error('2D 히트맵 생성 오류:', error);
    }
  };
  
  // 3D 히트맵 제거 함수
  const remove3DHeatmap = () => {
    if (!viewer) return;
    
    try {
      // 모든 3D 히트맵 엔티티 제거
      heatmap3DEntities.forEach(entity => {
        if (entity && viewer.entities.contains(entity)) {
          viewer.entities.remove(entity);
        }
      });
      
      // 엔티티 배열 초기화
      setHeatmap3DEntities([]);
      
    } catch (error) {
      console.error('3D 히트맵 제거 오류:', error);
    }
  };
  
  // 2D 히트맵 제거 함수
  const remove2DHeatmap = () => {
    if (!viewer) return;
    
    try {
      // 모든 2D 히트맵 엔티티 제거
      heatmap2DEntities.forEach(entity => {
        if (entity && viewer.entities.contains(entity)) {
          viewer.entities.remove(entity);
        }
      });
      
      // 엔티티 배열 초기화
      setHeatmap2DEntities([]);
      
    } catch (error) {
      console.error('2D 히트맵 제거 오류:', error);
    }
  };
  
  // 3D 히트맵 토글 함수
  const toggle3DHeatmap = async () => {
    if (!viewer) return;
    
    try {
      if (!show3DHeatmap) {
        // 3D 히트맵 생성
        await create3DHeatmap();
      } else {
        // 3D 히트맵 제거
        remove3DHeatmap();
      }
      
      // 히트맵 표시 상태 토글
      setShow3DHeatmap(!show3DHeatmap);
      
    } catch (error) {
      console.error('3D 히트맵 토글 오류:', error);
    }
  };
  
  // 2D 히트맵 토글 함수
  const toggle2DHeatmap = async () => {
    if (!viewer) return;
    
    try {
      if (!show2DHeatmap) {
        // 2D 히트맵 생성
        await create2DHeatmap();
      } else {
        // 2D 히트맵 제거
        remove2DHeatmap();
      }
      
      // 히트맵 표시 상태 토글
      setShow2DHeatmap(!show2DHeatmap);
      
    } catch (error) {
      console.error('2D 히트맵 토글 오류:', error);
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
          show3DHeatmap ? 'bg-green-500 text-white' : 'bg-white text-gray-800'
        }`}
        onClick={toggle3DHeatmap}
      >
        {show3DHeatmap ? `3D 히트맵 숨기기` : `3D 히트맵 표시하기`}
      </button>
      
      <button
        className={`px-4 py-2 rounded-lg shadow-md font-medium ${
          show2DHeatmap ? 'bg-purple-500 text-white' : 'bg-white text-gray-800'
        }`}
        onClick={toggle2DHeatmap}
      >
        {show2DHeatmap ? `2D 히트맵 숨기기` : `2D 히트맵 표시하기`}
      </button>      
    </div>
  );
};

export default MapToggleControls; 