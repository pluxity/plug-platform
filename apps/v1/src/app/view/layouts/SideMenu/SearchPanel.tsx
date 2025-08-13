import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useDebounce } from 'react-use';
import { Input } from '@plug/ui';
import useSideMenuStore from '@plug/v1/app/stores/sideMenuStore';
import useStationStore from '@plug/v1/app/stores/stationStore';
import * as Px from '@plug/engine/src';
import { clsx } from 'clsx';

interface SearchResult {
  id: string;
  name: string;
  categoryName: string;
  categoryId: string;
  featureId: string;
  floorId: string;
}

const SearchPanel: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { menuItems, isDevicePanelOpen, openMenuByDeviceId } = useSideMenuStore();
  const { setCurrentFloor } = useStationStore();

  useDebounce(
    () => {
      setDebouncedSearchTerm(searchTerm);
    },
    300,
    [searchTerm]
  );

  const allDevices = useMemo(() => {
    return menuItems.flatMap(category =>
      category.devices.map(device => ({
        id: device.id,
        name: device.name,
        categoryName: category.name,
        categoryId: category.id,
        featureId: device.feature.id,
        floorId: device.feature.floorId
      }))
    );
  }, [menuItems]);

  useEffect(() => {
    if (debouncedSearchTerm.trim() === '') {
      setResults([]);
      return;
    }

    const filteredResults = allDevices.filter(device =>
      device.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      device.id.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      device.categoryName.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );

    setResults(filteredResults);
  }, [debouncedSearchTerm, allDevices]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isExpanded &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        if (searchTerm.trim() === '') {
          setIsExpanded(false);
        }
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded, searchTerm]);

  const handleExpandClick = () => {
    setIsExpanded(true);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  const handleSelectDevice = (device: SearchResult) => {
    setCurrentFloor(device.floorId);

    Px.Model.HideAll();
    if (device.floorId === 'ALL') {
      Px.Model.ShowAll();
    } else {
      Px.Model.Show(device.floorId);
    }

    setTimeout(() => {
      Px.Camera.MoveToPoi(device.featureId, 1.5);
      openMenuByDeviceId(device.id);
    }, 200);

    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div
      className={clsx(
        'fixed transition-all duration-300 ease-in-out top-20 z-20',
        isDevicePanelOpen ? 'left-[23rem]' : 'left-20',
      )}
    >
      <div
        className={clsx(
          'transition-all duration-300 ease-in-out relative',
          isExpanded ? 'w-80' : 'w-10',
        )}
      >
        {isExpanded ? (
          <div
            className="backdrop-blur-md rounded-lg shadow-xl transition-opacity duration-300 opacity-100"
            ref={inputRef}
          >
            <Input
              type="text"
              placeholder="디바이스 검색..."
              value={searchTerm}
              onChange={setSearchTerm}
              onFocus={() => setIsOpen(true)}
              className="w-full text-white"
              autoComplete="off"
            />
          </div>
        ) : (
          <button
            onClick={handleExpandClick}
            className="w-10 h-10 flex items-center justify-center bg-primary-900/40 backdrop-blur-md border border-primary-100/10 rounded-full shadow-xl text-white hover:bg-primary-800/80 transition-all duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5 text-gray-300"
            >
              <path
                fillRule="evenodd"
                d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}

        {isOpen && results.length > 0 && (
          <div className="mt-2 absolute w-full left-0 max-h-80 overflow-y-auto custom-scrollbar bg-primary-900/60 backdrop-blur-lg border border-primary-100/10 rounded-lg shadow-xl">
            {results.map((result) => (
              <div
                key={result.id}
                className="p-3 hover:bg-primary-800/50 cursor-pointer border-b border-primary-100/5 last:border-0"
                onClick={() => handleSelectDevice(result)}
              >
                <div className="flex items-start justify-between">
                  <div className="font-medium text-white truncate">{result.name}</div>
                  <div className="ml-2 text-xs px-2 py-0.5 rounded-full bg-gray-700/60 text-white/70 font-medium border border-white/5">
                    {result.categoryName}
                  </div>
                </div>
                <div className="text-xs text-gray-400 mt-1">ID: {result.id}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPanel;