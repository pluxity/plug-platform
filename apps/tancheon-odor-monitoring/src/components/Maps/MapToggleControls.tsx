import { useRef, useState, useEffect } from 'react';
import * as Cesium from 'cesium';

import useCesiumStore from '@/stores/cesiumStore';
import { usePollutionDataStore } from '@/stores/pollutionDataStore';
import { useHeatmapStore } from '@/stores/heatmapStore';

import { TANCHEON_LOCATION } from '@/constants/initialization';
import { getHeightLevels, HeatmapDataPoint, getHeatmapDataPointsByHeight } from '@/lib/heatmap_data';
import { HeatmapEntityMap, MapToggleControlsProps } from '@/types/heatmap';

const SIMULATION_HEIGHTS = [30, 40, 50, 60, 70, 80, 90];

export const MapToggleControls: React.FC<MapToggleControlsProps> = ({  
  className = ''
}) => {

  const { viewer } = useCesiumStore();
  
  const [showBuildings, setShowBuildings] = useState(false);
  const [show3DHeatmap, setShow3DHeatmap] = useState(false);
  const [show2DHeatmap, setShow2DHeatmap] = useState(false);
  const [selectedHeights, setSelectedHeights] = useState<number[]>(SIMULATION_HEIGHTS);
  const [simulationActive, setSimulationActive] = useState(false);
  const [simulationStep, setSimulationStep] = useState(0);
  
  const {
    dataByHeight,
    lastUpdated,
    isLoading,
    updateDataPoints
  } = usePollutionDataStore();
  
  const {
    create3DHeatmap,
    removeHeatmapInstance,
    removeAllHeatmapInstances,
    applyNewDataToHeatmap,
  } = useHeatmapStore();
  
  const buildingsRef = useRef<Cesium.Entity[]>([]);
  const heatmap2DRef = useRef<HeatmapEntityMap>({});
  const simulationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const baseDataRef = useRef<Record<number, HeatmapDataPoint[]>>({});
  const pollutionCenterRef = useRef<{longitude: number, latitude: number}>({
    longitude: TANCHEON_LOCATION.longitude + (Math.random() * 0.002 - 0.001),
    latitude: TANCHEON_LOCATION.latitude + (Math.random() * 0.002 - 0.001)
  });
  
  const heightLevels = getHeightLevels();

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
      }
      
      // 상태 업데이트
      setShowBuildings(!showBuildings);
      
    } catch (error) {
      console.error(error);
    }
  };

  // 3D 히트맵 토글 함수
  const toggle3DHeatmap = async () => {
    if (!viewer) return;
    
    if (show3DHeatmap) {
      removeAllHeatmapInstances(viewer);
      stopSimulation();
    } else {
      for (const height of selectedHeights) {
        await create3DHeatmap(viewer, height);
      }
      
      generateBaseData(selectedHeights);
    }
    
    setShow3DHeatmap(!show3DHeatmap);
  };

  const toggle2DHeatmap = async () => {
    if (show2DHeatmap) {
      await remove2DHeatmap();
    } else {
      for (const height of selectedHeights) {
        await create2DHeatmap(height);
      }
    }
    
    // 상태 업데이트
    setShow2DHeatmap(!show2DHeatmap);
  };
  
  // 선택한 높이 변경 처리
  const handleHeightChange = async (height: number, isChecked: boolean) => {
    if (!viewer) return;
    
    let newSelectedHeights: number[];
    
    if (isChecked) {
      newSelectedHeights = [...selectedHeights, height];
    } else {
      newSelectedHeights = selectedHeights.filter(h => h !== height);
    }
    
    // 상태 업데이트
    setSelectedHeights(newSelectedHeights);
    
    // 다음 렌더 사이클에서 데이터 처리를 수행
    setTimeout(() => {
      if (isChecked) {
        // 3D 히트맵 데이터 생성
        if (show3DHeatmap) {
          if (simulationActive) {
            generateSimulationDataForHeight(height, simulationStep);
          } else {
            generateBaseDataForHeight(height);
          }
          create3DHeatmap(viewer, height);
        }
        
        // 2D 히트맵 생성
        if (show2DHeatmap) {
          create2DHeatmap(height);
        }
      } else {
        // 히트맵 제거
        if (show3DHeatmap) {
          removeHeatmapInstance(height, viewer);
        }
        
        if (show2DHeatmap) {
          remove2DHeatmapAtHeight(height);
        }
      }
    }, 0);
  };
  
  // 특정 고도의 2D 히트맵 제거 함수
  const remove2DHeatmapAtHeight = async (height: number) => {
    if (!viewer) return;
    
    try {
      const entity = heatmap2DRef.current[height];
      // 엔티티 ID를 통한 조회 방식으로 변경
      if (entity) {
        // ID로 직접 확인 (contains 메소드 회피)
        try {
          const entityId = `heatmap-2d-${height}`;
          const foundEntity = viewer.entities.getById(entityId);
          if (foundEntity) {
            viewer.entities.remove(foundEntity);
          }
        } catch (innerError) {
          console.error(innerError);

          try {
            viewer.entities.remove(entity);
          } catch (removeError) {
            console.error(removeError);
          }
        }
        
        delete heatmap2DRef.current[height];

      } else {

      }
    } catch (error) {
      console.error(error);
    }
  };
  
  // 2D 히트맵 생성 함수
  const create2DHeatmap = async (height: number) => {
    if (!viewer) return;
    
    try {
      // 모듈 동적 import
      const { create2DHeatmap } = await import('@/lib/heatmap_2D');
      
      // 해당 고도의 히트맵이 이미 존재하는지 확인
      if (heatmap2DRef.current[height]) {
        // 기존 히트맵 제거
        await remove2DHeatmapAtHeight(height);
      }
      
      // 데이터 스토어에서 최신 데이터 가져오기
      const currentData: HeatmapDataPoint[] = dataByHeight[height] || [];
      
      // 최저값 필터링 (옵션) - 너무 낮은 값은 아예 데이터에서 제외
      // 히트맵을 더 선명하게 표시하기 위해 낮은 값(20 이하)은 표시하지 않음
      const filteredData: HeatmapDataPoint[] = currentData.filter(point => point.value > 20);
      
      console.log(`2D 히트맵 생성: ${height}m, 총 데이터 ${currentData.length}개 중 필터링 후 ${filteredData.length}개 데이터 포인트 사용`);
      
      // 2D 히트맵 생성
      // 값이 낮은 부분은 투명하게 설정 (valueThreshold 값을 높게 설정)
      const entity = await create2DHeatmap(viewer, height, {
        valueThreshold: 0.15, // 값 임계값 설정 (0.05 -> 0.15로 증가시켜 낮은 값 제외)
        customData: filteredData, // 필터링된 데이터 사용 (타입 오류 해결)
        blur: 0.8, // 블러 효과 증가 (부드러운 경계를 위해)
      });
      
      // 참조에 저장
      heatmap2DRef.current[height] = entity;
      
      return entity;
    } catch (error) {
      console.error('2D 히트맵 생성 오류:', error);
      return null;
    }
  };
  
  // 2D 히트맵 제거 함수
  const remove2DHeatmap = async () => {
    if (!viewer) return;
    
    try {
      // 모든 2D 히트맵 제거
      const heightsToRemove = Object.keys(heatmap2DRef.current);
      
      for (const heightStr of heightsToRemove) {
        const height = Number(heightStr);
        
        try {
          // ID로 엔티티 조회
          const entityId = `heatmap-2d-${height}`;
          const foundEntity = viewer.entities.getById(entityId);
          
          if (foundEntity) {
            viewer.entities.remove(foundEntity);
          }
        } catch (innerError) {
          console.error(innerError);
        }
      }
      
      // 참조 초기화
      heatmap2DRef.current = {};
      
    } catch (error) {
      console.error(error);
    }
  };
  
  const generateBaseData = (heights: number[]) => {
    heights.forEach(height => {
      generateBaseDataForHeight(height);
    });
    
    pollutionCenterRef.current = {
      longitude: TANCHEON_LOCATION.longitude + (Math.random() * 0.002 - 0.001),
      latitude: TANCHEON_LOCATION.latitude + (Math.random() * 0.002 - 0.001)
    };
  };
  
  const generateBaseDataForHeight = (height: number) => {
    const baseData = getHeatmapDataPointsByHeight(height);
    const modifiedData = baseData.map(point => ({
      ...point,
      value: 10 + Math.random() * 20 // 10-30 사이 값
    }));
    
    baseDataRef.current[height] = modifiedData;
    
    updateDataPoints(height, modifiedData);
  };
  
  // 오염 확산 시뮬레이션 단계별 데이터 생성
  const generateSimulationDataForHeight = (height: number, step: number) => {
    const baseData = baseDataRef.current[height];
    if (!baseData) return;
    
    // 오염 중심점
    const center = pollutionCenterRef.current;
    
    // 확산 범위 계산 (단계가 진행될수록 증가)
    const spreadRadius = 0.002 + (step * 0.001);
    
    // 최대 오염도 (단계가 진행될수록 약간 감소하고, 고도가 높을수록 약간 감소)
    // 고도 효과: 30m를 기준으로 높이에 따라 최대값이 감소 (높이가 10m 증가할 때마다 5씩 감소)
    const heightFactor = Math.max(0.3, 1 - ((height - 30) / 10) * 0.05);
    const maxPollution = (100 - (step * 3)) * heightFactor;
    
    // 모든 데이터 포인트 순회하며 오염도 계산
    const simulationData = baseData.map(point => {
      // 오염 중심으로부터의 거리 계산
      const distance = Math.sqrt(
        Math.pow(point.longitude - center.longitude, 2) + 
        Math.pow(point.latitude - center.latitude, 2)
      );
      
      // 기본값 (최소값 보존)
      const baseValue = 10 + Math.random() * 20;
      
      // 거리에 따른 오염도 계산
      let pollutionValue = baseValue;
      
      // 확산 범위 내에 있으면 오염도 증가
      if (distance <= spreadRadius) {
        // 가우시안 분포와 유사하게 감쇠
        const decay = Math.exp(-Math.pow(distance / (spreadRadius * 0.5), 2));
        pollutionValue = baseValue + (maxPollution * decay);
      }
      
      // 데이터 포인트 업데이트
      return {
        ...point,
        value: Math.min(100, Math.max(10, pollutionValue))
      };
    });
    
    // 데이터 스토어 업데이트
    updateDataPoints(height, simulationData);
  };
  
  // 시뮬레이션 시작 함수
  const startSimulation = () => {
    if (simulationActive) return;
    
    // 3D 히트맵 또는 2D 히트맵이 활성화되어 있는지 확인
    if (!show3DHeatmap && !show2DHeatmap) {
      alert('시뮬레이션을 위해 3D 또는 2D 히트맵을 활성화해야 합니다.');
      return;
    }
    
    // 시뮬레이션 고도가 선택되어 있는지 확인
    const hasSimulationHeight = selectedHeights.some(h => SIMULATION_HEIGHTS.includes(h));
    
    if (!hasSimulationHeight) {
      alert('시뮬레이션을 위해 최소 하나 이상의 고도(30m-90m)를 선택해야 합니다.');
      return;
    }
    
    // 상태 업데이트를 따로 실행
    setSimulationActive(true);
    setSimulationStep(0);
    
    // 오염 중심 재설정
    pollutionCenterRef.current = {
      longitude: TANCHEON_LOCATION.longitude + (Math.random() * 0.002 - 0.001),
      latitude: TANCHEON_LOCATION.latitude + (Math.random() * 0.002 - 0.001)
    };
    
    // 3D 히트맵 색상 스케일 업데이트 (낮은 값은 더 투명하게)
    if (show3DHeatmap) {
      update3DHeatmapColorScale([]);
    }
    
    // 상태가 업데이트된 후 다음 렌더 사이클에서 시뮬레이션 데이터 생성을 예약
    setTimeout(() => {
      // 기본 데이터로 초기화
      generateBaseData(selectedHeights);
      
      // 초기 단계 시뮬레이션 시작
      selectedHeights.forEach(height => {
        generateSimulationDataForHeight(height, 0);
      });
      
      // 3초 타이머 설정 (테스트용)
      simulationTimerRef.current = setInterval(() => {
        setSimulationStep(prevStep => {
          const nextStep = prevStep + 1;
          
          // 모든 고도에 대해 다음 단계 데이터 생성
          selectedHeights.forEach(height => {
            generateSimulationDataForHeight(height, nextStep);
          });
          
          // 10번째 단계 후 시뮬레이션 종료
          if (nextStep >= 10) {
            stopSimulation();
          }
          
          return nextStep;
        });
      }, 3000);
    }, 0);
  };
  
  // 시뮬레이션 중지 함수
  const stopSimulation = () => {
    if (simulationTimerRef.current) {
      clearInterval(simulationTimerRef.current);
      simulationTimerRef.current = null;
    }
    setSimulationActive(false);
  };
  
  // 데이터가 변경되면 히트맵 업데이트
  useEffect(() => {
    if (!lastUpdated || !show3DHeatmap || !viewer) return;
    
    // 데이터가 있는지 확인
    const hasData = selectedHeights.some(height => dataByHeight[height]?.length > 0);
    if (!hasData) return;
    
    selectedHeights.forEach(height => {
      const data = dataByHeight[height];
      if (data && data.length > 0) {
        applyNewDataToHeatmap(viewer, height, data);
      }
    });
    
  }, [lastUpdated, show3DHeatmap, selectedHeights, dataByHeight, viewer, applyNewDataToHeatmap]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      // 모든 리소스 정리
      if (viewer) {
        // 건물 제거
        buildingsRef.current.forEach(entity => {
          if (entity && viewer.entities.contains(entity)) {
            viewer.entities.remove(entity);
          }
        });
        
        // 2D 히트맵 제거
        Object.values(heatmap2DRef.current).forEach(entity => {
          if (entity && viewer.entities.contains(entity)) {
            viewer.entities.remove(entity);
          }
        });
        
        // 3D 히트맵 제거
        removeAllHeatmapInstances(viewer);
      }
      
      // 컴포넌트 언마운트시 시뮬레이션 중지
      stopSimulation();
    };
  }, [viewer, removeAllHeatmapInstances]);

  const isSimulationHeight = (height: number) => SIMULATION_HEIGHTS.includes(height);

  return (
    <div className={`absolute bottom-4 left-4 z-10 flex flex-col ${className}`}>
      <div className="bg-white rounded-lg shadow-md p-3">
        <div className="flex justify-between items-center mb-3">
          <label className="block text-sm font-medium text-gray-700">
            고도 선택
          </label>
        </div>
        
        <div className="max-h-40 overflow-y-auto p-2">
          {heightLevels.filter(height => height <= 90).map((height) => (
            <div key={height} className="flex items-center mb-2">
              <input
                type="checkbox"
                id={`height-${height}`}
                checked={selectedHeights.includes(height)}
                onChange={(e) => handleHeightChange(height, e.target.checked)}
                className="mr-2"
              />
              <label 
                htmlFor={`height-${height}`} 
                className={`text-sm ${isSimulationHeight(height) ? 'font-bold text-blue-600' : ''}`}
                title={isSimulationHeight(height) ? '시뮬레이션에 사용되는 고도' : ''}
              >
                {height}m {isSimulationHeight(height) && '✓'}
              </label>
            </div>
          ))}
        </div>
      </div>

      <button
        className={`px-4 py-2 rounded-lg shadow-md font-medium mt-1 ${
          showBuildings ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'
        }`}
        onClick={toggleBuildings}
      >
        {showBuildings ? `건물 숨기기` : `건물 표시하기`}
      </button>
      
      <button
        className={`px-4 py-2 rounded-lg shadow-md font-medium mt-1 ${
          show3DHeatmap ? 'bg-green-500 text-white' : 'bg-white text-gray-800'
        }`}
        onClick={toggle3DHeatmap}
        disabled={selectedHeights.length === 0}
      >
        {show3DHeatmap ? `3D 히트맵 숨기기` : `3D 히트맵 표시하기`}
      </button>
      
              <button
        className={`px-4 py-2 rounded-lg shadow-md font-medium mt-1 ${
          show2DHeatmap ? 'bg-purple-500 text-white' : 'bg-white text-gray-800'
        }`}
        onClick={toggle2DHeatmap}
        disabled={selectedHeights.length === 0}
      >
        {show2DHeatmap ? `2D 히트맵 숨기기` : `2D 히트맵 표시하기`}
              </button>
      
      {show3DHeatmap && (
        <>
                <button
            className={`px-4 py-3 rounded-lg shadow-md font-medium mt-1 ${
              simulationActive ? 'bg-red-500 text-white' : 'bg-yellow-500 text-white'
            }`}
            onClick={simulationActive ? stopSimulation : startSimulation}
            disabled={isLoading}
          >
            {simulationActive 
              ? `시뮬레이션 중지 (${simulationStep}/10)` 
              : '오염 확산 시뮬레이션 시작'}
          </button>
          
          {!simulationActive && (
            <button
              className="px-4 py-3 rounded-lg shadow-md font-medium bg-yellow-500 text-white mt-1"
              onClick={() => generateBaseData(selectedHeights)}
              disabled={isLoading}
            >
              {isLoading ? '데이터 초기화 중...' : '기본 데이터로 재설정'}
                </button>
          )}
        </>
      )}
    </div>
  );
};

export default MapToggleControls; 