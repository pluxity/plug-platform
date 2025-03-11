'use client';
import { useState } from 'react';
import ViewHeader from '@/components/layout/ViewHeader';
import Sidebar from '@/components/layout/Sidebar';

export default function Home() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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
              <div className="h-[500px] rounded">
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
