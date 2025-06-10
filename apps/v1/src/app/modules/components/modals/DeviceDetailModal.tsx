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

const StatusBadge = ({ status, type }: { status: IOStatus; type: StatusType }) => {
  const getGlowColor = (status: IOStatus, type: StatusType) => {
    const baseColor = getStatusColor(status, type);
    return baseColor.replace('text-', 'shadow-');
  };

  return (
    <div className={`
      px-3 py-1 rounded-full 
      ${getStatusColor(status, type)}
      ${getGlowColor(status, type)}/20
      border border-current/30 bg-black/20 backdrop-blur-sm
      text-xs font-medium
      flex items-center gap-2
      shadow-lg
    `}>
      <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      {getStatusText(status, type)}
    </div>
  );
};

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
  <div className="
    relative group
    flex justify-between items-center
    bg-primary-950/40 hover:bg-primary-900/40
    backdrop-blur-md rounded-lg px-4 py-3
    border border-primary-700/20 hover:border-primary-600/30
    transition-all duration-200
  ">
    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    <span className="text-primary-200 text-sm font-medium">{label}</span>
    <div className="flex items-center gap-3">
      {type === 'value' ? (
        <span className="text-primary-100 font-medium tabular-nums">
          {status.ioValue}{suffix}
        </span>
      ) : (
        <StatusBadge status={status} type={type} />
      )}
    </div>
  </div>
);

const PumpList = ({ pumps }: { pumps: Pump[] }) => (
  <div className="space-y-4">
    <h4 className="text-primary-100 font-medium flex items-center gap-2">
      <svg className="w-4 h-4 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
      펌프 상태
    </h4>
    <div className="grid gap-4">
      {pumps.map((pump, index) => (
        <div key={`${pump.pumpName}-${index}`}
             className="
               relative overflow-hidden
               bg-primary-900/30 hover:bg-primary-900/40
               backdrop-blur-md rounded-xl p-4
               border border-primary-700/30
               transition-all duration-200
             "
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-transparent" />
          <div className="relative">
            <h5 className="font-medium text-primary-100 pb-3 mb-4 border-b border-primary-700/30 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
              펌프 {index + 1}: {pump.pumpName}
            </h5>
            <div className="grid grid-cols-2 gap-3">
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
        </div>
      ))}
    </div>
  </div>
);

const CCTVList = ({ cctvs }: { cctvs: Array<{ cctvName: string }> }) => (
  <div className="rounded-lg bg-primary-950/40 border border-primary-700/30 p-4">
    <div className="flex items-center gap-2 mb-3">
      <svg className="w-4 h-4 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
      <span className="font-medium text-primary-100">연관 CCTV</span>
    </div>
    <div className="space-y-2">
      {cctvs.map((cctv, index) => (
        <div
          key={index}
          className="
            group flex items-center gap-2 px-3 py-2
            rounded-md bg-primary-900/30 hover:bg-primary-800/40
            border border-primary-700/20 hover:border-primary-600/30
            transition-all duration-200
          "
        >
          <div className="w-1.5 h-1.5 rounded-full bg-primary-400/60 group-hover:bg-primary-400 transition-colors" />
          <span className="text-sm text-primary-200 group-hover:text-primary-100 transition-colors">
            {cctv.cctvName}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const CommonInfo = ({ device }: { device: DeviceData }) => (
  <div className="bg-primary-950/40 rounded-xl p-4 border border-primary-700/20 space-y-4 mb-6">
    <div className="grid gap-3">
      {[
        { label: "장비명", value: getDeviceName(device) },
        { label: "수집시간", value: device.collectedTime || '정보 없음' },
        { label: "역사", value: getStationName(device) }
      ].map(({ label, value }, index) => (
        <div
          key={index}
          className="group relative bg-primary-900/30 hover:bg-primary-900/40
            rounded-lg px-4 py-3 border border-primary-700/20
            transition-all duration-200"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-transparent
            rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative flex justify-between items-center">
            <span className="text-primary-300 font-medium">{label}</span>
            <span className="text-primary-100 font-semibold">{value}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const DeviceDetailsWrapper = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-primary-950/40 rounded-xl p-4 border border-primary-700/20">
    <h4 className="flex items-center gap-2 text-primary-100 font-medium mb-4 pb-3
      border-b border-primary-700/30">
      <div className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse" />
      {title}
    </h4>
    <div className="space-y-3">
      {children}
    </div>
  </div>
);

// Device-specific components
const LightDetails = ({ device }: { device: Light }) => (
  <DeviceDetailsWrapper title="조명 상태">
    <StatusRow label="동작 상태" status={device.status} type="onoff" />
    <StatusRow label="제어 위치" status={device.controlPosition} type="remoteLocal" />
    <div className="group relative bg-primary-900/30 hover:bg-primary-900/40
      rounded-lg px-4 py-3 border border-primary-700/20
      transition-all duration-200">
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-transparent
        rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative flex justify-between items-center">
        <span className="text-primary-300">순서</span>
        <span className="text-primary-100 font-semibold">{device.orderingSequence}</span>
      </div>
    </div>
  </DeviceDetailsWrapper>
);

const ShutterDetails = ({ device }: { device: Shutter }) => (
  <DeviceDetailsWrapper title="셔터 상태">
    <StatusRow label="동작 상태" status={device.status} type="shutter" />
    {device.cctvList && device.cctvList.length > 0 && (
      <CCTVList cctvs={device.cctvList} />
    )}
  </DeviceDetailsWrapper>
);

const FireSensorDetails = ({ device }: { device: FireSensor }) => (
  <DeviceDetailsWrapper title="화재수신기 상태">
    <div className="relative">
      <div className="absolute -left-1 top-0 bottom-0 w-[2px] bg-gradient-to-b from-red-500/50 via-red-500/20 to-transparent" />
      <StatusRow label="감지 상태" status={device.status} type="fire" />
    </div>
  </DeviceDetailsWrapper>
);

const ElevatorDetails = ({ device }: { device: Elevator }) => (
  <DeviceDetailsWrapper title="엘리베이터 상태">
    <div className="grid gap-3">
      <div className="bg-primary-900/30 rounded-lg p-4 border border-primary-700/20">
        <div className="grid gap-3">
          <StatusRow label="동작 상태" status={device.status} type="elevator" />
          {device.downMoveStatus && (
            <StatusRow label="하강 상태" status={device.downMoveStatus} type="operation" />
          )}
          <StatusRow label="오류 상태" status={device.error} type="normalError" />
        </div>
      </div>
      {device.pumps && device.pumps.length > 0 && <PumpList pumps={device.pumps} />}
    </div>
  </DeviceDetailsWrapper>
);

const EscalatorDetails = ({ device }: { device: Escalator }) => (
  <DeviceDetailsWrapper title="에스컬레이터 상태">
    <div className="bg-primary-900/30 rounded-lg p-4 border border-primary-700/20">
      <div className="grid gap-3">
        <StatusRow label="동작 상태" status={device.status} type="escalator" />
        <StatusRow label="오류 상태" status={device.error} type="normalError" />
      </div>
    </div>
  </DeviceDetailsWrapper>
);

const WaterTankDetails = ({ device }: { device: WaterTank }) => (
  <DeviceDetailsWrapper title="물탱크 상태">
    <div className="grid gap-4">
      <div className="bg-primary-900/30 rounded-lg p-4 border border-primary-700/20">
        <div className="grid gap-3">
          <div className="grid grid-cols-2 gap-3">
            <StatusRow label="수압" status={device.waterPressure} type="value" />
            <StatusRow label="수위" status={device.waterLevel} type="value" />
          </div>
          <div className="grid grid-cols-1 gap-3">
            <StatusRow label="저수위 상태" status={device.lowWaterLevelStatus} type="waterLevel" />
            <StatusRow label="고수위 상태" status={device.highWaterLevelStatus} type="waterLevel" />
            <StatusRow label="만수위 상태" status={device.fullWaterLevelStatus} type="waterLevel" />
          </div>
        </div>
      </div>
      {device.pumps && device.pumps.length > 0 && <PumpList pumps={device.pumps} />}
    </div>
  </DeviceDetailsWrapper>
);

const CatchpitDetails = ({ device }: { device: Catchpit }) => (
  <DeviceDetailsWrapper title="집수정 상태">
    <div className="grid gap-4">
      <div className="bg-primary-900/30 rounded-lg p-4 border border-primary-700/20">
        <div className="grid gap-3">
          <StatusRow label="수위" status={device.waterLevel} type="value" />
          <div className="p-3 rounded-lg bg-primary-800/20 border border-primary-700/20">
            <div className="grid gap-3">
              <StatusRow label="저수위 상태" status={device.lowWaterLevelStatus} type="waterLevel" />
              <StatusRow label="고수위 상태" status={device.highWaterLevelStatus} type="waterLevel" />
              <StatusRow label="만수위 상태" status={device.fullWaterLevelStatus} type="waterLevel" />
            </div>
          </div>
        </div>
      </div>
      {device.pumps && device.pumps.length > 0 && <PumpList pumps={device.pumps} />}
    </div>
  </DeviceDetailsWrapper>
);

const AirPurifierDetails = ({ device }: { device: AirPurifier }) => (
  <DeviceDetailsWrapper title="공기청정기 상태">
    <div className="bg-primary-900/30 rounded-lg p-4 border border-primary-700/20">
      <div className="grid gap-3">
        <div className="group relative">
          <div className="absolute -left-1 top-0 bottom-0 w-[2px] bg-gradient-to-b from-blue-500/50 via-blue-500/20 to-transparent" />
          <StatusRow label="동작 상태" status={device.status} type="operation" />
        </div>
        <StatusRow label="오류 상태" status={device.error} type="normalError" />
        <StatusRow label="통신 상태" status={device.communicationFailure} type="normalError" />
      </div>
    </div>
  </DeviceDetailsWrapper>
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
      title={
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
          <span className="text-primary-100">{deviceId} 상세정보</span>
        </div>
      }
      contentClassName="
      !bg-primary-900/30 backdrop-blur-xl
      border border-primary-600/20
      shadow-2xl shadow-primary-500/10
    "
      headerClassName="!bg-transparent !border-b !border-primary-600/20 !px-6 !py-4"
      bodyClassName="!bg-transparent !px-6 !py-4"
      footerClassName="!bg-transparent !border-t !border-primary-600/20 !px-6 !py-4"
      showCloseButton={false}
      footer={
        <Button
          variant="outline"
          onClick={onClose}
          className="
          text-primary-100 border-primary-400/30
          hover:bg-primary-400/10 hover:border-primary-400/50
          transition-all duration-200
        "
        >
          닫기
        </Button>
      }
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
