import { useEffect, useMemo, useRef, useState, useCallback } from 'react';

import { useDeviceCategoryTree } from '@plug/common-services';
import { useAuthStore } from '@/global/store/authStore';

interface DeviceCategoryChipsProps {
  selectedId?: number | null;
  onSelect?: (id: number | null) => void;
  onDeselect?: (id: number) => void;
}

const DeviceCategoryChips = ({ 
  selectedId = null, 
  onSelect, 
  onDeselect
}: DeviceCategoryChipsProps) => {
  const { categories, isLoading } = useDeviceCategoryTree();
  const getUserPermissions = useAuthStore(s => s.getUserPermissions);
  const [internalSelected, setInternalSelected] = useState<number | null>(selectedId);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const isDraggingRef = useRef(false);
  const dragStartClientXRef = useRef(0);
  const startScrollLeftRef = useRef(0);
  const dragDistanceRef = useRef(0);

  // 권한에 따라 필터링된 카테고리 생성
  const topLevel = useMemo(() => {
    const baseCategories = (categories || []).filter((c) => !c.parentId);
    const permissions = getUserPermissions();
    
    // DEVICE-CATEGORY 권한 확인
    const deviceCategoryPermission = permissions.find(p => p.resourceType === 'DEVICE_CATEGORY');
    let filteredCategories = baseCategories;
    
    if (deviceCategoryPermission) {
      // ALL이 아니면 특정 카테고리만 필터링
      if (!deviceCategoryPermission.resourceIds.includes('ALL')) {
        const allowedIds = deviceCategoryPermission.resourceIds
          .map(id => parseInt(id, 10))
          .filter(id => !isNaN(id));
        filteredCategories = baseCategories.filter(c => allowedIds.includes(c.id));
      }
    } else {
      // DEVICE-CATEGORY 권한이 없으면 빈 배열
      filteredCategories = [];
    }
    
    // CCTV 권한 확인
    const cctvPermission = permissions.find(p => p.resourceType === 'CCTV');
    const hasCctvPermission = cctvPermission?.resourceIds.includes('ALL') || false;
    
    if (!hasCctvPermission) return filteredCategories;
    
    const cctvCategory = {
      id: -1,
      name: 'CCTV',
      depth: 0,
      thumbnailFile: {
        id: -1,
        url: '/images/icons/cctv.png',
      },
    };
    
    return [cctvCategory, ...filteredCategories];
  }, [categories, getUserPermissions]);

  const selectCategory = useCallback((clickedId: number) => {
    setInternalSelected((prev) => {
      if (prev === clickedId) {
        onDeselect?.(clickedId);
        onSelect?.(null);
        return null;
      }
      onSelect?.(clickedId);
      return clickedId;
    });
  }, [onSelect, onDeselect]);

  useEffect(() => { setInternalSelected(selectedId ?? null); }, [selectedId]);

  const updateScrollState = () => {
    const scrollElement = scrollContainerRef.current;
    if (!scrollElement) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollElement;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
  };

  const handleScroll = () => updateScrollState();

  const scrollByAmount = (amount: number) => {
    const scrollElement = scrollContainerRef.current;
    if (!scrollElement) return;
    scrollElement.scrollBy({ left: amount, behavior: 'smooth' });
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const scrollElement = scrollContainerRef.current;
    if (!scrollElement) return;
    isDraggingRef.current = true;
    dragStartClientXRef.current = event.clientX;
    startScrollLeftRef.current = scrollElement.scrollLeft;
    dragDistanceRef.current = 0;
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const scrollElement = scrollContainerRef.current;
    if (!scrollElement || !isDraggingRef.current) return;
    const deltaX = event.clientX - dragStartClientXRef.current;
    dragDistanceRef.current = Math.max(dragDistanceRef.current, Math.abs(deltaX));
    scrollElement.scrollLeft = startScrollLeftRef.current - deltaX;
  };

  const endDrag = () => {
    const scrollElement = scrollContainerRef.current;
    if (!scrollElement) return;
    isDraggingRef.current = false;
    dragDistanceRef.current = 0;
  };

  useEffect(() => {
    const scrollElement = scrollContainerRef.current;
    if (!scrollElement) return;
    const onWheel = (event: WheelEvent) => {
      const absDeltaX = Math.abs(event.deltaX);
      const absDeltaY = Math.abs(event.deltaY);
      if (absDeltaY > absDeltaX) {
        if (event.cancelable) event.preventDefault();
        scrollElement.scrollBy({ left: event.deltaY, behavior: 'auto' });
      }
    };
    scrollElement.addEventListener('wheel', onWheel, { passive: false });
    return () => { scrollElement.removeEventListener('wheel', onWheel); };
  }, []);

  useEffect(() => {
    updateScrollState();
    const scrollElement = scrollContainerRef.current;
    if (!scrollElement) return;
    const onResize = () => updateScrollState();
    window.addEventListener('resize', onResize);
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => updateScrollState());
      resizeObserver.observe(scrollElement);
    }
    return () => {
      window.removeEventListener('resize', onResize);
      resizeObserver?.disconnect();
    };
  }, [topLevel.length, isLoading]);

  return (
    <div className="relative">
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={endDrag}
        className="flex items-center gap-2 px-1 py-1 overflow-x-auto overflow-y-hidden whitespace-nowrap cursor-grab active:cursor-grabbing select-none scroll-smooth no-scrollbar overscroll-contain"
        role="tablist"
        aria-label="장치 카테고리"
      >
  {isLoading && (
          <div className="flex items-center gap-2">
            <div className="h-8 w-20 rounded-full bg-gray-200 animate-pulse" />
            <div className="h-8 w-24 rounded-full bg-gray-200 animate-pulse" />
            <div className="h-8 w-16 rounded-full bg-gray-200 animate-pulse" />
          </div>
        )}
  {!isLoading && topLevel.map((category) => (
          <button
            key={category.id}
            type="button"
            data-chip="true"
            onClick={() => { if (dragDistanceRef.current > 10) return; selectCategory(category.id); }}
            className={[
              'inline-flex items-center px-3 py-1.5 rounded-full border text-sm whitespace-nowrap shrink-0 cursor-pointer',
              internalSelected === category.id ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50',
            ].join(' ')}
            title={category.name}
          >
            {category.thumbnailFile?.url && (
              <img
                src={category.thumbnailFile.url}
                alt=""
                className="w-5 h-5 rounded-full object-cover mr-2"
                draggable={false}
                loading="lazy"
              />
            )}
            <span>{category.name}</span>
          </button>
        ))}
      </div>
  {canScrollLeft && (<div className="pointer-events-none absolute left-0 w-8" />)}
  {canScrollRight && (<div className="pointer-events-none absolute right-0 w-8" />)}
      {canScrollLeft && (
        <button
          type="button"
          aria-label="왼쪽으로 스크롤"
          onClick={() => scrollByAmount(-240)}
          className="absolute left-1 top-1/2 -translate-y-1/2 inline-flex items-center justify-center h-7 w-7 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
            <path fillRule="evenodd" d="M12.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L8.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}
      {canScrollRight && (
        <button
          type="button"
          aria-label="오른쪽으로 스크롤"
          onClick={() => scrollByAmount(240)}
          className="absolute right-1 top-1/2 -translate-y-1/2 inline-flex items-center justify-center h-7 w-7 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
            <path fillRule="evenodd" d="M7.293 4.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 11-1.414-1.414L11.586 10l-4.293 4.293a1 1 0 011.414-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default DeviceCategoryChips;
