import { TimeHTMLAttributes, useEffect, useState } from 'react';
import clsx from 'clsx';

export interface TimeProps extends TimeHTMLAttributes<HTMLTimeElement> {
  variant?: 'primary';
  size?: 'small' | 'medium' | 'large';
  className?: string;
  format? : string;
  children?: string;
}

const Time = ({ 
  variant = 'primary',
  size = 'small',
  format = 'YYYY-MM-DD HH:mm:ss',
  className,
  children,
  ...props 
}: TimeProps) => {

  // 공통 시간 스타일
  const timeStyle = 'flex gap-2 items-center font-bold';

  // variant 스타일 정의
  const variantStyle = {
    primary: '#000',
  }[variant];

  // size 스타일 정의
  const sizeStyle = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  }[size];

  function formatDay(day : number){
    const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
    return dayOfWeek[day];
  }

  // Time Date 동작
  function formatDate(date:Date, format:string){
    const hours = String(date.getHours()).padStart(2,'0');
    const minutes = String(date.getMinutes()).padStart(2,'0');
    const seconds =String(date.getSeconds()).padStart(2,'0');
    const year = String(date.getFullYear());
    const month = String(date.getMonth() + 1).padStart(2,'0');
    const day = String(date.getDay()).padStart(2,'0');
    const dayOfWeek = formatDay(date.getDay());

    switch(format){
      case 'HH:mm:ss':
        return `${hours}:${minutes}:${seconds}`;
      case 'HH시 mm분 ss초':
        return `${hours}시 ${minutes}분 ${seconds}초`;
      case 'YYYY-MM-DD':
        return `${year}-${month}-${day}`;
      case 'YYYY년 MM월 DD일':
        return `${year}년 ${month}월 ${day}일`;
      case 'YYYY년 MM월 DD일 HH:mm:ss':
        return `${year}년 ${month}월 ${day}일 ${hours}:${minutes}:${seconds}`;
      case 'YYYY년 MM월 DD일 HH시 mm분 ss초':
        return `${year}년 ${month}월 ${day}일 ${hours}시 ${minutes}분${seconds}초`;
      case 'YYYY년 MM월 DD일(요일)':
        return `${year}년 ${month}월 ${day}일 (${dayOfWeek}요일)`;
      case 'HH:mm':
        return `${hours}:${minutes}`;
      case 'HH시 mm분':
        return `${hours}시 ${minutes}분`;
      default:
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`; 
    }
  }

// 실시간 업데이트 
const [currentTime, setCurrentTime] = useState('');

useEffect(() => {
  const timer = setInterval(() => {
    setCurrentTime(formatDate(new Date(), format));  
  }, 100);

  return () => clearInterval(timer);
}, [format]);

  
  return (
    <time 
        role="time"
        className={clsx(
            variantStyle,
            timeStyle,
            sizeStyle,
            format,
            className
        )}
        {...props}
        >
          {<span>{currentTime}</span>}
    </time>
  );
};

export default Time;

