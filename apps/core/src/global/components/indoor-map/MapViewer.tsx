import { useEffect, useRef, useState } from 'react';
import { Engine3D, Loader } from '@plug/engine/src';

interface IndoorMapViewerProps {
  modelUrl: string;
  className?: string;
  onLoadComplete?: () => void;
}

export const IndoorMapViewer: React.FC<IndoorMapViewerProps> = ({ 
  modelUrl,
  className = "w-full h-full", 
  onLoadComplete
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const engine3DRef = useRef<Engine3D | null>(null);
  const loadedModelUrlRef = useRef<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const currentContainer = containerRef.current;
    
    if (!modelUrl || !currentContainer) {
      setIsLoading(false);
      return;
    }

    // 이미 동일한 모델이 로드되어 있으면 다시 로드하지 않음
    if (loadedModelUrlRef.current === modelUrl && engine3DRef.current) {
      setIsLoading(false);
      if (onLoadComplete) {
        onLoadComplete();
      }
      return;
    }

    // 다른 모델이 로드되어 있으면 기존 엔진 정리
    if (engine3DRef.current && loadedModelUrlRef.current !== modelUrl) {
      try {
        engine3DRef.current.Renderer.dispose();
        while(engine3DRef.current.RootScene.children.length > 0) {
          const child = engine3DRef.current.RootScene.children[0];
          engine3DRef.current.RootScene.remove(child);
        }
        if (engine3DRef.current.Renderer.domElement.parentNode === currentContainer) {
          currentContainer.removeChild(engine3DRef.current.Renderer.domElement);
        }
      } catch (cleanupError) {
        console.warn('Engine3D cleanup error:', cleanupError);
      }
      engine3DRef.current = null;
      loadedModelUrlRef.current = null;
    }

    // 새 엔진 생성 및 모델 로드
    if (!engine3DRef.current) {
      setIsLoading(true);
      setError(null);
      
      try {
        const engine = new Engine3D(currentContainer);
        engine3DRef.current = engine;
        
        const timeoutId = setTimeout(() => {
          setIsLoading(false);
          setError(new Error('3D 모델 로딩 시간 초과'));
        }, 10000);
        
        Loader.LoadGltf(modelUrl, () => {
          clearTimeout(timeoutId);
          setIsLoading(false);
          loadedModelUrlRef.current = modelUrl;
          if (onLoadComplete) {
            onLoadComplete();
          }
        });
      } catch (err) {
        setIsLoading(false);
        setError(err instanceof Error ? err : new Error('3D 엔진 초기화 실패'));
      }
    }

    // cleanup function - 컴포넌트가 완전히 언마운트될 때만 실행
    return () => {
      // 컴포넌트가 언마운트되어도 엔진은 유지 (탭 전환 등을 위해)
      // 실제 정리는 페이지를 떠날 때나 다른 모델을 로드할 때만 수행
    };
  }, [modelUrl, onLoadComplete]);

  // 페이지 언로드 시 정리
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (engine3DRef.current) {
        try {
          engine3DRef.current.Renderer.dispose();
          while(engine3DRef.current.RootScene.children.length > 0) {
            const child = engine3DRef.current.RootScene.children[0];
            engine3DRef.current.RootScene.remove(child);
          }
        } catch (error) {
          console.warn('Engine3D cleanup error:', error);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

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
