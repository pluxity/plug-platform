import React, { useState, useEffect } from 'react';
import { useStationEvents } from '@plug/v1/app/api/hooks/nflux';

interface EventInfoPanelProps {
  stationId: string;
}

const EventCounter: React.FC<EventInfoPanelProps> = ({ stationId }) => {
  const { data, loading, refetch } = useStationEvents(stationId);
  const [displayData, setDisplayData] = useState({
    equips: { critical: 0, major: 0, minor: 0 },
    electrics: { critical: 0, major: 0, minor: 0 },
  });

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
    {
      label: 'Critical',
      count: totalCritical,
      textColor: 'text-red-100',
      borderColor: 'border-red-500/50',
      bgColor: 'bg-red-500',
    },
    {
      label: 'Major',
      count: totalMajor,
      textColor: 'text-yellow-100',
      borderColor: 'border-yellow-500/50',
      bgColor: 'bg-yellow-500',
    },
    {
      label: 'Minor',
      count: totalMinor,
      textColor: 'text-primary-100',
      borderColor: 'border-primary-400/50',
      bgColor: 'bg-primary-400',
    },
  ];

  return (
    <div className="fixed top-20 right-4 z-20">
      <div className="flex items-center gap-4 bg-primary-900/30 backdrop-blur-md px-4 py-2 rounded-lg">
        {eventTypes.map(({ label, count, textColor, borderColor, bgColor }) => (
          <div
            key={label}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md border ${borderColor} ${bgColor}/20 transition-colors`}
          >
            <div className={`w-2 h-2 ${bgColor} rounded-full animate-pulse`} />
            <div className="flex items-center gap-2">
              <span className="text-gray-300 text-xs font-medium">{label}</span>
              <span className={`${textColor} text-sm font-bold tabular-nums`}>{count}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventCounter;
