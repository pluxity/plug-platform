import React from 'react';

interface StationItemProps {
  name: string;
  onClick?: () => void;
}

export const StationItem: React.FC<StationItemProps> = ({ name, onClick }) => {
  return (
    <li 
      className="p-2 bg-gray-50 rounded-md hover:bg-gray-100 cursor-pointer transition-colors"
      onClick={onClick}
    >
      {name}
    </li>
  );
}; 