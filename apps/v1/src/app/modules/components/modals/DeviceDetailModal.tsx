import { Modal, Card, Button } from '@plug/ui';
import { nfluxService, Light, Shutter, AirPurifier } from '@plug/v1/app/api';
import { useState, useEffect } from 'react';

export interface DeviceDetailProps {
  isOpen: boolean;
  onClose: () => void;
  deviceType?: 'light' | 'shutter' | 'airPurifier';
  stationId: string;
  selectedDeviceId: string | null;
}

type Device = {
  id: string;
  name: string;
  fcltsType: string;
  status: { ioValue: string };
};

type DeviceResponse = {
  lights?: Light[];
  shutters?: Shutter[];
  airPurifiers?: AirPurifier[];
};

const DEVICE_MAP = {
  light: nfluxService.getStationLights,
  shutter: nfluxService.getStationShutters,
  airPurifier: nfluxService.getAirPurifiers,
};

const DEVICE_MAP_RESPONSE = {
  light: 'lights',
  shutter: 'shutters',
  airPurifier: 'airPurifiers',
};

export const DeviceDetailModal = ({
  isOpen,
  onClose,
  deviceType,
  stationId,
}: DeviceDetailProps) => {
  const [Devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!deviceType || !stationId) {
        setDevices([]);
        return;
    }

    const fetchDevices = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await DEVICE_MAP[deviceType](stationId) as DeviceResponse;
        const responseKey = DEVICE_MAP_RESPONSE[deviceType] as keyof DeviceResponse;
        const data = response[responseKey];
        

        if (data) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const transformDevices: Device[] = data.map((Device: any) => ({
            id: Device[`${deviceType}Id`],
            name: Device[`${deviceType}Name`],
            fcltsType: Device.fcltsType,
            status: Device.status,
          }));
          setDevices(transformDevices);
        }         
      } catch (error) {
        console.error('Error fetching Device Details:', error);
        setError('Failed to load Device Details');
        setDevices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, [isOpen, deviceType, stationId]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${deviceType} 정보`}
      footer={<Button onClick={onClose}>닫기</Button>}
    >
        {loading && <p className="text-gray-400">Loading Devices...</p>}
        {!loading && error && <p className="text-red-400">{error}</p>}
        {!loading && !error && Devices.length === 0 && (<p className="text-gray-400">No Devices found in this category.</p>)}
        {!loading && Devices.length > 0 && (
            Devices.map((device) => (
            <Card key={device.id}>
                <Card.Header>
                    <Card.Title>{device.name}</Card.Title>
                    <Card.Description>ID: {device.id}</Card.Description>
                </Card.Header>
                <Card.Content>
                    <p>시설 유형: {device.fcltsType}</p>
                    {device.status && <p>상태: {device.status.ioValue}</p>}
                </Card.Content>
            </Card>
            ))
        )}
    </Modal>
  );
};
