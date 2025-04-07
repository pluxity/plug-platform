import React from 'react';

interface SubwayLineProps {
  lineNumber: string;
  color: string;
  onClick?: () => void;
}

export const SubwayLine: React.FC<SubwayLineProps> = ({ 
  lineNumber, 
  color,
  onClick 
}) => {
  return (
    <div 
      className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-md cursor-pointer"
      onClick={onClick}
    >
      <div 
        className="w-4 h-4 rounded-full" 
        style={{ backgroundColor: color }}
      ></div>
      <span className="text-gray-700">{lineNumber}</span>
    </div>
  );
}; 