import React, { useState } from 'react';
import { Icon } from '../atoms/Icon';

interface SidebarProps {
  defaultOpen?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <aside 
      className={`absolute top-12 left-0 h-[calc(100%-48px)] flex transition-all duration-300 ease-in-out z-40 ${
        isOpen ? 'translate-x-0' : 'translate-x-[-272px]'
      }`}
    >
      {/* 메인 사이드바 컨텐츠 */}
      <div className="w-[272px] h-full bg-white shadow-lg overflow-y-auto">

        
      </div>
      
      {/* 토글 탭 */}
      <div 
        className="w-12 h-20 bg-white shadow-lg rounded-r-md flex items-center justify-center cursor-pointer self-start mt-4 z-50"
        onClick={toggleSidebar}
      >
        <div className="w-6 h-6 flex items-center justify-center">
          {isOpen ? (
            <Icon name="arrow-left" />
          ) : (
            <Icon name="arrow-right" />
          )}
        </div>
      </div>
    </aside>
  );
}; 