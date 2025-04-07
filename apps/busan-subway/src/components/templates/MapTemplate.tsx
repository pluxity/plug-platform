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
    <div className="w-full h-full relative overflow-hidden">
      {/* 헤더 컴포넌트 */}
      <Header title={title} onLogout={onLogout} />
      
      {/* 3D 지도 컴포넌트 */}
      <MapView />
      
      {/* 사이드바 컴포넌트 - 기본값으로 열려있게 설정 */}
      <Sidebar defaultOpen={true} />
    </div>
  );
}; 