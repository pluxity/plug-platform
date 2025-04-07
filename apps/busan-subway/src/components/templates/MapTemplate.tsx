import React from 'react';
import { Header } from '../molecules/Header';
import { MapView } from '../organisms/MapView';
import { Sidebar } from '../organisms/Sidebar';

interface MapTemplateProps {
  title: string;
  onLogout: () => void;
}

export const MapTemplate: React.FC<MapTemplateProps> = ({ title, onLogout }) => {
  return (
    <div className="w-full h-full flex flex-col relative">
      {/* 헤더 컴포넌트 */}
      <header className="w-full h-12 z-30">
        <Header title={title} onLogout={onLogout} />
      </header>
      
      {/* 메인 콘텐츠 영역 - 3D 지도 */}
      <main className="flex-1 overflow-hidden z-10">
        {/* 3D 지도 컴포넌트 */}
        <MapView />
      </main>

      {/* 사이드바 컴포넌트 - absolute 포지션 */}
      <Sidebar defaultOpen={true} />
    </div>
  );
}; 