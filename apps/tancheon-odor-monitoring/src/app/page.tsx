'use client';
import { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import ViewHeader from '@/components/layout/ViewHeader';
import Sidebar from '@/components/layout/Sidebar';

// Cesium 맵 컴포넌트를 클라이언트 사이드에서만 로드하도록 동적 임포트
const CesiumMap = dynamic(
  () => import('@/components/map/OSMMap'),
  { ssr: false } // 서버 사이드 렌더링 비활성화
);

// VWorld 맵 컴포넌트를 클라이언트 사이드에서만 로드하도록 동적 임포트
const VWorldMap = dynamic(
  () => import('@/components/map/VWorldMap'),
  { ssr: false } // 서버 사이드 렌더링 비활성화
);

export default function Home() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeMapTab, setActiveMapTab] = useState<'vworld' | 'cesium'>('vworld');

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const vworldApiKey = process.env.NEXT_PUBLIC_VWORLD_API_KEY || '39AE0FB0-78CC-3751-B102-8A8F21CF0FF3';

  return (
    <div className="flex flex-col h-screen">
      <ViewHeader />
      
      <div className="flex flex-1 overflow-hidden">
        {/* 사이드바 */}
        <Sidebar 
          isSidebarCollapsed={isSidebarCollapsed} 
          toggleSidebar={toggleSidebar} 
        />
        
        {/* 메인 컨텐츠 */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">탄천 악취 모니터링 대시보드</h1>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">탄천 지역 3D 지도</h2>
              
              {/* 지도 탭 선택 버튼 */}
              <div className="flex mb-4 border-b">
                <button
                  className={`px-4 py-2 font-medium ${activeMapTab === 'vworld' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                  onClick={() => setActiveMapTab('vworld')}
                >
                  VWorld 지도
                </button>
                <button
                  className={`px-4 py-2 font-medium ${activeMapTab === 'cesium' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                  onClick={() => setActiveMapTab('cesium')}
                >
                  OpenStreetMap
                </button>
              </div>
              
              <div className="h-[500px] rounded">
                {activeMapTab === 'cesium' && (
                  <Suspense fallback={<div className="w-full h-full flex items-center justify-center bg-gray-100">지도 로딩 중...</div>}>
                    <CesiumMap height="500px" />
                  </Suspense>
                )}
                
                {activeMapTab === 'vworld' && (
                  <Suspense fallback={<div className="w-full h-full flex items-center justify-center bg-gray-100">지도 로딩 중...</div>}>
                    <VWorldMap apiKey={vworldApiKey} height="500px" />
                  </Suspense>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
