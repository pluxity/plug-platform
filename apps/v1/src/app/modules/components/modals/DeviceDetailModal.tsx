import React, { useState, useEffect } from 'react';
import { Modal } from '@plug/ui';
import { nfluxService } from '@plug/v1/app/api';
import type { Light, Shutter, FireSensor, Elevator, Escalator, WaterTank, Catchpit, AirPurifier, IOStatus, Pump } from '@plug/v1/app/api/types/nflux';

// 장비 타입별 유니온 타입
type DeviceData = Light | Shutter | FireSensor | Elevator | Escalator | WaterTank | Catchpit | AirPurifier;

export interface DeviceDetailProps {
  isOpen: boolean;  
  onClose: () => void;
  deviceType: string;
  stationId: string;
  deviceCode: string | null;
}

// 상태 타입별 텍스트 변환
const getStatusText = (status: IOStatus, type: 'basic' | 'onoff' | 'operation' | 'shutter' | 'fire' | 'elevator' | 'escalator' | 'remoteLocal' | 'normalError' | 'waterLevel' = 'basic'): string => {
  const value = status.ioValue;
  
  switch (type) {
    case 'onoff': // 조명 On/Off
      switch (value) {
        case '0': return 'OFF';
        case '1': return 'ON';
        default: return value || '정보 없음';
      }
    
    case 'operation': // 일반 운전상태 (펌프, 공기청정기 등)
      switch (value) {
        case '0': return '정지';
        case '1': return '운행중';
        default: return value || '정보 없음';
      }
    
    case 'shutter': // 셔터 동작상태
      switch (value) {
        case '1': return '정지';
        case '2': return '상승';
        case '3': return '하강';
        default: return value || '정보 없음';
      }
    
    case 'fire': // 화재감지
      switch (value) {
        case '0': return '정상';
        case '1': return '화재발생';
        default: return value || '정보 없음';
      }
    
    case 'elevator': // 엘리베이터/수직리프트
      switch (value) {
        case '0': return '정지';
        case '1': return '운행중';
        case '2': return '장애';
        default: return value || '정보 없음';
      }
    
    case 'escalator': // 에스컬레이터
      switch (value) {
        case '0': return '정지';
        case '1': return '운행중';
        case '2': return '장애';
        default: return value || '정보 없음';
      }
    
    case 'remoteLocal': // 원격/로컬
      switch (value) {
        case '0': return '로컬';
        case '1': return '원격';
        default: return value || '정보 없음';
      }
    
    case 'normalError': // 정상/장애
      switch (value) {
        case '0': return '정상';
        case '1': return '장애';
        default: return value || '정보 없음';
      }
    
    case 'waterLevel': // 수위 상태
      switch (value) {
        case '0': return '정상';
        case '1': return '이상';
        default: return value || '정보 없음';
      }
    
    case 'basic':
    default: // 기본 정상/비정상
      switch (value) {
        case '0': return '정상';
        case '1': return '비정상';
        case '2': return '알 수 없음';
        default: return value || '정보 없음';
      }
  }
};

// 상태별 색상 클래스
const getStatusColor = (status: IOStatus, type: 'basic' | 'onoff' | 'operation' | 'shutter' | 'fire' | 'elevator' | 'escalator' | 'remoteLocal' | 'normalError' | 'waterLevel' = 'basic'): string => {
  const value = status.ioValue;
  
  switch (type) {
    case 'onoff': // 조명 On/Off
      switch (value) {
        case '0': return 'text-gray-500'; // OFF
        case '1': return 'text-green-500'; // ON
        default: return 'text-gray-400';
      }
    
    case 'operation': // 운전상태
      switch (value) {
        case '0': return 'text-gray-500'; // 정지
        case '1': return 'text-blue-500'; // 운행중
        default: return 'text-gray-400';
      }
    
    case 'shutter': // 셔터
      switch (value) {
        case '1': return 'text-gray-500'; // 정지
        case '2': return 'text-blue-500'; // 상승
        case '3': return 'text-orange-500'; // 하강
        default: return 'text-gray-400';
      }
    
    case 'fire': // 화재감지
      switch (value) {
        case '0': return 'text-green-500'; // 정상
        case '1': return 'text-red-600'; // 화재발생
        default: return 'text-gray-400';
      }
    
    case 'elevator':
    case 'escalator': // 엘리베이터/에스컬레이터
      switch (value) {
        case '0': return 'text-gray-500'; // 정지
        case '1': return 'text-blue-500'; // 운행중
        case '2': return 'text-red-500'; // 장애
        default: return 'text-gray-400';
      }
    
    case 'remoteLocal': // 원격/로컬
      switch (value) {
        case '0': return 'text-orange-500'; // 로컬
        case '1': return 'text-blue-500'; // 원격
        default: return 'text-gray-400';
      }
    
    case 'normalError': // 정상/장애
      switch (value) {
        case '0': return 'text-green-500'; // 정상
        case '1': return 'text-red-500'; // 장애
        default: return 'text-gray-400';
      }
    
    case 'waterLevel': // 수위 상태
      switch (value) {
        case '0': return 'text-green-500'; // 정상
        case '1': return 'text-yellow-500'; // 이상
        default: return 'text-gray-400';
      }
    
    case 'basic':
    default: // 기본
      switch (value) {
        case '0': return 'text-green-500'; // 정상
        case '1': return 'text-red-500'; // 비정상
        case '2': return 'text-yellow-500'; // 알 수 없음
        default: return 'text-gray-400';
      }
  }
};

// 펌프 정보 컴포넌트
const PumpInfo: React.FC<{ pump: Pump; index: number }> = ({ pump, index }) => (
  <div className="bg-gray-50 p-3 rounded space-y-2">
    <h5 className="font-medium text-gray-800">펌프 {index + 1}: {pump.pumpName}</h5>
    <div className="grid grid-cols-2 gap-2 text-sm">
      <div className="flex justify-between">
        <span>상태:</span>
        <span className={getStatusColor(pump.status, 'operation')}>
          {getStatusText(pump.status, 'operation')}
        </span>
      </div>
      <div className="flex justify-between">
        <span>오류:</span>
        <span className={getStatusColor(pump.error, 'normalError')}>
          {getStatusText(pump.error, 'normalError')}
        </span>
      </div>
      {pump.remoteSetting && (
        <div className="flex justify-between">
          <span>원격설정:</span>
          <span className={getStatusColor(pump.remoteSetting, 'remoteLocal')}>
            {getStatusText(pump.remoteSetting, 'remoteLocal')}
          </span>
        </div>
      )}
      {pump.operationTime && (
        <div className="flex justify-between">
          <span>가동시간:</span>
          <span>{pump.operationTime.ioValue}시간</span>
        </div>
      )}
    </div>
  </div>
);

// 공통 정보 컴포넌트
const CommonInfo: React.FC<{ device: DeviceData }> = ({ device }) => (
  <div className="mb-6 space-y-2">
    <div className="flex justify-between">
      <span className="font-medium text-gray-700">장비명:</span>
      <span className="text-gray-900">{getDeviceName(device)}</span>
    </div>
    <div className="flex justify-between">
      <span className="font-medium text-gray-700">수집시간:</span>
      <span className="text-gray-900">{device.collectedTime || '정보 없음'}</span>
    </div>
    <div className="flex justify-between">
      <span className="font-medium text-gray-700">역사:</span>
      <span className="text-gray-900">{getStationName(device)}</span>
    </div>
  </div>
);

// 장비별 이름 추출
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

// 장비별 역사명 추출
const getStationName = (device: DeviceData): string => {
  if ('stationName' in device) return device.stationName || '정보 없음';
  return '정보 없음';
};

// 조명 상세 정보
const LightDetails: React.FC<{ device: Light }> = ({ device }) => (
  <div className="space-y-3">
    <h4 className="font-semibold text-gray-800 border-b pb-2">조명 상태</h4>
    <div className="flex justify-between">
      <span>동작 상태:</span>
      <span className={getStatusColor(device.status, 'onoff')}>
        {getStatusText(device.status, 'onoff')}
      </span>
    </div>
    <div className="flex justify-between">
      <span>제어 위치:</span>
      <span className={getStatusColor(device.controlPosition, 'remoteLocal')}>
        {getStatusText(device.controlPosition, 'remoteLocal')}
      </span>
    </div>
    <div className="flex justify-between">
      <span>순서:</span>
      <span>{device.orderingSequence}</span>
    </div>
  </div>
);

// 셔터 상세 정보
const ShutterDetails: React.FC<{ device: Shutter }> = ({ device }) => (
  <div className="space-y-3">
    <h4 className="font-semibold text-gray-800 border-b pb-2">셔터 상태</h4>
    <div className="flex justify-between">
      <span>동작 상태:</span>
      <span className={getStatusColor(device.status, 'shutter')}>
        {getStatusText(device.status, 'shutter')}
      </span>
    </div>
    {device.cctvList && device.cctvList.length > 0 && (
      <div>
        <span className="font-medium">연관 CCTV:</span>
        <div className="mt-1 space-y-1">
          {device.cctvList.map((cctv, index) => (
            <div key={index} className="text-sm text-gray-600 ml-4">
              • {cctv.cctvName}
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

// 화재수신기 상세 정보
const FireSensorDetails: React.FC<{ device: FireSensor }> = ({ device }) => (
  <div className="space-y-3">
    <h4 className="font-semibold text-gray-800 border-b pb-2">화재수신기 상태</h4>
    <div className="flex justify-between">
      <span>감지 상태:</span>
      <span className={getStatusColor(device.status, 'fire')}>
        {getStatusText(device.status, 'fire')}
      </span>
    </div>
  </div>
);

// 엘리베이터 상세 정보
const ElevatorDetails: React.FC<{ device: Elevator }> = ({ device }) => (
  <div className="space-y-3">
    <h4 className="font-semibold text-gray-800 border-b pb-2">엘리베이터 상태</h4>
    <div className="flex justify-between">
      <span>동작 상태:</span>
      <span className={getStatusColor(device.status, 'elevator')}>
        {getStatusText(device.status, 'elevator')}
      </span>
    </div>
    {device.downMoveStatus && (
      <div className="flex justify-between">
        <span>하강 상태:</span>
        <span className={getStatusColor(device.downMoveStatus, 'operation')}>
          {getStatusText(device.downMoveStatus, 'operation')}
        </span>
      </div>
    )}
    <div className="flex justify-between">
      <span>오류 상태:</span>
      <span className={getStatusColor(device.error, 'normalError')}>
        {getStatusText(device.error, 'normalError')}
      </span>
    </div>
    {device.pumps && device.pumps.length > 0 && (
      <div>
        <span className="font-medium">펌프 상태:</span>
        <div className="mt-1 space-y-2">
          {device.pumps.map((pump, index) => (
            <PumpInfo key={`${pump.pumpName}-${index}`} pump={pump} index={index} />
          ))}
        </div>
      </div>
    )}
  </div>
);

// 에스컬레이터 상세 정보
const EscalatorDetails: React.FC<{ device: Escalator }> = ({ device }) => (
  <div className="space-y-3">
    <h4 className="font-semibold text-gray-800 border-b pb-2">에스컬레이터 상태</h4>
    <div className="flex justify-between">
      <span>동작 상태:</span>
      <span className={getStatusColor(device.status, 'escalator')}>
        {getStatusText(device.status, 'escalator')}
      </span>
    </div>
    <div className="flex justify-between">
      <span>오류 상태:</span>
      <span className={getStatusColor(device.error, 'normalError')}>
        {getStatusText(device.error, 'normalError')}
      </span>
    </div>
  </div>
);

// 물탱크 상세 정보
const WaterTankDetails: React.FC<{ device: WaterTank }> = ({ device }) => (
  <div className="space-y-3">
    <h4 className="font-semibold text-gray-800 border-b pb-2">물탱크 상태</h4>
    <div className="flex justify-between">
      <span>수압:</span>
      <span className="text-blue-600">{device.waterPressure.ioValue || '정보 없음'}</span>
    </div>
    <div className="flex justify-between">
      <span>수위:</span>
      <span className="text-blue-600">{device.waterLevel.ioValue || '정보 없음'}</span>
    </div>
    <div className="flex justify-between">
      <span>저수위 상태:</span>
      <span className={getStatusColor(device.lowWaterLevelStatus, 'waterLevel')}>
        {getStatusText(device.lowWaterLevelStatus, 'waterLevel')}
      </span>
    </div>
    <div className="flex justify-between">
      <span>고수위 상태:</span>
      <span className={getStatusColor(device.highWaterLevelStatus, 'waterLevel')}>
        {getStatusText(device.highWaterLevelStatus, 'waterLevel')}
      </span>
    </div>
    <div className="flex justify-between">
      <span>만수위 상태:</span>
      <span className={getStatusColor(device.fullWaterLevelStatus, 'waterLevel')}>
        {getStatusText(device.fullWaterLevelStatus, 'waterLevel')}
      </span>
    </div>
    {device.pumps && device.pumps.length > 0 && (
      <div>
        <span className="font-medium">펌프 상태:</span>
        <div className="mt-1 space-y-2">
          {device.pumps.map((pump, index) => (
            <PumpInfo key={`${pump.pumpName}-${index}`} pump={pump} index={index} />
          ))}
        </div>
      </div>
    )}
  </div>
);

// 집수정 상세 정보
const CatchpitDetails: React.FC<{ device: Catchpit }> = ({ device }) => (
  <div className="space-y-3">
    <h4 className="font-semibold text-gray-800 border-b pb-2">집수정 상태</h4>
    <div className="flex justify-between">
      <span>수위:</span>
      <span className="text-blue-600">{device.waterLevel.ioValue || '정보 없음'}</span>
    </div>
    <div className="flex justify-between">
      <span>저수위 상태:</span>
      <span className={getStatusColor(device.lowWaterLevelStatus, 'waterLevel')}>
        {getStatusText(device.lowWaterLevelStatus, 'waterLevel')}
      </span>
    </div>
    <div className="flex justify-between">
      <span>고수위 상태:</span>
      <span className={getStatusColor(device.highWaterLevelStatus, 'waterLevel')}>
        {getStatusText(device.highWaterLevelStatus, 'waterLevel')}
      </span>
    </div>
    <div className="flex justify-between">
      <span>만수위 상태:</span>
      <span className={getStatusColor(device.fullWaterLevelStatus, 'waterLevel')}>
        {getStatusText(device.fullWaterLevelStatus, 'waterLevel')}
      </span>
    </div>
    {device.pumps && device.pumps.length > 0 && (
      <div>
        <span className="font-medium">펌프 상태:</span>
        <div className="mt-1 space-y-2">
          {device.pumps.map((pump, index) => (
            <PumpInfo key={`${pump.pumpName}-${index}`} pump={pump} index={index} />
          ))}
        </div>
      </div>
    )}
  </div>
);

// 공기청정기 상세 정보
const AirPurifierDetails: React.FC<{ device: AirPurifier }> = ({ device }) => (
  <div className="space-y-3">
    <h4 className="font-semibold text-gray-800 border-b pb-2">공기청정기 상태</h4>
    <div className="flex justify-between">
      <span>동작 상태:</span>
      <span className={getStatusColor(device.status, 'operation')}>
        {getStatusText(device.status, 'operation')}
      </span>
    </div>
    <div className="flex justify-between">
      <span>오류 상태:</span>
      <span className={getStatusColor(device.error, 'normalError')}>
        {getStatusText(device.error, 'normalError')}
      </span>
    </div>
    <div className="flex justify-between">
      <span>통신 상태:</span>
      <span className={getStatusColor(device.communicationFailure, 'normalError')}>
        {getStatusText(device.communicationFailure, 'normalError')}
      </span>
    </div>
  </div>
);

export const DeviceDetailModal = ({
  isOpen,
  onClose,
  deviceType,
  stationId,
  deviceCode,
}: DeviceDetailProps) => {
  const [deviceData, setDeviceData] = useState<DeviceData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !deviceCode) {
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
            const lightsResult = await nfluxService.getLights(stationId);
            data = lightsResult.lights.find(item =>
              item.lightId === deviceCode
            ) || null;
            break;
          }

          case 'shutter':
          case 'shutters': {
            const shuttersResult = await nfluxService.getShutters(stationId);
            data = shuttersResult.shutters.find(item =>
              item.shutterId === deviceCode
            ) || null;
            break;
          }

          case 'fire-sensor':
          case 'fire-sensors': {
            const fireSensorsResult = await nfluxService.getFireSensors(stationId);
            data = fireSensorsResult['fire-sensors'].find(item =>
              item.fireSensorId === deviceCode
            ) || null;
            break;
          }

          case 'elevator':
          case 'elevators': {
            const elevatorsResult = await nfluxService.getElevators(stationId);
            data = elevatorsResult.elevators.find(item =>
              item.elevatorId === deviceCode
            ) || null;
            break;
          }

          case 'escalator':
          case 'escalators': {
            const escalatorsResult = await nfluxService.getEscalators(stationId);
            data = escalatorsResult.escalators.find(item =>
              item.escalatorId === deviceCode
            ) || null;
            break;
          }

          case 'watertank':
          case 'watertanks': {
            const waterTanksResult = await nfluxService.getWaterTanks(stationId);
            data = waterTanksResult.waterTanks.find(item =>
              item.waterTankId === deviceCode
            ) || null;
            break;
          }

          case 'catchpit':
          case 'catchpits': {
            const catchpitsResult = await nfluxService.getCatchpits(stationId);
            data = catchpitsResult.catchpits.find(item =>
              item.catchpitId === deviceCode
            ) || null;
            break;
          }

          case 'airpurifier':
          case 'airpurifiers': {
            const airPurifiersResult = await nfluxService.getAirPurifiers(stationId);
            data = airPurifiersResult.airPurifiers.find(item =>
              item.airPurifierId === deviceCode
            ) || null;
            break;
          }
          default:
            throw new Error(`지원하지 않는 장비 타입: ${deviceType}`);
        }        if (!data) {
          throw new Error(`장비를 찾을 수 없습니다: ${deviceCode}`);
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
  }, [isOpen, deviceCode, deviceType, stationId]);

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
      title={`${deviceCode} 상세정보`}
    >
      <div className="max-h-96 overflow-y-auto">
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="text-gray-500">장비 정보를 불러오는 중...</div>
          </div>
        )}
        
        {error && (
          <div className="text-red-500 text-center py-4">
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
