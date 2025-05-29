import React, { useEffect, useState } from 'react';
import { api } from '@plug/api-hooks/core';
// import useStationStore from '@plug/v1/app/stores/stationStore';


interface Device {
  id: string;
  name: string;
}

interface DevicePanelProps {
  categoryId: string | null;
  onClose: () => void;
}

const DevicePanel: React.FC<DevicePanelProps> = ({ categoryId, onClose }) => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  // const { stationId } = useStationStore(); 

  useEffect(() => {
    if (!categoryId) {
      setDevices([]);
      return;
    }

    const fetchDevices = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get<Device[]>(`device-categories/${categoryId}/devices`);
        setDevices(response.data || []);
      } catch (err) {
        console.error('Error fetching devices:', err);
        setError('Failed to load devices.');
        setDevices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, [categoryId]);

  if (!categoryId) {
    return null;
  }

  return (
    <div className="fixed left-16 top-16 bottom-0 w-72 bg-primary-400/20 backdrop-blur-xs p-4 z-20 transition-all duration-300 ease-in-out transform translate-x-0">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Devices</h2>
        <button 
          onClick={onClose} 
          className="text-gray-500 hover:text-gray-700 text-2xl"
          aria-label="Close device panel"
        >
          &times;
        </button>
      </div>
      {loading && <p className="text-gray-500">Loading devices...</p>}
      {!loading && !error && devices.length === 0 && <p className="text-gray-500">No devices found in this category.</p>}
      {!loading && !error && devices.length > 0 && (
        <ul className="space-y-2">
          {devices.map(device => (
            <li key={device.id} className="p-2 hover:bg-gray-100 rounded-md cursor-pointer text-gray-700">
              {device.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DevicePanel;
