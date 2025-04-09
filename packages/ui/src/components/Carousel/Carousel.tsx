import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CarouselProps } from './Carousel.types';
import { Button } from '../Button/Button';
import { cn } from '../../utils/classname';
import Prev from '../../assets/icons/previous.svg';
import Next from '../../assets/icons/next.svg';

export const Carousel = ({
  items,
  initialIndex = 0,
  autoPlay = false,
  autoPlayInterval = 3000,
  showIndicators = true,
  showNavigation = true,
  infinite = true,
  className,
}: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const autoPlayTimerRef = useRef<number | null>(null);
  
  // React 19는 이벤트 핸들러의 자동 메모이제이션을 지원합니다
  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    if (currentIndex === items.length - 1) {
      if (infinite) {
        setCurrentIndex(0);
      }
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, isTransitioning, items.length, infinite]);
  
  const prevSlide = useCallback(() => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    if (currentIndex === 0) {
      if (infinite) {
        setCurrentIndex(items.length - 1);
      }
    } else {
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex, isTransitioning, items.length, infinite]);
  
  const goToSlide = useCallback((index: number) => {
    if (isTransitioning || index === currentIndex) return;
    
    setIsTransitioning(true);
    setCurrentIndex(index);
  }, [currentIndex, isTransitioning]);
  
  // 자동 재생 처리
  useEffect(() => {
    if (autoPlay) {
      autoPlayTimerRef.current = window.setInterval(() => {
        nextSlide();
      }, autoPlayInterval);
    }
    
    return () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
      }
    };
  }, [autoPlay, autoPlayInterval, nextSlide]);
  
  // 트랜지션 상태 리셋
  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 300); // CSS 트랜지션 시간과 일치시키기
      
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);
  
  // 키보드 네비게이션 처리
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      prevSlide();
    } else if (e.key === 'ArrowRight') {
      nextSlide();
    }
  }, [prevSlide, nextSlide]);
  
  return (
    <div 
      className={cn(
        'relative overflow-hidden',
        className
      )}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="캐러셀"
    >
      <div
        className="flex transition-transform duration-300 ease-in-out"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
        aria-live="polite"
      >
        {items.map((item, index) => (
          <div
            key={index}
            className="w-full flex-shrink-0 "
            role="group"
            aria-roledescription="slide"
            aria-label={`슬라이드 ${index + 1} / ${items.length}`}
            aria-hidden={index !== currentIndex}
          >
            {item}
          </div>
        ))}
      </div>
      
      {/* 네비게이션 화살표 */}
      {showNavigation && items.length > 1 && (
        <>
          <Button
            onClick={prevSlide}
            disabled={!infinite && currentIndex === 0}
            className="absolute opacity-50 top-1/2 left-4 -translate-y-1/2 text-gray-800 "
            aria-label="이전 슬라이드"
            variant="ghost"
            color="default"
            size="icon"
          >
            <Prev />
          </Button>
          <Button
            onClick={nextSlide}
            disabled={!infinite && currentIndex === items.length - 1}
            className="absolute opacity-50 top-1/2 right-4 -translate-y-1/2 text-gray-800"
            aria-label="다음 슬라이드"
            variant="ghost"
            color="default"
            size="icon"
          >
            <Next />
          </Button>
        </>
      )}
      
      {/* 인디케이터 */}
      {showIndicators && items.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2" role="tablist">
          {items.map((_, index) => (
            <Button
              key={index}
              onClick={() => goToSlide(index)}
              className={`size-2.5 rounded-full transition-colors p-0 min-w-0 min-h-0 ${
                index === currentIndex ? 'bg-primary-500' : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`${index + 1}번 슬라이드로 이동`}
              aria-selected={index === currentIndex}
              role="tab"
              variant="ghost"
              size="icon"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel;