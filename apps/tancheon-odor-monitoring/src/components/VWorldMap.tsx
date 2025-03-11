'use client';

import React, { useEffect, useRef, useState } from 'react';

interface VWorldMapProps {
  apiKey: string;
  height?: string;
  initialPosition?: {
    longitude: number;
    latitude: number;
    height: number;
    heading?: number;
    pitch?: number;
    roll?: number;
  };
}

// 타입 확장
declare global {
  interface Window {
    CESIUM_BASE_URL?: string;
    Cesium?: any;
  }
}

// 탄천 좌표 (대략적인 위치)
const TANCHEON_LOCATION = {
  heading : 3.7508082854940867,
  height : 295.5992540345483,
  longitude: 127.083264,
  latitude: 37.496698,
  pitch : -0.42956590230192493,
  roll : 0.000049202296158235015
};

// 샘플 오염도 데이터 (위도, 경도, 고도, 오염도 수치)
const POLLUTION_DATA = [
  // 탄천 주변 지역 (중심점 기준)
  { longitude: 127.083264, latitude: 37.496698, height: 10, value: 0.8 }, // 중심점, 높은 오염도
  { longitude: 127.082264, latitude: 37.495698, height: 20, value: 0.7 },
  { longitude: 127.084264, latitude: 37.497698, height: 30, value: 0.9 },
  { longitude: 127.081264, latitude: 37.494698, height: 40, value: 0.6 },
  { longitude: 127.085264, latitude: 37.498698, height: 50, value: 0.5 },
  
  // 주변 지역 (북쪽)
  { longitude: 127.083264, latitude: 37.499698, height: 60, value: 0.4 },
  { longitude: 127.082264, latitude: 37.500698, height: 70, value: 0.3 },
  { longitude: 127.084264, latitude: 37.501698, height: 80, value: 0.2 },
  
  // 주변 지역 (남쪽)
  { longitude: 127.083264, latitude: 37.493698, height: 90, value: 0.7 },
  { longitude: 127.082264, latitude: 37.492698, height: 100, value: 0.6 },
  { longitude: 127.084264, latitude: 37.491698, height: 110, value: 0.5 },
  
  // 주변 지역 (동쪽)
  { longitude: 127.086264, latitude: 37.496698, height: 120, value: 0.4 },
  { longitude: 127.087264, latitude: 37.495698, height: 130, value: 0.3 },
  { longitude: 127.088264, latitude: 37.497698, height: 140, value: 0.2 },
  
  // 주변 지역 (서쪽)
  { longitude: 127.080264, latitude: 37.496698, height: 150, value: 0.6 },
  { longitude: 127.079264, latitude: 37.495698, height: 160, value: 0.5 },
  { longitude: 127.078264, latitude: 37.497698, height: 170, value: 0.4 },
];

// Cesium Ion 기본 액세스 토큰 (무료 계정용)
const CESIUM_ION_DEFAULT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlYWE1OWUxNy1mMWZiLTQzYjYtYTQ0OS1kMWFjYmFkNjc5YzciLCJpZCI6NTc3MzMsImlhdCI6MTYyMjY0NjQ5NH0.XcKpgANiY22ejiFfyh4QPSrd5bLG8UXTrHcRKbwfNyo';

const VWorldMap: React.FC<VWorldMapProps> = ({ 
  apiKey, 
  height = '500px',
  initialPosition = TANCHEON_LOCATION
}) => {
  const cesiumContainerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const viewerRef = useRef<any>(null);
  const [showBuildings, setShowBuildings] = useState(false);
  const buildingsRef = useRef<any[]>([]);
  const [savedCameraPosition, setSavedCameraPosition] = useState<any>(null);
  const [showHeatmap, setShowHeatmap] = useState(false); // 히트맵 표시 상태
  const heatmapLayerRef = useRef<any>(null); // 히트맵 레이어 참조

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
        
        // 장례식장 모델 추가
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
            //minimumPixelSize: 128,
            //maximumScale: 20000,
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

  // 히트맵 토글 함수 (연기/구름 형태)
  const toggleHeatmap = async () => {
    if (!viewerRef.current) return;
    
    try {
      const Cesium = await import('cesium');
      
      if (!showHeatmap) {
        // 히트맵이 표시되지 않은 상태라면 표시
        if (!heatmapLayerRef.current) {
          // 연기/구름 형태의 오염도 시각화 생성
          const pollutionEntities: any[] = [];
          
          // 오염도 데이터를 기반으로 연기/구름 효과 생성
          POLLUTION_DATA.forEach(point => {
            // 오염도 값에 따라 색상 결정 (0.0-1.0 범위)
            let color;
            if (point.value < 0.3) {
              color = Cesium.Color.BLUE.withAlpha(0.3); // 낮은 오염도: 파란색
            } else if (point.value < 0.6) {
              color = Cesium.Color.YELLOW.withAlpha(0.5); // 중간 오염도: 노란색
            } else {
              color = Cesium.Color.RED.withAlpha(0.7); // 높은 오염도: 빨간색
            }
            
            // 오염도 값에 따라 크기 결정
            const size = 100 + point.value * 300; // 오염도가 높을수록 더 큰 구름
            
            // 연기/구름 효과를 위한 원형 반투명 엔티티 생성
            const entity = viewerRef.current.entities.add({
              position: Cesium.Cartesian3.fromDegrees(
                point.longitude,
                point.latitude,
                point.height + 50 // 지면에서 약간 위에 표시
              ),
              ellipsoid: {
                radii: new Cesium.Cartesian3(size, size, size * 0.5), // 타원체 크기
                material: new Cesium.Color(
                  color.red, 
                  color.green, 
                  color.blue, 
                  color.alpha
                ).withAlpha(0.7), // 반투명 색상 사용
                heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
                outline: false
              },
              // 오염도 정보 레이블
              label: {
                text: `오염도: ${(point.value * 100).toFixed(0)}%`,
                font: '14px sans-serif',
                fillColor: Cesium.Color.WHITE,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                outlineWidth: 2,
                outlineColor: Cesium.Color.BLACK,
                verticalOrigin: Cesium.VerticalOrigin.CENTER,
                pixelOffset: new Cesium.Cartesian2(0, -size/2 - 20),
                heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
                disableDepthTestDistance: Number.POSITIVE_INFINITY // 항상 보이도록 설정
              }
            });
            
            pollutionEntities.push(entity);
          });
          
          // 히트맵 레이어 참조 저장
          heatmapLayerRef.current = {
            entities: pollutionEntities
          };
          
          // 카메라를 히트맵 중심으로 이동
          viewerRef.current.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(
              TANCHEON_LOCATION.longitude,
              TANCHEON_LOCATION.latitude,
              500 // 높이 조정
            ),
            orientation: {
              heading: Cesium.Math.toRadians(0),
              pitch: Cesium.Math.toRadians(-45),
              roll: 0
            }
          });
          
          console.log('오염도 시각화 생성 완료');
        } else {
          // 이미 생성된 히트맵이 있다면 표시
          heatmapLayerRef.current.entities.forEach((entity: any) => {
            entity.show = true;
          });
        }
      } else {
        // 히트맵이 표시된 상태라면 숨김
        if (heatmapLayerRef.current) {
          heatmapLayerRef.current.entities.forEach((entity: any) => {
            entity.show = false;
          });
        }
      }
      
      // 상태 업데이트
      setShowHeatmap(!showHeatmap);
      
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
        // Cesium 에셋 경로 설정
        window.CESIUM_BASE_URL = '/static/cesium/';
        console.log('Cesium 에셋 경로 설정:', window.CESIUM_BASE_URL);
        
        // Cesium 동적 로드
        const Cesium = await import('cesium');
        console.log('Cesium 로드 성공');
        
        // 이미 뷰어가 있으면 제거
        if (viewer) {
          viewer.destroy();
        }

        // 컨테이너 요소가 있는지 다시 확인
        if (!cesiumContainerRef.current) return;

        try {
          // 세계 지형 데이터 로드 (비동기)
          const worldTerrain = await Cesium.createWorldTerrainAsync({
            requestVertexNormals: true
          });

          // Cesium Viewer 생성
          viewer = new Cesium.Viewer(cesiumContainerRef.current, {
            baseLayerPicker: false,
            timeline: false,
            animation: false,
            geocoder: false,
            homeButton: false, // 홈 버튼 제거
            sceneModePicker: false, // 지구 버튼(sceneModePicker) 제거
            navigationHelpButton: false,
            fullscreenButton: true,
            creditContainer: document.createElement('div'), // 크레딧 정보 숨김
            infoBox: false, // InfoBox 비활성화
            terrainProvider: worldTerrain, // 세계 지형 데이터 사용
            sceneMode: Cesium.SceneMode.SCENE3D, // 3D 모드로 시작
            shadows: false, // 그림자 비활성화 (성능 향상)
          });
          
          // 뷰어 참조 저장
          viewerRef.current = viewer;
          
          // 휠 줌 속도 조절 - 기본값보다 낮게 설정하여 줌 속도를 줄임
          viewer.scene.screenSpaceCameraController.zoomFactor = 2.0; // 기본값은 5.0, 낮을수록 줌 속도가 느려짐
        } catch (terrainError) {
          console.warn('지형 데이터 로드 실패, 기본 지형으로 대체:', terrainError);
          
          // 지형 로드 실패 시 기본 지형으로 대체
          viewer = new Cesium.Viewer(cesiumContainerRef.current, {
            baseLayerPicker: false,
            timeline: false,
            animation: false,
            geocoder: false,
            homeButton: false, // 홈 버튼 제거
            sceneModePicker: false, // 지구 버튼(sceneModePicker) 제거
            navigationHelpButton: false,
            fullscreenButton: true,
            creditContainer: document.createElement('div'), // 크레딧 정보 숨김
            infoBox: false, // InfoBox 비활성화
            terrainProvider: new Cesium.EllipsoidTerrainProvider(), // 기본 지형 사용
            sceneMode: Cesium.SceneMode.SCENE3D, // 3D 모드로 시작
          });
          
          // 뷰어 참조 저장
          viewerRef.current = viewer;
          
          // 휠 줌 속도 조절 - 기본값보다 낮게 설정하여 줌 속도를 줄임
          viewer.scene.screenSpaceCameraController.zoomFactor = 2.0; // 기본값은 5.0, 낮을수록 줌 속도가 느려짐
        }

        // 기본 이미지 레이어 제거
        viewer.imageryLayers.removeAll();

        // VWorld 위성 지도 레이어 추가
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

        // 3D 지형 활성화
        viewer.scene.globe.enableLighting = true;
        viewer.scene.globe.depthTestAgainstTerrain = true;

        // 초기 카메라 위치로 이동
        viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(
            initialPosition.longitude,
            initialPosition.latitude,
            initialPosition.height
          ),
          orientation: {
            heading: Cesium.Math.toRadians(initialPosition.heading || 0),
            pitch: Cesium.Math.toRadians(initialPosition.pitch || -45),
            roll: initialPosition.roll || 0
          }
        });

        // 위치 마커 추가
        viewer.entities.add({
          position: Cesium.Cartesian3.fromDegrees(
            TANCHEON_LOCATION.longitude,
            TANCHEON_LOCATION.latitude
          ),
          point: {
            pixelSize: 10,
            color: Cesium.Color.RED
          },
          label: {
            text: '탄천 위치',
            font: '14pt sans-serif',
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(0, -10)
          }
        });

        console.log('VWorld 맵 초기화 완료');
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
  }, [isMounted, apiKey, initialPosition]);

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
    <div style={{ position: 'relative', width: '100%', height }}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {/* 버튼 컨테이너 - 왼쪽 하단 */}
      <div className="absolute bottom-4 left-4 z-10 flex flex-col space-y-2">
        {/* 장례식장 모델 토글 버튼 */}
        <button
          className={`px-4 py-2 rounded-lg shadow-md font-medium ${
            showBuildings ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'
          }`}
          onClick={toggleBuildings}
        >
          {showBuildings ? '장례식장 모델 숨기기' : '장례식장 모델 표시하기'}
        </button>
        
        {/* 오염도 시각화 토글 버튼 */}
        <button
          className={`px-4 py-2 rounded-lg shadow-md font-medium ${
            showHeatmap ? 'bg-green-500 text-white' : 'bg-white text-gray-800'
          }`}
          onClick={toggleHeatmap}
        >
          {showHeatmap ? '오염도 시각화 숨기기' : '오염도 시각화 표시하기'}
        </button>
      </div>
      
      {/* 카메라 컨트롤 버튼 */}
      <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2">
        {/* 확대/축소 버튼 */}
        <div className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden">
          <button
            className="px-4 py-2 hover:bg-gray-100 font-medium text-gray-800 border-b border-gray-200"
            onClick={zoomIn}
            title="확대"
          >
            확대 (+)
          </button>
          <button
            className="px-4 py-2 hover:bg-gray-100 font-medium text-gray-800"
            onClick={zoomOut}
            title="축소"
          >
            축소 (-)
          </button>
        </div>
        
        {/* 카메라 위치 저장/이동 버튼 */}
        <div className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden">
          <button
            className="px-4 py-2 hover:bg-gray-100 font-medium text-gray-800 border-b border-gray-200"
            onClick={saveCurrentCameraPosition}
            title="현재 카메라 위치 저장"
          >
            현재 위치 저장
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              savedCameraPosition 
                ? 'hover:bg-gray-100 text-gray-800' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
            onClick={flyToSavedPosition}
            disabled={!savedCameraPosition}
            title="저장된 카메라 위치로 이동"
          >
            저장 위치로 이동
          </button>
        </div>
      </div>
      
      <div
        ref={cesiumContainerRef}
        className="cesium-container w-full h-full"
      />
    </div>
  );
};

export default VWorldMap; 