import React from 'react';
import { Button } from '../atoms/Button';
import { Icon } from '../atoms/Icon';

interface HeaderProps {
  title: string;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, onLogout }) => {
  const handleLogout = () => {
    onLogout();
  };

  return (
    <div className="absolute top-0 left-0 right-0 z-10 bg-white bg-opacity-80 backdrop-blur-sm px-4 py-2 flex justify-between items-center shadow-sm">
      <h1 className="text-2xl font-bold">{title}</h1>
      <Button 
        variant="outline" 
        size="sm"
        onClick={handleLogout}
        className="flex items-center gap-2"
      >
        <Icon name="logout" size="sm" />
        <span>로그아웃</span>
      </Button>
    </div>
  );
}; 