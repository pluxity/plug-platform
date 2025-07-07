import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { CCTV } from '@plug/v1/app/api/types/nflux';

interface CctvStreamProps {
  cctv: CCTV;
  className?: string;
  onStreamError?: (error: Error) => void;
}

const CctvStream: React.FC<CctvStreamProps> = ({ 
  cctv, 
  className = '',
  onStreamError
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // WebRTC 스트림 연결 함수
  const connectWebRTC = useCallback(async () => {
    try {
      setIsLoading(true);
      setHasError(false);
      
      // TODO: WebRTC 연결 로직 구현
      // 예시:
      // const stream = await getWebRTCStream(cctv.cctvId);
      // if (videoRef.current && stream) {
      //   videoRef.current.srcObject = stream;
      //   streamRef.current = stream;
      //   setIsLoading(false);
      //   setHasError(false);
      //   onStreamReady?.(stream);
      // }
      
      console.log('WebRTC 연결 시도:', cctv.cctvId);
      
      // 임시로 로딩 상태만 해제 (실제 구현 시 제거)
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      
    } catch (error) {
      const errorObj = error as Error;
      console.error('WebRTC 연결 실패:', errorObj);
      setHasError(true);
      setIsLoading(false);
      onStreamError?.(errorObj);
    }
  }, [cctv.cctvId, onStreamError]);

  // 스트림 정리 함수
  const cleanupStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  // 재연결 함수
  const handleReconnect = useCallback(() => {
    cleanupStream();
    connectWebRTC();
  }, [cleanupStream, connectWebRTC]);

  // 컴포넌트 마운트 시 자동 연결
  useEffect(() => {
    connectWebRTC();
    return () => {
      cleanupStream();
    };
  }, [connectWebRTC, cleanupStream]);

  return (
    <div className={`bg-primary-950/40 rounded-lg border border-primary-700/30 ${className}`}>
      {/* 헤더 */}
      <div className="p-3 border-b border-primary-700/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-primary-100 font-medium">{cctv.cctvName}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-primary-400">{cctv.cctvId}</span>
            <div className="flex items-center gap-1 text-xs text-primary-400">
              <div className={`w-1.5 h-1.5 rounded-full ${hasError ? 'bg-red-500' : isLoading ? 'bg-yellow-500' : 'bg-green-500'}`} />
              {hasError ? '연결 실패' : isLoading ? '연결 중' : '연결됨'}
            </div>
          </div>
        </div>
      </div>

      {/* 스트림 영역 */}
      <div className="p-3">
        <div className="aspect-video bg-gray-900 rounded border border-gray-700/50 relative overflow-hidden">
          {/* 로딩 상태 */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
                <span className="text-primary-200 text-sm">스트림 연결 중...</span>
              </div>
            </div>
          )}

          {/* 에러 상태 */}
          {hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-3 text-center">
                <svg className="w-12 h-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-red-400 font-medium">WebRTC 연결 실패</p>
                  <p className="text-gray-400 text-sm">CCTV 스트림을 확인해주세요</p>
                </div>
                <button 
                  onClick={handleReconnect}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  다시 연결
                </button>
              </div>
            </div>
          )}

          {/* WebRTC 비디오 스트림 */}
          <video
            ref={videoRef}
            className="w-full h-full object-cover rounded"
            autoPlay
            muted
            playsInline
            onLoadStart={() => setIsLoading(true)}
            onLoadedData={() => setIsLoading(false)}
            onError={() => {
              setHasError(true);
              setIsLoading(false);
            }}
          />
        </div>

        {/* 컨트롤 영역 */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={handleReconnect}
              className="p-2 bg-primary-600/20 hover:bg-primary-600/30 text-primary-300 rounded-lg transition-colors"
              title="다시 연결"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            
            {/* 전체화면 버튼 */}
            <button
              onClick={() => {
                if (videoRef.current) {
                  videoRef.current.requestFullscreen?.();
                }
              }}
              className="p-2 bg-primary-600/20 hover:bg-primary-600/30 text-primary-300 rounded-lg transition-colors"
              title="전체화면"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-primary-400">
            <span>WebRTC 스트림</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CctvStream;
