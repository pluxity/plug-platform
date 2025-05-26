import React from 'react';

interface EventCounterProps {
  criticalCount?: number;
  majorCount?: number;
  minorCount?: number;
}

const EventCounter: React.FC<EventCounterProps> = ({ 
  criticalCount = 6, 
  majorCount = 4, 
  minorCount = 2 
}) => {
  return (
    <div className="fixed top-20 right-4 z-20">
      <div className="w-[340px] h-9 relative">
        <div className="w-[340px] h-9 left-0 top-0 absolute bg-primary-400/20 rounded-[5px] backdrop-blur-[5px]" />

        {/* Critical */}
        <div className="w-3 h-3 left-[10px] top-[12px] absolute bg-red-600 rounded-full" />
        <div className="left-[29px] top-[7px] absolute justify-start text-white text-sm font-normal font-['Noto_Sans_KR']">Critical</div>
        <div className="left-[92px] top-[6px] absolute justify-start text-white text-base font-bold font-['Noto_Sans_KR']">{criticalCount}</div>
        
        {/* Major */}
        <div className="w-3 h-3 left-[125px] top-[12px] absolute bg-amber-500 rounded-full" />
        <div className="left-[146px] top-[7px] absolute justify-start text-white text-sm font-normal font-['Noto_Sans_KR']">Major</div>
        <div className="left-[207px] top-[6px] absolute justify-start text-white text-base font-bold font-['Noto_Sans_KR']">{majorCount}</div>
        
        {/* Minor */}
        <div className="w-3 h-3 left-[240px] top-[12px] absolute bg-primary-400 rounded-full" />
        <div className="left-[261px] top-[7px] absolute justify-start text-white text-sm font-normal font-['Noto_Sans_KR']">Minor</div>
        <div className="left-[322px] top-[6px] absolute justify-start text-white text-base font-bold font-['Noto_Sans_KR']">{minorCount}</div>      </div>
    </div>
  );
};

export default EventCounter;
