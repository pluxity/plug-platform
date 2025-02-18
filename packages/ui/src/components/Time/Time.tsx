import { TimeHTMLAttributes, useEffect, useState } from 'react';
import clsx from 'clsx';

export interface TimeProps extends TimeHTMLAttributes<HTMLTimeElement> {
  variant?: 'primary';
  size?: 'small' | 'medium' | 'large';
  lang?: string;
  format? :string;
  className?: string;
  children? : string;
}

const Time = ({ 
  variant = 'primary',
  lang = 'ko',
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


  // Time Date 동작
  function formatDate(date:Date, format:string, lang?:string){

    const locale = lang;
    const options = {
      seconds: 'numeric',
      hour: 'numeric',
      minutes: 'numeric',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      weekday: 'long', 
    };

    const localeDate = new Intl.DateTimeFormat(locale, options).format(date);
    const hours = String(date.getHours()).padStart(2,'0');
    const minutes = String(date.getMinutes()).padStart(2,'0');
    const seconds = String(date.getSeconds()).padStart(2,'0');
    const year = String(date.getFullYear());
    const month = String(date.getMonth() + 1).padStart(2,'0');
    const day = String(date.getDay()).padStart(2,'0');
    
    switch(format){
      case 'HH:mm:ss':
        return `${hours}:${minutes}:${seconds}`;
      case 'YYYY-MM-DD':
        return `${year}-${month}-${day}`;
      case 'HH:mm':
        return `${hours}:${minutes}`;
      case 'locale': 
        return `${localeDate}`;
      default:
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`; 
    }
  }

// 실시간 업데이트 
const [currentTime, setCurrentTime] = useState('');

useEffect(() => {
  const timer = setInterval(() => {
    setCurrentTime(formatDate(new Date(), format, lang));  
  }, 1000);

  return () => clearInterval(timer);
}, [format, lang]);

  
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

