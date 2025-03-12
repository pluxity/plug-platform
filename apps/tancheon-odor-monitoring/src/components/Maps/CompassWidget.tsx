import React, { useEffect, useRef } from 'react';
import useCesiumStore from '@/stores/cesiumStore';

interface CompassWidgetProps {
  cesiumContainerRef: React.RefObject<HTMLDivElement | null>;
  className?: string;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
}

/**
 * 방위각 위젯 컴포넌트 - 나침반 표시
 * VWorldMap과 OSMMap 모두에서 재사용 가능합니다.
 */
export const CompassWidget: React.FC<CompassWidgetProps> = ({ 
  cesiumContainerRef,
  className = '',
  top = '10px',
  left = '10px',
  right,
  bottom
}) => {
  const compassContainerRef = useRef<HTMLDivElement | null>(null);
  
  // Cesium 상태를 스토어에서 직접 가져오기
  const { viewer } = useCesiumStore();
  
  // 나침반 생성
  useEffect(() => {
    if (!cesiumContainerRef.current || !viewer) return;
    
    // 동적 나침반 생성
    const compassContainer = document.createElement('div');
    compassContainer.className = `compass-container ${className}`;
    compassContainer.style.position = 'absolute';
    
    // 위치 속성 적용
    if (top) compassContainer.style.top = top;
    if (left) compassContainer.style.left = left;
    if (right) compassContainer.style.right = right;
    if (bottom) compassContainer.style.bottom = bottom;
    
    compassContainer.style.width = '80px'; // 크기 축소
    compassContainer.style.height = '80px'; // 크기 축소
    compassContainer.style.zIndex = '1000';
    
    // 나침반 배경 (원)
    const compassBackground = document.createElement('div');
    compassBackground.className = 'compass-background';
    compassBackground.style.position = 'absolute';
    compassBackground.style.width = '100%';
    compassBackground.style.height = '100%';
    compassBackground.style.borderRadius = '50%';
    compassBackground.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
    compassBackground.style.border = '1px solid #333';
    compassBackground.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
    compassContainer.appendChild(compassBackground);
    
    // 나침반 회전 컨테이너
    const compassRotate = document.createElement('div');
    compassRotate.className = 'compass-rotate';
    compassRotate.style.position = 'absolute';
    compassRotate.style.width = '100%';
    compassRotate.style.height = '100%';
    compassRotate.style.transformOrigin = 'center center';
    compassBackground.appendChild(compassRotate);
    
    // 나침반 방향 표시 (N, E, S, W)
    const directions = [
      { label: 'N', angle: 0, top: '5px', left: '50%' },
      { label: 'E', angle: 90, top: '50%', left: '95%' },
      { label: 'S', angle: 180, top: '95%', left: '50%' },
      { label: 'W', angle: 270, top: '50%', left: '5%' }
    ];
    
    directions.forEach(dir => {
      const dirLabel = document.createElement('div');
      dirLabel.className = `compass-dir compass-dir-${dir.label}`;
      dirLabel.style.position = 'absolute';
      dirLabel.style.top = dir.top;
      dirLabel.style.left = dir.left;
      dirLabel.style.transform = 'translate(-50%, -50%)';
      dirLabel.style.fontWeight = 'bold';
      dirLabel.style.fontSize = '12px';
      dirLabel.style.color = '#333';
      dirLabel.textContent = dir.label;
      compassRotate.appendChild(dirLabel);
    });
    
    // 나침반 바늘 (고정된 상태로 항상 북쪽 가리킴)
    const compassNeedle = document.createElement('div');
    compassNeedle.className = 'compass-needle';
    compassNeedle.style.position = 'absolute';
    compassNeedle.style.top = '50%';
    compassNeedle.style.left = '50%';
    compassNeedle.style.width = '0';
    compassNeedle.style.height = '0';
    compassNeedle.style.borderLeft = '4px solid transparent';
    compassNeedle.style.borderRight = '4px solid transparent';
    compassNeedle.style.borderBottom = '30px solid red';
    compassNeedle.style.transformOrigin = 'center bottom';
    compassNeedle.style.transform = 'translateX(-50%) translateY(-100%)';
    compassBackground.appendChild(compassNeedle);
    
    // 나침반 남쪽 바늘 (고정된 상태로 항상 남쪽 가리킴)
    const compassNeedleSouth = document.createElement('div');
    compassNeedleSouth.className = 'compass-needle-south';
    compassNeedleSouth.style.position = 'absolute';
    compassNeedleSouth.style.top = '50%';
    compassNeedleSouth.style.left = '50%';
    compassNeedleSouth.style.width = '0';
    compassNeedleSouth.style.height = '0';
    compassNeedleSouth.style.borderLeft = '4px solid transparent';
    compassNeedleSouth.style.borderRight = '4px solid transparent';
    compassNeedleSouth.style.borderTop = '30px solid blue';
    compassNeedleSouth.style.transformOrigin = 'center top';
    compassNeedleSouth.style.transform = 'translateX(-50%)';
    compassBackground.appendChild(compassNeedleSouth);
    
    // 나침반 중심점
    const compassCenter = document.createElement('div');
    compassCenter.style.position = 'absolute';
    compassCenter.style.top = '50%';
    compassCenter.style.left = '50%';
    compassCenter.style.width = '8px';
    compassCenter.style.height = '8px';
    compassCenter.style.borderRadius = '50%';
    compassCenter.style.backgroundColor = '#333';
    compassCenter.style.transform = 'translate(-50%, -50%)';
    compassBackground.appendChild(compassCenter);
    
    // 나침반을 Cesium 컨테이너에 추가
    cesiumContainerRef.current.appendChild(compassContainer);
    compassContainerRef.current = compassContainer;
    
    // 나침반 업데이트 이벤트 등록
    let updateCompassListener: (() => void) | undefined;
    
    // viewer와 scene이 존재하는지 확인
    if (viewer && viewer.scene) {
      try {
        updateCompassListener = viewer.scene.postRender.addEventListener(() => {
          // 카메라가 존재하는지 확인
          if (viewer && viewer.camera) {
            const heading = viewer.camera.heading;
            updateCompass(heading);
          }
        });
      } catch (error) {
        console.warn('나침반 이벤트 등록 실패:', error);
      }
    } else {
      console.warn('Cesium 뷰어의 scene이 초기화되지 않았습니다. 나침반이 작동하지 않을 수 있습니다.');
    }
    
    // 나침반 업데이트 함수
    function updateCompass(heading: number) {
      if (!compassContainer) return;
      
      // 나침반 회전 컨테이너 가져오기
      const compassRotate = compassContainer.querySelector('.compass-rotate');
      
      if (compassRotate) {
        // 라디안을 도(degree)로 변환
        const Cesium = (window as any).Cesium;
        if (Cesium) {
          const headingDegrees = Cesium.Math.toDegrees(heading);
          
          // 나침반 회전 (카메라 회전의 반대 방향으로 회전)
          (compassRotate as HTMLElement).style.transform = `rotate(${-headingDegrees}deg)`;
        }
      }
    }
    
    // 클린업 함수
    return () => {
      if (compassContainerRef.current && cesiumContainerRef.current) {
        try {
          cesiumContainerRef.current.removeChild(compassContainerRef.current);
        } catch (error) {
          console.error('나침반 제거 오류:', error);
        }
      }
      
      if (updateCompassListener && typeof updateCompassListener === 'function') {
        updateCompassListener();
      }
    };
  }, [cesiumContainerRef, viewer, className, top, left, right, bottom]);
  
  // 이 컴포넌트는 실제 DOM 요소를 렌더링하지 않고 명령형 방식으로 나침반을 생성
  return null;
};

export default CompassWidget; 