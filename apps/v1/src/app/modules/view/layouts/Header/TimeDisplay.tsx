import { useState, useEffect } from 'react';

const TimeDisplay = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const weekday = weekdays[date.getDay()];

    return {
      date: `${year}.${month}.${day}`,
      weekday,
      time: `${hours}:${minutes}`
    };
  };

  const { date, weekday, time } = formatDate(currentTime);

  return (
    <div className="flex items-center gap-3 bg-primary-300/10 rounded-lg px-4 py-1 border border-gray-700/50">
      <div className="flex items-center">
        <span className="text-gray-300 text-sm font-medium">{date}</span>
        <span className="mx-2 text-gray-500">|</span>
        <span className="text-gray-300 text-sm font-medium">
          {weekday}
          <span className="text-gray-400">요일</span>
        </span>
      </div>
      <div className="w-px h-4 bg-gray-600" />
      <div className="font-mono text-lg tracking-wider text-white">
        {time}
      </div>
    </div>
  );
};

export default TimeDisplay;