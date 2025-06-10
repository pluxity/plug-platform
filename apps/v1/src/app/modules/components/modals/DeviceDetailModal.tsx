import React, { useState, useEffect } from 'react';
import { Button, Modal } from '@plug/ui';
import { nfluxService } from '@plug/v1/app/api';
import type { Light, Shutter, FireSensor, Elevator, Escalator, WaterTank, Catchpit, AirPurifier, IOStatus, Pump } from '@plug/v1/app/api/types/nflux';

// Types
type DeviceData = Light | Shutter | FireSensor | Elevator | Escalator | WaterTank | Catchpit | AirPurifier;
type StatusType = 'onoff' | 'operation' | 'shutter' | 'fire' | 'elevator' | 'escalator' | 'remoteLocal' | 'normalError' | 'waterLevel' | 'value';

export interface DeviceDetailProps {
  isOpen: boolean;  
  onClose: () => void;
  deviceType: string;
  stationId: string;
  deviceId: string | null;
}

// Constants
const STATUS_TEXT_MAP: Record<StatusType, Record<string, string>> = {
  onoff: { '0': 'OFF', '1': 'ON' },
  operation: { '0': '정지', '1': '운행중' },
  shutter: { '1': '정지', '2': '상승', '3': '하강' },
  fire: { '0': '정상', '1': '화재발생' },
  elevator: { '0': '정지', '1': '운행중', '2': '장애' },
  escalator: { '0': '정지', '1': '운행중', '2': '장애' },
  remoteLocal: { '0': '로컬', '1': '원격' },
  normalError: { '0': '정상', '1': '장애' },
  waterLevel: { '0': '정상', '1': '이상' },
  value: {},
};

const STATUS_COLOR_MAP: Record<StatusType, Record<string, string>> = {
  onoff: { '0': 'text-gray-500', '1': 'text-green-500' },
  operation: { '0': 'text-gray-500', '1': 'text-blue-500' },
  shutter: { '1': 'text-gray-500', '2': 'text-blue-500', '3': 'text-orange-500' },
  fire: { '0': 'text-green-500', '1': 'text-red-600' },
  elevator: { '0': 'text-gray-500', '1': 'text-blue-500', '2': 'text-red-500' },
  escalator: { '0': 'text-gray-500', '1': 'text-blue-500', '2': 'text-red-500' },
  remoteLocal: { '0': 'text-orange-500', '1': 'text-blue-500' },
  normalError: { '0': 'text-green-500', '1': 'text-red-500' },
  waterLevel: { '0': 'text-green-500', '1': 'text-yellow-500' },
  value: { default: 'text-blue-600' },
};

// Utility functions
const getStatusText = (status: IOStatus, type: StatusType = 'normalError'): string => {
  const value = status.ioValue;
  return STATUS_TEXT_MAP[type][value] || value || '정보 없음';
};

const getStatusColor = (status: IOStatus, type: StatusType = 'normalError'): string => {
  const value = status.ioValue;
  return STATUS_COLOR_MAP[type][value] || STATUS_COLOR_MAP[type].default || 'text-gray-400';
};

const getDeviceName = (device: DeviceData): string => {
  if ('lightName' in device) return device.lightName;
  if ('shutterName' in device) return device.shutterName;
  if ('fireSensorName' in device) return device.fireSensorName;
  if ('elevatorName' in device) return device.elevatorName;
  if ('escalatorName' in device) return device.escalatorName;
  if ('waterTankName' in device) return device.waterTankName;
  if ('catchpitName' in device) return device.catchpitName;
  if ('airPurifierName' in device) return device.airPurifierName;
  return '알 수 없음';
};

const getStationName = (device: DeviceData): string => {
  if ('stationName' in device) return device.stationName || '정보 없음';
  return '정보 없음';
};

// Reusable components
const StatusRow = ({ 
  label, 
  status, 
  type = 'normalError', 
  suffix = '' 
}: { 
  label: string;
  status: IOStatus;
  type?: StatusType;
  suffix?: string;
}) => (
  <div
    className="flex justify-between items-center bg-gray-800/20 backdrop-blur-md rounded px-4 py-2.5 border border-primary-700/30">
    <span className="text-primary-200">{label}:</span>
    <span className={type === 'value' ? 'text-blue-600' : getStatusColor(status, type)}>
      {type === 'value' ? status.ioValue : getStatusText(status, type)}{suffix}
    </span>
  </div>
);

const PumpList = ({ pumps }: { pumps: Pump[] }) => (
  <div>
    <span className="font-medium text-primary-100">펌프 상태:</span>
    <div className="mt-2 space-y-3">
      {pumps.map((pump, index) => (
        <div key={`${pump.pumpName}-${index}`}
             className="bg-primary-800/25 backdrop-blur-md border border-primary-700/30 rounded-lg p-4 space-y-3">
          <h5 className="font-medium text-primary-100 pb-2 border-b border-primary-700/30">
            펌프 {index + 1}: {pump.pumpName}
          </h5>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <StatusRow label="상태" status={pump.status} type="operation" />
            <StatusRow label="오류" status={pump.error} type="normalError" />
            {pump.remoteSetting && (
              <StatusRow label="원격설정" status={pump.remoteSetting} type="remoteLocal" />
            )}
            {pump.operationTime && (
              <StatusRow label="가동시간" status={pump.operationTime} type="value" suffix="시간" />
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const CCTVList = ({ cctvs }: { cctvs: Array<{ cctvName: string }> }) => (
  <div>
    <span className="font-medium text-primary-100">연관 CCTV:</span>
    <div className="mt-2 space-y-2">
      {cctvs.map((cctv, index) => (
        <div key={index} className="text-sm text-primary-100/80 ml-4 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-primary-400/60" />
          {cctv.cctvName}
        </div>
      ))}
    </div>
  </div>
);

const CommonInfo = ({ device }: { device: DeviceData }) => (
  <div className="mb-6 space-y-3">
    <div
      className="flex justify-between items-center bg-gray-800/20 backdrop-blur-md rounded px-4 py-2.5 border border-primary-700/30">
      <span className="font-medium text-primary-200">장비명</span>
      <span className="text-primary-100">{getDeviceName(device)}</span>
    </div>
    <div
      className="flex justify-between items-center bg-gray-800/20 backdrop-blur-md rounded px-4 py-2.5 border border-primary-700/30">
      <span className="font-medium text-primary-200">수집시간</span>
      <span className="text-primary-100">{device.collectedTime || '정보 없음'}</span>
    </div>
    <div
      className="flex justify-between items-center bg-gray-800/20 backdrop-blur-md rounded px-4 py-2.5 border border-primary-700/30">
      <span className="font-medium text-primary-200">역사</span>
      <span className="text-primary-100">{getStationName(device)}</span>
    </div>
  </div>
);

// Device-specific components
const LightDetails = ({ device }: { device: Light }) => (
  <div className="space-y-3">
    <h4 className="font-semibold text-primary-100 border-b pb-2">조명 상태</h4>
    <StatusRow label="동작 상태" status={device.status} type="onoff" />
    <StatusRow label="제어 위치" status={device.controlPosition} type="remoteLocal" />
    <div
      className="flex justify-between items-center bg-gray-800/20 backdrop-blur-md rounded px-4 py-2.5 border border-primary-700/30">
      <span className="text-primary-200">순서:</span>
      <span className="text-primary-100">{device.orderingSequence}</span>
    </div>
  </div>
);

const ShutterDetails = ({ device }: { device: Shutter }) => (
  <div className="space-y-3">
    <h4 className="font-semibold text-primary-100 border-b border-primary-700/30 pb-2">셔터 상태</h4>
    <StatusRow label="동작 상태" status={device.status} type="shutter" />
    {device.cctvList && device.cctvList.length > 0 && (
      <CCTVList cctvs={device.cctvList} />
    )}
  </div>
);

const FireSensorDetails = ({ device }: { device: FireSensor }) => (
  <div className="space-y-3">
    <h4 className="font-semibold text-primary-100 border-b border-primary-700/30 pb-2">화재수신기 상태</h4>
    <StatusRow label="감지 상태" status={device.status} type="fire" />
  </div>
);

const ElevatorDetails = ({ device }: { device: Elevator }) => (
  <div className="space-y-3">
    <h4 className="font-semibold text-primary-100 border-b border-primary-700/30 pb-2">엘리베이터 상태</h4>
    <StatusRow label="동작 상태" status={device.status} type="elevator" />
    {device.downMoveStatus && (
      <StatusRow label="하강 상태" status={device.downMoveStatus} type="operation" />
    )}
    <StatusRow label="오류 상태" status={device.error} type="normalError" />
    {device.pumps && device.pumps.length > 0 && <PumpList pumps={device.pumps} />}
  </div>
);

const EscalatorDetails = ({ device }: { device: Escalator }) => (
  <div className="space-y-3">
    <h4 className="font-semibold text-primary-100 border-b border-primary-700/30 pb-2">에스컬레이터 상태</h4>
    <StatusRow label="동작 상태" status={device.status} type="escalator" />
    <StatusRow label="오류 상태" status={device.error} type="normalError" />
  </div>
);

const WaterTankDetails = ({ device }: { device: WaterTank }) => (
  <div className="space-y-3">
    <h4 className="font-semibold text-primary-100 border-b border-primary-700/30 pb-2">물탱크 상태</h4>
    <StatusRow label="수압" status={device.waterPressure} type="value" />
    <StatusRow label="수위" status={device.waterLevel} type="value" />
    <StatusRow label="저수위 상태" status={device.lowWaterLevelStatus} type="waterLevel" />
    <StatusRow label="고수위 상태" status={device.highWaterLevelStatus} type="waterLevel" />
    <StatusRow label="만수위 상태" status={device.fullWaterLevelStatus} type="waterLevel" />
    {device.pumps && device.pumps.length > 0 && <PumpList pumps={device.pumps} />}
  </div>
);

const CatchpitDetails = ({ device }: { device: Catchpit }) => (
  <div className="space-y-3">
    <h4 className="font-semibold text-primary-100 border-b border-primary-700/30 pb-2">집수정 상태</h4>
    <StatusRow label="수위" status={device.waterLevel} type="value" />
    <StatusRow label="저수위 상태" status={device.lowWaterLevelStatus} type="waterLevel" />
    <StatusRow label="고수위 상태" status={device.highWaterLevelStatus} type="waterLevel" />
    <StatusRow label="만수위 상태" status={device.fullWaterLevelStatus} type="waterLevel" />
    {device.pumps && device.pumps.length > 0 && <PumpList pumps={device.pumps} />}
  </div>
);

const AirPurifierDetails = ({ device }: { device: AirPurifier }) => (
  <div className="space-y-3">
    <h4 className="font-semibold text-primary-100 border-b border-primary-700/30 pb-2">공기청정기 상태</h4>
    <StatusRow label="동작 상태" status={device.status} type="operation" />
    <StatusRow label="오류 상태" status={device.error} type="normalError" />
    <StatusRow label="통신 상태" status={device.communicationFailure} type="normalError" />
  </div>
);

// Custom hook for device data fetching
const useDeviceData = (isOpen: boolean, deviceId: string | null, deviceType: string, stationId: string) => {
  const [deviceData, setDeviceData] = useState<DeviceData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !deviceId) {
      setDeviceData(null);
      setError(null);
      return;
    }

    const fetchDeviceData = async () => {
      setLoading(true);
      setError(null);

      try {
        let data: DeviceData | null = null;

        switch (deviceType.toLowerCase()) {
          case 'light':
          case 'lights': {
            const result = await nfluxService.getLights(stationId);
            data = result.lights.find(item => item.lightId === deviceId) || null;
            break;
          }
          case 'shutter':
          case 'shutters': {
            const result = await nfluxService.getShutters(stationId);
            data = result.shutters.find(item => item.shutterId === deviceId) || null;
            break;
          }
          case 'fire-sensor':
          case 'fire-sensors': {
            const result = await nfluxService.getFireSensors(stationId);
            data = result['fire-sensors'].find(item => item.fireSensorId === deviceId) || null;
            break;
          }
          case 'elevator':
          case 'elevators': {
            const result = await nfluxService.getElevators(stationId);
            data = result.elevators.find(item => item.elevatorId === deviceId) || null;
            break;
          }
          case 'escalator':
          case 'escalators': {
            const result = await nfluxService.getEscalators(stationId);
            data = result.escalators.find(item => item.escalatorId === deviceId) || null;
            break;
          }
          case 'watertank':
          case 'watertanks': {
            const result = await nfluxService.getWaterTanks(stationId);
            data = result.waterTanks.find(item => item.waterTankId === deviceId) || null;
            break;
          }
          case 'catchpit':
          case 'catchpits': {
            const result = await nfluxService.getCatchpits(stationId);
            data = result.catchpits.find(item => item.catchpitId === deviceId) || null;
            break;
          }
          case 'airpurifier':
          case 'airpurifiers': {
            const result = await nfluxService.getAirPurifiers(stationId);
            data = result.airPurifiers.find(item => item.airPurifierId === deviceId) || null;
            break;
          }
          default:
            throw new Error(`지원하지 않는 장비 타입: ${deviceType}`);
        }

        if (!data) {
          throw new Error(`장비를 찾을 수 없습니다: ${deviceId}`);
        }

        setDeviceData(data);
      } catch (err) {
        console.error('Device data fetch error:', err);
        setError(err instanceof Error ? err.message : '장비 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchDeviceData();
  }, [isOpen, deviceId, deviceType, stationId]);

  return { deviceData, loading, error };
};

export const DeviceDetailModal = ({
  isOpen,
  onClose,
  deviceType,
  stationId,
  deviceId,
}: DeviceDetailProps) => {
  const { deviceData, loading, error } = useDeviceData(isOpen, deviceId, deviceType, stationId);

  const renderDeviceDetails = () => {
    if (!deviceData) return null;

    switch (deviceType.toLowerCase()) {
      case 'light':
      case 'lights':
        return <LightDetails device={deviceData as Light} />;
      case 'shutter':
      case 'shutters':
        return <ShutterDetails device={deviceData as Shutter} />;
      case 'fire-sensor':
      case 'fire-sensors':
        return <FireSensorDetails device={deviceData as FireSensor} />;
      case 'elevator':
      case 'elevators':
        return <ElevatorDetails device={deviceData as Elevator} />;
      case 'escalator':
      case 'escalators':
        return <EscalatorDetails device={deviceData as Escalator} />;
      case 'watertank':
      case 'watertanks':
        return <WaterTankDetails device={deviceData as WaterTank} />;
      case 'catchpit':
      case 'catchpits':
        return <CatchpitDetails device={deviceData as Catchpit} />;
      case 'airpurifier':
      case 'airpurifiers':
        return <AirPurifierDetails device={deviceData as AirPurifier} />;
      default:
        return <div>지원하지 않는 장비 타입입니다.</div>;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${deviceId} 상세정보`}
      contentClassName="!bg-primary-900/40  backdrop-blur-xl border border-primary-700/30"
      headerClassName="!bg-transparent !border-b text-white !border-primary-700/30 !px-6 !py-4"
      titleClassName="!text-white"
      footer={
        <Button
          variant="outline"
          onClick={onClose}
          className="text-primary-100 border-primary-400/30 hover:bg-primary-400/10"
        >
          닫기
        </Button>
      }
      showCloseButton={false}
      bodyClassName="!bg-transparent "
      footerClassName="!bg-transparent !border-t !border-primary-700/30 !px-6 !py-4"
    >
      <div className="max-h-96 overflow-y-auto">
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="text-primary-100 flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>장비 정보를 불러오는 중...</span>
            </div>
          </div>
        )}

        {error && (
          <div
            className="text-red-500/90 text-center py-4 bg-red-900/40 border border-red-500/20 rounded-lg backdrop-blur-xl shadow-lg">
            {error}
          </div>
        )}

        {deviceData && !loading && !error && (
          <>
            <CommonInfo device={deviceData} />
            {renderDeviceDetails()}
          </>
        )}
      </div>
    </Modal>
  );
};
