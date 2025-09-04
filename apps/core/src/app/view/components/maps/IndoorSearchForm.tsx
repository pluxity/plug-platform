import { Camera } from '@plug/engine';

import React, { useMemo, useRef, useState, useCallback } from 'react';

import { useIndoorStore, type IndoorSearchItem } from '@/app/store/indoorStore';
import { GroupSearchForm } from '@/app/view/components/group-search-form';
import type { GroupSearchGroup, GroupSearchFormRef } from '@/app/view/components/group-search-form';
interface IndoorSearchFormProps {
  className?: string;
  onDeviceSelect?: (item: IndoorSearchItem) => void;
}

const IndoorSearchForm: React.FC<IndoorSearchFormProps> = ({ className, onDeviceSelect }) => {
  const [query, setQuery] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<GroupSearchFormRef>(null);

  const searchDevices = useIndoorStore((s) => s.searchDevices);
  // facilityId not needed locally; parent ensures data loaded
  // Device & CCTV는 상위 IndoorMap에서 선 로딩

  // Ensure device & CCTV data loaded for searching
  // 상위에서 로드되므로 여기서는 추가 fetch 없음

  const groups = useMemo<GroupSearchGroup<IndoorSearchItem>[]>(() => {
    const result = searchDevices(query);
    return result.map(({ category, items }) => ({ heading: category, items }));
  }, [searchDevices, query]);

  const handleSelect = useCallback((item: IndoorSearchItem) => {
    setQuery('');
    formRef.current?.close();
    if (item.feature?.id) {
      Camera.MoveToPoi(String(item.feature.id), 1, { x: 0, y: 0, z: 0 });
    }
    // item may be device or cctv; ensure shape matches callback union
    onDeviceSelect?.(item);
  }, [onDeviceSelect]);

  return (
    <div ref={searchRef} className={['relative w-96', className || ''].join(' ').trim()}>
      <GroupSearchForm<IndoorSearchItem>
        ref={formRef}
        value={query}
        onValueChange={setQuery}
        groups={groups}
        placeholder="카테고리, 디바이스/CCTV명, 또는 ID로 검색..."
        getItemKey={(item) => String(item.id)}
        renderItem={(item) => {
          const isCctv = item.__kind === 'cctv';
          return (
            <div className="flex w-full items-start gap-2">
              <span className="w-3/5 break-words font-medium text-gray-900">
                {String(item.name ?? item.id)}
              </span>
              <span
                className={`w-2/5 text-xs break-all whitespace-pre-wrap text-right ${isCctv ? 'text-red-500' : 'text-blue-600'}`}
              >
                {isCctv ? 'CCTV' : String(item.id)}
              </span>
            </div>
          );
        }}
        onSelect={handleSelect}
      />
    </div>
  );
};

export default IndoorSearchForm;
