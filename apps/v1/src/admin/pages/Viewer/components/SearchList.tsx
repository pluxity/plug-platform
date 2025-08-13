import { useState, useMemo } from 'react';
import * as Px from '@plug/engine/src';
import { Input } from '@plug/ui';
import { useToastStore } from '@plug/v1/admin/components/hook/useToastStore';
import { StationWithFeatures, FeatureResponse } from '@plug/v1/admin/pages/Viewer/types/station';

type Device = {
  id: string;
  categoryId: number;
  categoryName: string;
  name: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
};

interface SearchListProps {
  deviceData: Device[];
  featureData: StationWithFeatures;
}

export const SearchList = ({ deviceData, featureData }: SearchListProps) => {
  const { addToast } = useToastStore();
  const [searchTerm, setSearchTerm] = useState('');

  const deviceFeatureMap = useMemo(() => {
    const map = new Map<string, FeatureResponse>();

    if (featureData && featureData.features && featureData.features.length > 0) {
      featureData.features.forEach(feature => {
        if (feature.deviceId) {
          map.set(feature.deviceId, feature);
        }
      });
    }

    return map;
  }, [featureData]);

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return deviceData;

    return deviceData.filter(device =>
      device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [deviceData, searchTerm]);

  const handleItemClick = (deviceId: string, name: string) => {
    try {
      const feature = deviceFeatureMap.get(deviceId);

      if (!feature) {
        throw new Error(`${name}(${deviceId})에 해당하는 3D 오브젝트를 찾을 수 없습니다.`);
      }
      const featureId = feature.id.toLowerCase();

      if (!Px.Camera || typeof Px.Camera.MoveToPoi !== 'function') {
        throw new Error('카메라 이동 기능을 사용할 수 없습니다.');
      }

      Px.Camera.MoveToPoi(featureId, 1.5);

      addToast({
        variant: 'normal',
        title: `${name} 선택`,
        description: `${name} 위치로 이동합니다`
      });
    } catch (error) {
      console.error('카메라 이동 중 오류:', error);
      addToast({
        variant: 'critical',
        title: `오류 발생`,
        description: `${error}`
      });
    }
  };

  return (
    <div className="flex flex-col h-full shadow-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="relative bg-white rounded-lg">
          <Input
            type="text"
            placeholder="검색어를 입력하세요"
            className="w-full pl-7 pr-4 py-2 border-0"
            value={searchTerm}
            onChange={setSearchTerm}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-2">
        <div className="text-sm text-gray-500 px-3 py-2">
          {filteredData.length} 결과 찾음
        </div>

        {filteredData.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-40 text-gray-500">
            <svg className="h-12 w-12 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>검색 결과가 없습니다</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {filteredData.map(device => {
              const hasFeature = deviceFeatureMap.has(device.id);

              return (
                <li
                  key={device.id}
                  className={`p-4 bg-white hover:bg-primary-100/50 rounded-xl border border-gray-200 
                    ${hasFeature ? 'cursor-pointer' : 'cursor-not-allowed opacity-70'} 
                    transition-all duration-300 flex flex-col gap-2`}
                  onClick={() => hasFeature && handleItemClick(device.id, device.name)}
                >
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-700 truncate">
                      {device.name}
                    </h3>
                    <span
                      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      {device.categoryName}
                    </span>

                    {!hasFeature && (
                      <span
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                        배치되지 않음
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{device.id}</span>
                    {hasFeature && (
                      <svg className="h-5 w-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SearchList;