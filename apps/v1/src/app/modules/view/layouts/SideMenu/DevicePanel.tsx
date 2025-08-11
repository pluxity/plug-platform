import React, { useState, useEffect } from 'react';
import * as Px from '@plug/engine/src';
import useStationStore from '@plug/v1/app/stores/stationStore';
import useDeviceModalStore from '@plug/v1/app/stores/deviceModalStore';

interface DeviceData {
  id: string;
  name: string;
  code: string;
  feature: DeviceFeature;
}

interface DeviceFeature {
  id: string;
  floorId: string;
  assetId: string;
}

interface DevicePanelProps {
  categoryId: string | null;
  categoryType: string;
  categoryName: string | null;
  devices: DeviceData[];
  onClose: () => void;
}

const DevicePanel: React.FC<DevicePanelProps> = ({
                                                   categoryId,
                                                   categoryType,
                                                   categoryName,
                                                   devices = [],
                                                   onClose
                                                 }) => {
  const { externalCode, setCurrentFloor } = useStationStore();
  const { openModal } = useDeviceModalStore();
  const [searchValue, setSearchValue] = useState('');
  const [filteredDevices, setFilteredDevices] = useState<DeviceData[]>(devices);

  useEffect(() => {
    if (searchValue) {
      const filtered = devices.filter((device) =>
        device.name.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredDevices(filtered);
    } else {
      setFilteredDevices(devices);
    }
  }, [searchValue, devices]);

  useEffect(() => {
    setSearchValue('');
  }, [categoryId]);

  const handleDeviceClick = (device: DeviceData) => {
    try {
      if (device.feature.id && device.feature.floorId) {
        setCurrentFloor(device.feature.floorId);

        Px.Model.HideAll();
        Px.Model.Show(device.feature.floorId);
        Px.Camera.MoveToPoi(device.feature.id, 1.0);
      }
    } catch (error) {
      console.error('이동 중 오류 발생:', error);
    }
  };

  const renderCategoryTitle = () => {
    if (!categoryName) return "장비 목록";

    if (categoryName.includes('-')) {
      const parts = categoryName.split('-');
      const prefix = parts[0].trim();
      let mainPart = parts[1].trim();

      if (mainPart.includes('(')) {
        mainPart = mainPart.split('(')[0].trim();
      }

      return (
        <>
          <span className="text-lg font-semibold text-white">{mainPart}</span>
          <div className="text-xs px-2 py-0.5 ml-2 rounded-full bg-primary-700/60 text-white/80 font-medium border border-white/10">
            {prefix}
          </div>
        </>
      );
    }

    return <span className="text-lg font-semibold text-white">{categoryName}</span>;
  };

  if (!categoryId) {
    return null;
  }

  return (
    <>
      <div className="fixed left-16 top-16 bottom-0 w-72 bg-gradient-to-b from-primary-900/20 to-primary-900/5 backdrop-blur-lg p-4 z-20 transition-all duration-300 ease-in-out transform translate-x-0 border-r border-gray-100/10">
        <div className="flex justify-between items-center mb-4 border-b border-gray-100/20 pb-3">
          <div className="flex flex-wrap items-center">
            {renderCategoryTitle()}
            {devices.length > 0 && (
              <span className="text-sm text-white/70 ml-2">
                {searchValue ? `${filteredDevices.length}/${devices.length}` : devices.length} 개
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1"
            aria-label="Close device panel"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {categoryName &&
          categoryName.includes('-') &&
          categoryName.includes('(') &&
          categoryName.includes(')') && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {categoryName
                .split('-')[1]
                .match(/\(([^)]+)\)/)?.[1]
                .split(',')
                .map((tag, index) => (
                  <div
                    key={index}
                    className="text-xs px-2 py-0.5 rounded-full bg-gray-700/60 text-white/70 font-medium border border-white/5"
                  >
                    {tag.trim()}
                  </div>
                ))}
            </div>
          )}

        {devices.length === 0 && (
          <p className="text-gray-400 text-center py-4">
            해당 카테고리에 등록된 <br /> 장치가 없습니다.
          </p>
        )}

        {devices.length > 0 && (
          <>
            <div className="mb-3">
              <div className="relative">
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-primary-800/30 border border-gray-100/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  placeholder="장비 검색..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
                <svg
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
            <ul className="space-y-2 h-[85%] overflow-y-auto custom-scrollbar pr-1">
              {filteredDevices
                .sort((a, b) => {
                  const aNum = /^\d/.test(a.name);
                  const bNum = /^\d/.test(b.name);

                  if (aNum && bNum) {
                    return parseInt(a.name) - parseInt(b.name);
                  } else if (aNum) {
                    return -1;
                  } else if (bNum) {
                    return 1;
                  } else {
                    return a.name.localeCompare(b.name);
                  }
                })
                .map((device) => (
                  <li
                    key={device.id}
                    className="px-4 py-3 bg-primary-700/40 hover:bg-primary-600/40 rounded-lg cursor-pointer text-gray-200 hover:text-white transition-all flex items-center"
                    onClick={() => {
                      openModal(device.name, device.id, categoryType, String(externalCode));
                      handleDeviceClick(device);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-3 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                      />
                    </svg>
                    {device.name}
                  </li>
                ))}
            </ul>
            {filteredDevices.length === 0 && (
              <p className="text-gray-400 text-center py-4">
                검색 결과가 없습니다.
              </p>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default DevicePanel;