import { useEffect, useRef, useState } from 'react';
import { Core, Loader } from '@plug/engine';

interface IndoorMapViewerProps {
  modelUrl: string;
  className?: string;
  onLoadComplete?: () => void;
  // 언마운트 시 호출되는 훅 (엔진 인스턴스는 Core 내부관리로 더 이상 노출하지 않음)
  onDispose?: () => void;
}

export const IndoorMapViewer: React.FC<IndoorMapViewerProps> = ({
  modelUrl,
  className = 'w-full h-full',
  onLoadComplete,
  onDispose
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const loadedModelUrlRef = useRef<string | null>(null);
  const loadTimeoutRef = useRef<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  // Keep latest onLoadComplete without causing re-run of model load effect
  const onLoadCompleteRef = useRef<typeof onLoadComplete>(undefined);
  useEffect(() => { onLoadCompleteRef.current = onLoadComplete; }, [onLoadComplete]);

  // 컴포넌트 마운트 시 엔진 초기화 (매 마운트마다 수행)
  useEffect(() => {
    const currentContainer = containerRef.current;
    if (!currentContainer) return; // 다음 렌더에서 재시도 (일반적으로 최초 마운트 직후 존재)
    try {
      Core.Initialize(currentContainer);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('3D 엔진 초기화 실패'));
    }
  }, []);

  // 모델 로딩 이펙트 (엔진 초기화 이후 동작 가정)
  useEffect(() => {
    const currentContainer = containerRef.current; // 존재 여부 확인 (안전)
    let canceled = false;

    if (!modelUrl || !currentContainer) {
      setIsLoading(false);
      return () => { /* no-op */ };
    }

    // 이미 동일 모델이라면 재요청 방지 (onLoadComplete 변경만으로 재호출 방지)
    if (loadedModelUrlRef.current === modelUrl) {
      setIsLoading(false);
      // call latest callback once if model already loaded
      onLoadCompleteRef.current?.();
      return () => { /* no-op */ };
    }

    setIsLoading(true);
    setError(null);

    loadTimeoutRef.current = window.setTimeout(() => {
      if (canceled) return;
      setIsLoading(false);
      setError(new Error('3D 모델 로딩 시간 초과'));
    }, 10000);

    Loader.LoadGltf(modelUrl, () => {
      if (canceled) return;
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
        loadTimeoutRef.current = null;
      }
      setIsLoading(false);
      loadedModelUrlRef.current = modelUrl;
      onLoadCompleteRef.current?.();
    });

    return () => {
      canceled = true;
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
        loadTimeoutRef.current = null;
      }
    };
  }, [modelUrl]);

  useEffect(() => {
    return () => {
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
        loadTimeoutRef.current = null;
      }
      Core.Dispose();
      loadedModelUrlRef.current = null;
      onDispose?.();
    };
  }, [onDispose]);
  

  if (error) {
    return (
      <div className={`${className} relative bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center`}>
        <div className="bg-white border border-red-200 text-red-800 px-6 py-4 rounded-xl shadow-lg max-w-md mx-4">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold">오류가 발생했습니다</h3>
              <p className="text-sm mt-1">{error.message}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!modelUrl) {
    return (
      <div className={`${className} relative bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center`}>
        <div className="bg-white border border-yellow-200 text-yellow-800 px-6 py-4 rounded-xl shadow-lg max-w-md mx-4">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold">3D 도면이 없습니다</h3>
              <p className="text-sm mt-1">3D 모델 URL이 제공되지 않았습니다.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} relative`}>
      <div ref={containerRef} className="w-full h-full" />
      
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center z-50">
          <div className="bg-white/90 backdrop-blur-sm border border-blue-200 px-8 py-6 rounded-2xl shadow-xl">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-blue-200 rounded-full animate-spin">
                  <div className="absolute top-0 left-0 w-4 h-4 bg-blue-600 rounded-full"></div>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">실내로 들어가는 중...</h3>
                <p className="text-sm text-gray-600">3D 모델을 로딩하고 있습니다...</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
