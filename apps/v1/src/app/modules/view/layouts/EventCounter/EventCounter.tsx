import React, { useState, useEffect } from 'react';
import { useStationEvents } from '@plug/v1/app/api/hooks/nflux';

interface EventInfoPanelProps {
  stationId: string;
}

const EventCounter: React.FC<EventInfoPanelProps> =({ stationId }) => {
  const { data, loading, refetch } = useStationEvents(stationId);
  const [displayData, setDisplayData] = useState({
    equips: { critical: 0, major: 0, minor: 0 },
    electrics: { critical: 0, major: 0, minor: 0 }  });
  
  useEffect(() => {
    if (data && !loading) {
      setDisplayData(data);
    }
  }, [data, loading]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 10 * 1000);
    
    return () => clearInterval(interval);
  }, [refetch]);

  const totalCritical = displayData.equips.critical + displayData.electrics.critical;
  const totalMajor = displayData.equips.major + displayData.electrics.major;
  const totalMinor = displayData.equips.minor + displayData.electrics.minor;

  const eventTypes = [
    { label: 'Critical', count: totalCritical, color: 'bg-red-500', textColor: 'text-red-100' },
    { label: 'Major', count: totalMajor, color: 'bg-amber-500', textColor: 'text-amber-100' },
    { label: 'Minor', count: totalMinor, color: 'bg-primary-400', textColor: 'text-primary-100' }
  ];

  return (
    <div className="fixed top-20 right-4 z-20">
      <div className="flex items-center gap-4 bg-primary-400/20 backdrop-blur-md px-4 py-2 rounded-lg border border-gray-700/50">
        {eventTypes.map(({ label, count, color, textColor }) => (
          <div key={label} className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 ${color} rounded-full shadow-lg shadow-${color}/30`} />
            <div className="flex items-center gap-2">
              <span className="text-gray-300 text-sm">{label}</span>
              <span className={`${textColor} text-base font-bold tabular-nums`}>
                {count}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventCounter;
