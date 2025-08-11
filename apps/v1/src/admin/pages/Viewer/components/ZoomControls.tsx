import React, { useCallback, useEffect, useRef } from 'react';
import * as Px from '@plug/engine/src';

interface ZoomControlsProps {
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onResetView?: () => void;
}

const ZoomControls: React.FC<ZoomControlsProps> = ({
                                                          onZoomIn,
                                                          onZoomOut,
                                                          onResetView
                                                        }) => {
  const zoomAnimationRef = useRef<number | null>(null);
  const zoomFactorRef = useRef<number>(0);

  const animateZoom = useCallback(() => {
    if (zoomFactorRef.current !== 0) {
      const container = document.querySelector('.three-d-viewer-container');
      if (container) {
        const rect = container.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const wheelEvent = new WheelEvent('wheel', {
          bubbles: true,
          cancelable: true,
          deltaY: zoomFactorRef.current > 0 ? -2 : 2,
          clientX: centerX,
          clientY: centerY
        });

        container.dispatchEvent(wheelEvent);
        zoomFactorRef.current *= 0.7;

        if (Math.abs(zoomFactorRef.current) < 0.1) {
          zoomFactorRef.current = 0;
          zoomAnimationRef.current = null;
        } else {
          zoomAnimationRef.current = requestAnimationFrame(animateZoom);
        }
      }
    }
  }, []);

  useEffect(() => {
    return () => {
      if (zoomAnimationRef.current !== null) {
        cancelAnimationFrame(zoomAnimationRef.current);
      }
    };
  }, []);

  const handleZoomIn = useCallback(() => {
    if (zoomAnimationRef.current !== null) {
      cancelAnimationFrame(zoomAnimationRef.current);
    }

    zoomFactorRef.current = 1;
    zoomAnimationRef.current = requestAnimationFrame(animateZoom);

    onZoomIn?.();
  }, [animateZoom, onZoomIn]);

  const handleZoomOut = useCallback(() => {
    if (zoomAnimationRef.current !== null) {
      cancelAnimationFrame(zoomAnimationRef.current);
    }

    zoomFactorRef.current = -1;
    zoomAnimationRef.current = requestAnimationFrame(animateZoom);

    onZoomOut?.();
  }, [animateZoom, onZoomOut]);

  const handleResetView = () => {
    Px.Camera.ExtendView(1.0);
    onResetView?.();
  };

  return (
    <div className="fixed right-5 bottom-5 z-10 flex flex-col gap-2">
      <button
        onClick={handleZoomIn}
        className="bg-white rounded-full shadow-lg p-2 hover:bg-gray-100 transition-colors duration-200"
        title="확대"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        <span className="absolute right-full mr-3 px-3 py-2 bg-white/80 backdrop-blur-md text-zinc-700 text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg">
          확대
        </span>
      </button>

      <button
        onClick={handleZoomOut}
        className="bg-white rounded-full shadow-lg p-2 hover:bg-gray-100 transition-colors duration-200"
        title="축소"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
        </svg>
        <span className="absolute right-full mr-3 px-3 py-2 bg-white/80 backdrop-blur-md text-zinc-700 text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg">
          축소
        </span>
      </button>

      <button
        onClick={handleResetView}
        className="bg-white rounded-full shadow-lg p-2 hover:bg-gray-100 transition-colors duration-200"
        title="전체 보기"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
        </svg>
        <span className="absolute right-full mr-3 px-3 py-2 bg-white/80 backdrop-blur-md text-zinc-700 text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg">
          전체 보기
        </span>
      </button>
    </div>
  );
};

export default ZoomControls;