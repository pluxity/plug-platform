import React, { useEffect, useState } from 'react';
import { api } from '@plug/api-hooks/core';
import * as Px from '@plug/engine/src';
import useStationStore from '@plug/v1/app/stores/stationStore';
import { DeviceDetailModal } from '../../../components/modals/DeviceDetailModal';

interface DeviceData {
  id: string;
  name: string;
  feature: DeviceFeature;
}

interface DeviceFeature {
  id: string;
  floorId: string;
  assetId: string;
  deviceCode: string;
}

interface DeviceGroup {
  categoryId: string;
  categoryName: string;
  devices: DeviceData[];
}

interface DevicePanelProps {
  categoryName: string | null;
  categoryId: string | null;
  onClose: () => void;
}

const DevicePanel: React.FC<DevicePanelProps> = ({ categoryId, categoryName, onClose }) => {
  const [devices, setDevices] = useState<DeviceData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { stationId, setCurrentFloor, selectedDeviceId, setSelectedDeviceId } = useStationStore();

  useEffect(() => {
    if (!categoryId || !stationId) {
      setDevices([]);
      return;
    }

    const fetchDevices = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.get<DeviceGroup[]>(`devices/station/${stationId}/grouped`);
        if (response.data) {
          const transformDevices = response.data.find(item => {
                return String(item.categoryId) === String(categoryId)
            } 
          );
          setDevices(transformDevices?.devices || []);
        } 
      } catch (err) {
        console.error('Error fetching devices:', err);
        setError('Failed to load devices.');
        setDevices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, [categoryId, stationId]);

  const handleDeviceClick = (device: DeviceData) => {
    try {
      if (device.feature.id && device.feature.floorId) {
        // 먼저 해당 층으로 변경
        setCurrentFloor(device.feature.floorId);
        
        // 층 변경 후 카메라 이동
        Px.Model.HideAll();
        Px.Model.Show(device.feature.floorId);
        Px.Camera.MoveToPoi(device.feature.id, 1.0);
      } 
    } catch (error) {
      console.error('이동 중 오류 발생:', error);
    }
  };

  if (!categoryId) {
    return null;
  }

  return (
    <>
      <div className="fixed left-16 top-16 bottom-0 w-72 bg-primary-400/20 backdrop-blur-xs p-4 z-20 transition-all duration-300 ease-in-out transform translate-x-0">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-white">{categoryName}</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-400 text-2xl"
            aria-label="Close device panel"
          >
            &times;
          </button>
        </div>

        {loading && <p className="text-gray-400">Loading devices...</p>}
        {!loading && error && <p className="text-red-400">{error}</p>}
        {!loading && !error && devices.length === 0 && (<p className="text-gray-400">No devices found in this category.</p>)}
        {!loading && !error && devices.length > 0 && (
          <ul className="space-y-2">
            {devices.map(device => (
              <li 
                key={device.id} 
                className="p-2 hover:text-gray-400 rounded-md cursor-pointer text-white"
                onClick={() => {
                  setSelectedDeviceId(device.id);
                  handleDeviceClick(device)
                }}
              >
                {device.name}
              </li>
            ))}
          </ul>
        )}
      </div>
      <DeviceDetailModal
          isOpen={!!selectedDeviceId}
          onClose={() => {setSelectedDeviceId(null);}}
          stationId={String(stationId)}
          selectedDeviceId={selectedDeviceId}
          deviceType="shutter"
        /> 
    </>
  );
};

export default DevicePanel;
