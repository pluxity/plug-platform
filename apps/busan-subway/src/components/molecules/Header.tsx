import React from 'react';
import { Button } from '../atoms/Button';

interface HeaderProps {
  title: string;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, onLogout }) => {
  const handleLogout = () => {
    onLogout();
  };

  return (
    <div className="w-full h-full bg-white bg-opacity-80 backdrop-blur-sm px-4 py-2 flex justify-between items-center shadow-sm z-10">
      <h1 className="text-2xl font-bold">{title}</h1>
      <nav>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleLogout}
          className="flex items-center gap-2"
        >
          <span>로그아웃</span>
        </Button>
      </nav>
    </div>
  );
}; 