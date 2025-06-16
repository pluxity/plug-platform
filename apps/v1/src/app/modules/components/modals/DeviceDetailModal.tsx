import React, { useState, useEffect } from 'react';
import { Button, Modal } from '@plug/ui';
import { nfluxService, nfluxWidgetService } from '@plug/v1/app/api';
import type { Light, Shutter, CCTV, FireSensor, Elevator, Escalator, WaterTank, Catchpit, AirPurifier, IOStatus, Pump, LightGroup, ShutterGroup } from '@plug/v1/app/api/types/nflux';

type DeviceData = Light | Shutter | CCTV | FireSensor | Elevator | Escalator | WaterTank | Catchpit | AirPurifier | LightGroup | ShutterGroup;
type StatusType = 'onoff' | 'operation' | 'shutter' | 'fire' | 'elevator' | 'vl_up' | 'vl_down' |  'escalator' | 'remoteLocal' | 'normalError' | 'waterLevel' | 'value';

export interface DeviceDetailProps {
  isOpen: boolean;
  onClose: () => void;
  deviceType: string;
  stationId: string;
  deviceId: string | null;
}
const STATUS_TEXT_MAP: Record<StatusType, Record<string, string>> = {
  onoff: { '0': 'OFF', '1': 'ON' },
  operation: { '0': '정지', '1': '운행중' },
  shutter: { '1': '정지', '2': '상승', '3': '하강' },
  fire: { '0': '정상', '1': '화재발생' },
  elevator: { '0': '정지', '1': '운행중', '2': '장애' },
  vl_up: { '0': '정지', '1': '상승중' },
  vl_down: { '0': '정지', '1': '하강중' },
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
  vl_up: { '0': 'text-gray-500', '1': 'text-blue-500' },
  vl_down: { '0': 'text-gray-500', '1': 'text-blue-500' },
  escalator: { '0': 'text-gray-500', '1': 'text-blue-500', '2': 'text-red-500' },
  remoteLocal: { '0': 'text-orange-500', '1': 'text-blue-500' },
  normalError: { '0': 'text-green-500', '1': 'text-red-500' },
  waterLevel: { '0': 'text-green-500', '1': 'text-yellow-500' },
  value: { default: 'text-blue-600' },
};

const getStatusText = (status: IOStatus, type: StatusType = 'normalError'): string => {
  const value = status?.ioValue;
  return STATUS_TEXT_MAP[type][value] || value || '정보 없음';
};

const getStatusColor = (status: IOStatus, type: StatusType = 'normalError'): string => {
  const value = status?.ioValue;
  return STATUS_COLOR_MAP[type][value] || STATUS_COLOR_MAP[type].default || 'text-gray-400';
};

const getDeviceName = (device: DeviceData): string => {
  if ('lightName' in device) return device.lightName;
  if ('shutterName' in device) return device.shutterName;
  if ('cctvName' in device) return device.cctvName;
  if ('fireSensorName' in device) return device.fireSensorName;
  if ('elevatorName' in device) return device.elevatorName;
  if ('escalatorName' in device) return device.escalatorName;
  if ('waterTankName' in device) return device.waterTankName;
  if ('catchpitName' in device) return device.catchpitName;
  if ('airPurifierName' in device) return device.airPurifierName;
  if ('lightGroupName' in device) return device.lightGroupName;
  if ('shutterGroupName' in device) return device.shutterGroupName;
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
    <div className={`px-3 py-1 rounded-full ${getStatusColor(status, type)} ${getGlowColor(status, type)}/20 border border-current/30 bg-black/20 backdrop-blur-sm text-xs font-medium flex items-center gap-2 shadow-lg`}>
      <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      {getStatusText(status, type)}
    </div>
  );
};

const StatusRow = ({ label, status, type = 'normalError', suffix = '' }: { 
  label: string;
  status: IOStatus;
  type?: StatusType;
  suffix?: string;
}) => (
  <div className="relative group flex justify-between items-center bg-primary-950/40 hover:bg-primary-900/40 backdrop-blur-md rounded-lg px-4 py-3 border border-primary-700/20 hover:border-primary-600/30 transition-all duration-200">
    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    <span className="text-primary-200 text-sm font-medium">{label}</span>
    <div className="flex items-center gap-3">
      {type === 'value' ? (
        <span className="text-primary-100 font-medium tabular-nums">
          {status?.ioValue}{suffix}
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
             className="relative overflow-hidden bg-gray-800/40 rounded-lg p-4 border border-gray-500/30" >
          <div className="relative">
            <h5 className="font-medium text-primary-100 pb-3 mb-4 border-b border-gray-300/30 flex items-center gap-2">
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

const CommonInfo = ({ device }: { device: DeviceData }) => (
  <div className="bg-gray-800/40 rounded-lg p-4 border border-gray-500/30 space-y-4 mb-6">
    <div className="grid gap-3">
      {[
        { label: "장비명", value: getDeviceName(device) },
        { label: "수집시간", value: device.collectedTime ?? '정보 없음' },
        { label: "역사", value: getStationName(device) }
      ].map(({ label, value }, index) => (        <div key={index} className="group relative bg-primary-900/30 hover:bg-primary-900/40 rounded-lg px-4 py-3 border border-primary-700/20 transition-all duration-200">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative flex justify-between items-center">
            <span className="text-primary-300 font-medium">{label}</span>
            <span className="text-primary-100 font-semibold">{value}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const CctvStream = ({ cctv, className }: { cctv: CCTV; className?: string }) => (
  <div className={`bg-primary-950/40 rounded-lg border border-primary-700/30 ${className}`}>
    <div className="p-3 border-b border-primary-700/30">
      <div className="flex items-center justify-between">
        <span className="text-primary-100 font-medium">{cctv.cctvName}</span>
        <span className="text-xs text-primary-400">{cctv.cctvId}</span>
      </div>
    </div>
    <div className="p-3">
      <div className="aspect-video bg-gray-900 rounded border border-gray-700/50">
        <iframe 
          src={`http://192.168.4.29:8888/${cctv.cctvId.replace(/[()]/g, '_')}`} 
          className="w-full h-full rounded"
          title={`CCTV ${cctv.cctvName}`}
          allowFullScreen
        />
      </div>
    </div>
  </div>
);

const LightDetails = ({ device }: { device: Light }) => (
  <div className="rounded-lg bg-gray-800/40 border border-gray-500/30 p-4">
    <h4 className="text-primary-100 font-medium flex items-center gap-2 mb-4">
      <svg className="w-4 h-4 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
      <span className="font-medium text-primary-100">조명 상태</span>
    </h4>
    <div className="space-y-3">
      <StatusRow label="동작 상태" status={device.status} type="onoff" />
      <StatusRow label="제어 위치" status={device.controlPosition} type="remoteLocal" />      <div className="group relative bg-primary-900/30 hover:bg-primary-900/40 rounded-lg px-4 py-3 border border-primary-700/20 transition-all duration-200">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative flex justify-between items-center">
          <span className="text-primary-300 font-medium">순서</span>
          <span className="text-primary-100 font-semibold">{device.orderingSequence}</span>
        </div>
      </div>
    </div>
  </div>
);

const ShutterDetails = ({ device }: { device: Shutter }) => (
  <div className="bg-gray-800/40 rounded-lg p-4 border border-gray-500/30">
    <h4 className="text-primary-100 font-medium flex items-center gap-2 mb-4">
      <svg className="w-5 h-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M19 9l-7 7-7-7M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2zM8 12h8" />
      </svg>
      <span className="font-medium text-primary-100">셔터 상태</span>
    </h4>
    <div className="bg-orange-950/20 rounded-lg p-4 border border-orange-500/20">
      <div className="bg-primary-900/30 rounded-lg p-3 border border-primary-700/20">
        <div className="flex items-center gap-2 mb-2 text-orange-300">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
          동작 정보
        </div>
        <StatusRow label="동작 상태" status={device.status} type="shutter" />
      </div>
    </div>
  </div>
);

const FireSensorDetails = ({ device }: { device: FireSensor }) => (
  <div className="space-y-4">
    <h4 className="text-primary-100 font-medium flex items-center gap-2">
      <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
      </svg>
      화재수신기 상태
    </h4>
    <div className="bg-gray-800/40 rounded-lg p-4 border border-gray-500/30">
      <div className="flex items-center gap-2 mb-2 text-red-300">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        감지 상태 정보
      </div>
      <div className="relative">
        <div className="absolute -left-1 top-0 bottom-0 w-[2px] bg-gradient-to-b from-red-500/50 via-red-500/20 to-transparent" />
        <StatusRow label="감지 상태" status={device.status} type="fire" />
      </div>
    </div>
  </div>
);

const ElevatorDetails = ({ device }: { device: Elevator }) => (
  <div className="space-y-4">
    <h4 className="text-primary-100 font-medium flex items-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
           className="w-5 h-5 text-blue-400">
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <path d="M15 3v18"/>
      </svg>
      엘리베이터 상태
    </h4>
    <div className="space-y-4">
      <div className="bg-gray-800/40 rounded-lg p-4 border border-gray-500/30">
        <div className="grid gap-3">
          {device.downMoveStatus ? (
            <>
              <StatusRow label="상승 상태" status={device.status} type="vl_up" />
              <StatusRow label="하강 상태" status={device.downMoveStatus} type="vl_down" />
            </>
          ) : (
            <StatusRow label="동작 상태" status={device.status} type="elevator" />
          )}
          <StatusRow label="장애 상태" status={device.error} type="normalError" />
        </div>
      </div>

      {device.pumps && device.pumps.length > 0 && <PumpList pumps={device.pumps} />}
    </div>
  </div>
);

const EscalatorDetails = ({ device }: { device: Escalator }) => (
  <div className="space-y-4">
    <h4 className="text-primary-100 font-medium flex items-center gap-2">
      <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2zm0 4h18M9 3v2m6-2v2M9 19v2m6-2v2" />
      </svg>
      에스컬레이터 상태
    </h4>
    <div className="bg-gray-800/40 rounded-lg p-4 border border-gray-500/30">
      <div className="grid gap-3">
        <StatusRow label="운행 상태" status={device.status} type="escalator" />
        <StatusRow label="장애 상태" status={device.error} type="normalError" />
      </div>
    </div>
  </div>
);

const WaterTankDetails = ({ device }: { device: WaterTank }) => (
  <div className="space-y-4">
    <h4 className="text-primary-100 font-medium flex items-center gap-2">
      <svg className="w-5 h-5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
      물탱크 상태
    </h4>
    <div className="grid gap-4">
      <div className="bg-gray-800/40 rounded-lg p-4 border border-gray-500/30">
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-primary-900/30 rounded-lg p-3 border border-primary-700/20">
              <div className="flex items-center gap-2 mb-2 text-primary-300">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
                </svg>
                수압
              </div>
              <StatusRow label="수압 값" status={device.waterPressure} type="value" />
            </div>
            <div className="bg-primary-900/30 rounded-lg p-3 border border-primary-700/20">
              <div className="flex items-center gap-2 mb-2 text-primary-300">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
                </svg>
                수위
              </div>
              <StatusRow label="수위 값" status={device.waterLevel} type="value" />
            </div>
          </div>
          <div className="bg-primary-900/30 rounded-lg p-3 border border-primary-700/20">
            <div className="grid gap-3">
              <StatusRow label="저수위 상태" status={device.lowWaterLevelStatus} type="waterLevel" />
              <StatusRow label="고수위 상태" status={device.highWaterLevelStatus} type="waterLevel" />
              <StatusRow label="만수위 상태" status={device.fullWaterLevelStatus} type="waterLevel" />
            </div>
            <div className="bg-gray-800/40 rounded-lg p-4 border border-gray-500/30">
              <div className="flex items-center gap-2 mb-3 text-blue-300">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                현재 수위 상태
              </div>
              <div className="h-50 bg-primary-950/80 rounded-lg border border-primary-700/30 relative overflow-hidden">

                <div
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-500/40 to-blue-500/20 transition-all duration-500"
                  style={{
                    height: device.waterLevel?.ioValue ? `${device.waterLevel.ioValue}%` : '35%',
                  }}
                >
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-blue-400/40 shadow-lg shadow-blue-400/30" />
                </div>
                <div className="absolute top-0 left-0 right-0 border-t border-dashed border-blue-400/30 flex justify-end"
                    style={{ top: `${100 - Number(device.fullWaterLevelSetting.ioValue)}%` }}>
                  <div className="bg-primary-950 text-blue-300 text-xs px-2 py-0.5 rounded-md mr-2">만수위</div>
                </div>
                <div className="absolute top-0 left-0 right-0 border-t border-dashed border-blue-400/30 flex justify-end"
                    style={{ top: `${100 - Number(device.highWaterLevelSetting.ioValue)}%` }}>
                  <div className="bg-primary-950 text-blue-300 text-xs px-2 py-0.5 rounded-md mr-2">고수위</div>
                </div>
                <div className="absolute top-0 left-0 right-0 border-t border-dashed border-blue-400/30 flex justify-end"
                    style={{ top: `${100 - Number(device.lowWaterLevelSetting.ioValue)}%` }}>
                  <div className="bg-primary-950 text-blue-300 text-xs px-2 py-0.5 rounded-md mr-2">저수위</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {device.pumps && device.pumps.length > 0 && <PumpList pumps={device.pumps} />}
    </div>
  </div>
);

const CatchpitDetails = ({ device }: { device: Catchpit }) => (
  <div className="rounded-lg bg-primary-950/40 border border-primary-700/30 p-4">
    <h4 className="text-primary-100 font-medium flex items-center gap-2">
      <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
      <span className="font-medium text-primary-100">집수정 상태</span>
    </h4>
    <div className="grid gap-3 mt-4">
      <div className="relative">
        <StatusRow label="저수위 상태" status={device.lowWaterLevelStatus} type="waterLevel" />
      </div>
      <div className="relative">
        <StatusRow label="고수위 상태" status={device.highWaterLevelStatus} type="waterLevel" />
      </div>
      <div className="relative">
        <StatusRow label="만수위 상태" status={device.fullWaterLevelStatus} type="waterLevel" />
      </div>
      <div className="bg-gray-800/40 rounded-lg p-4 border border-gray-500/30">
        <div className="flex items-center gap-2 mb-3 text-blue-300">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          현재 수위 상태
        </div>
        <div className="h-50 bg-primary-950/80 rounded-lg border border-primary-700/30 relative overflow-hidden">

          <div
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-500/40 to-blue-500/20 transition-all duration-500"
            style={{
              height: device.waterLevel?.ioValue ? `${device.waterLevel.ioValue}%` : '35%',
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-blue-400/40 shadow-lg shadow-blue-400/30" />
          </div>
          <div className="absolute top-0 left-0 right-0 border-t border-dashed border-blue-400/30 flex justify-end"
               style={{ top: `${100 - Number(device.fullWaterLevelSetting.ioValue)}%` }}>
            <div className="bg-primary-950 text-blue-300 text-xs px-2 py-0.5 rounded-md mr-2">만수위</div>
          </div>
          <div className="absolute top-0 left-0 right-0 border-t border-dashed border-blue-400/30 flex justify-end"
               style={{ top: `${100 - Number(device.highWaterLevelSetting.ioValue)}%` }}>
            <div className="bg-primary-950 text-blue-300 text-xs px-2 py-0.5 rounded-md mr-2">고수위</div>
          </div>
          <div className="absolute top-0 left-0 right-0 border-t border-dashed border-blue-400/30 flex justify-end"
               style={{ top: `${100 - Number(device.lowWaterLevelSetting.ioValue)}%` }}>
            <div className="bg-primary-950 text-blue-300 text-xs px-2 py-0.5 rounded-md mr-2">저수위</div>
          </div>
        </div>
      </div>
      {device.pumps && device.pumps.length > 0 && <PumpList pumps={device.pumps} />}
    </div>
  </div>
);

const AirPurifierDetails = ({ device }: { device: AirPurifier }) => (
  <div className="space-y-4">
    <h4 className="text-primary-100 font-medium flex items-center gap-2">
      <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      공기청정기 상태
    </h4>
    <div className="bg-gray-800/40 rounded-lg p-4 border border-gray-500/30">
      <div className="grid gap-4">
        <div className="bg-primary-900/30 rounded-lg p-3 border border-primary-700/20">
          <div className="flex items-center gap-2 mb-2 text-green-300">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
            동작 정보
          </div>
          <StatusRow label="동작 상태" status={device.status} type="operation" />
        </div>
        <div className="bg-primary-900/30 rounded-lg p-3 border border-primary-700/20">
          <div className="flex items-center gap-2 mb-2 text-green-300">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            상태 정보
          </div>
          <div className="grid gap-3">
            <StatusRow label="장애 상태" status={device.error} type="normalError" />
            <StatusRow label="통신 상태" status={device.communicationFailure} type="normalError" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

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
            data = result.find(item => item.lightId === deviceId) || null;
            break;
          }
          case 'cctv':
          case 'cctvs': {
            const result = await nfluxService.getCCTV(stationId);
            data = result.find((item: CCTV) => item.cctvId === deviceId) || null;
            break;
          }
          case 'shutter':
          case 'shutters': {
            const result = await nfluxService.getShutters(stationId);
            data = result.find(item => item.shutterId === deviceId) || null;
            break;
          }
          case 'fire-sensor':
          case 'fire-sensors': {
            const result = await nfluxService.getFireSensors(stationId);
            data = result.find(item => item.fireSensorId === deviceId) || null;
            break;
          }
          case 'elevator':
          case 'elevators': {
            const result = await nfluxService.getElevators(stationId);
            data = result.find(item => item.elevatorId === deviceId) || null;
            break;
          }
          case 'escalator':
          case 'escalators': {
            const result = await nfluxService.getEscalators(stationId);
            data = result.find(item => item.escalatorId === deviceId) || null;
            break;
          }
          case 'watertank':
          case 'watertanks': {
            const result = await nfluxService.getWaterTanks(stationId);
            data = result.find(item => item.waterTankId === deviceId) || null;
            break;
          }
          case 'catchpit':
          case 'catchpits': {
            const result = await nfluxService.getCatchpits(stationId);
            data = result.find(item => item.catchpitId === deviceId) || null;
            break;
          }          case 'airpurifier':
          case 'airpurifiers': {
            const result = await nfluxService.getAirPurifiers(stationId);
            data = result.find(item => item.airPurifierId === deviceId) || null;
            break;
          }
          case 'lightgroup':
          case 'lightgroups': {
            const result = await nfluxWidgetService.getLightGroups(stationId);
            data = result.find(item => item.lightGroupId === deviceId) || null;
            break;
          }
          case 'shuttergroup':
          case 'shuttergroups': {
            const result = await nfluxWidgetService.getShutterGroups(stationId);
            data = result.find(item => item.shutterGroupId === deviceId) || null;
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
  const { deviceData, loading, error } = useDeviceData(isOpen, deviceId, deviceType, stationId);  const getCctvList = (): CCTV[] => {
    if (!deviceData) return [];
    
    if ('cctvList' in deviceData && deviceData.cctvList) {
      return deviceData.cctvList.map(cctv => {
        if ('streamAddress' in cctv && 'cctvId' in cctv && 'cctvName' in cctv) {
          return {
            cctvId: cctv.cctvId,
            cctvName: cctv.cctvName,
            streamAddress: cctv.streamAddress,
            fcltsType: 'cctv',
            cctvAngle: '0',
            location: { xValue: 0, yValue: 0 }
          } as CCTV;
        }
        return cctv as CCTV;
      });
    }
    
    return [];
  };

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
        return <CatchpitDetails device={deviceData as Catchpit} />;      case 'airpurifier':
      case 'airpurifiers':
        return <AirPurifierDetails device={deviceData as AirPurifier} />;
      case 'lightgroup':
      case 'lightgroups':
        return <LightGroupDetails device={deviceData as LightGroup} />;
      case 'shuttergroup':
      case 'shuttergroups':
        return <ShutterGroupDetails device={deviceData as ShutterGroup} />;
      case 'cctv':
      case 'cctvs':
        return <CctvStream cctv={deviceData as CCTV} />;
      default:
        return <div>지원하지 않는 장비 타입입니다.</div>;
    }
  };

  const cctvList = getCctvList();
  const hasCctvs = cctvList.length > 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closable={false}
      width={"100%"}
      title={
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
          <span className="text-primary-100">{deviceId} 상세정보</span>
          {hasCctvs && (
            <span className="text-primary-400 text-sm">
              (CCTV {cctvList.length}개)
            </span>
          )}
        </div>
      }      
      contentClassName={`
        !bg-primary-900/30 backdrop-blur-xl
        border border-primary-600/20
        shadow-2xl shadow-primary-500/10
        ${hasCctvs ? '!max-w-7xl !w-[95vw]' : '!max-w-xl !w-[50vw]'}
      `}
      headerClassName="!bg-transparent !border-b !border-primary-600/20 !px-6 !py-4"
      bodyClassName="!bg-transparent !px-6 !py-4  overflow-y-auto scrollbar-thin scrollbar-thumb-primary-400/30 scrollbar-track-primary-600/20"
      footer={        
        <Button
          variant="outline"
          onClick={onClose}
          className="text-primary-100 border-primary-400/30 hover:bg-primary-400/10 hover:border-primary-400/50 transition-all duration-200"
        >
          닫기
        </Button>
      }
    >
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
        <div className="text-red-500/90 text-center py-4 bg-red-900/40 border border-red-500/20 rounded-lg backdrop-blur-xl shadow-lg">
          {error}
        </div>
      )}      {deviceData && !loading && !error && (
        <>
          {(deviceType.toLowerCase() === 'cctv' || deviceType.toLowerCase() === 'cctvs') ? (
            <div className="flex items-center justify-center">
              <div className="w-full max-w-4xl">
                <CctvStream cctv={deviceData as CCTV} />
              </div>
            </div>
          ) : (
            hasCctvs ? (
            <div className="flex gap-6 h-[60vh]">
                <div className="flex-1 space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-primary-400/30 scrollbar-track-primary-600/20">
                  <h3 className="text-primary-100 font-medium flex items-center gap-2 sticky top-0 bg-primary-900/50 backdrop-blur-sm py-2 rounded-lg px-3">
                    <svg className="w-4 h-4 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    CCTV 영상
                  </h3>
                  {cctvList.map((cctv, index) => {
                    const shouldShowOnLeft = cctvList.length === 1 || index % 2 === 0;
                    if (!shouldShowOnLeft) return null;
                    
                    return (
                      <CctvStream 
                        key={`left-${index}`} 
                        cctv={cctv}
                        className="mb-4"
                      />
                    );
                  })}
                </div>

                <div className="flex-1">
                  <div className="top-0 bg-primary-900/50 backdrop-blur-sm py-2 rounded-lg px-3 mb-4">
                    <h3 className="text-primary-100 font-medium flex items-center gap-2">
                      <svg className="w-4 h-4 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      장비 정보
                    </h3>
                  </div>
                  <CommonInfo device={deviceData} />
                  {renderDeviceDetails()}
                </div>

                {cctvList.length > 1 && (
                  <div className="flex-1 space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-primary-400/30 scrollbar-track-primary-600/20">
                    <h3 className="text-primary-100 font-medium flex items-center gap-2 sticky top-0 bg-primary-900/50 backdrop-blur-sm py-2 rounded-lg px-3">
                      <svg className="w-4 h-4 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      CCTV 영상
                    </h3>
                    {cctvList.map((cctv, index) => {
                      const shouldShowOnRight = index % 2 === 1;
                      if (!shouldShowOnRight) return null;
                      
                      return (
                        <CctvStream 
                          key={`right-${index}`} 
                          cctv={cctv}
                          className="mb-4"
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <div className="min-h-[50vh] max-h-[75vh] overflow-y-auto scrollbar-thin scrollbar-thumb-primary-400/30 scrollbar-track-primary-600/20">
                <CommonInfo device={deviceData} />
                {renderDeviceDetails()}
              </div>
            )
          )}
        </>
      )}
    </Modal>
  );
};

const LightGroupDetails = ({ device }: { device: LightGroup }) => (
  <div className="space-y-4">
    <h4 className="text-primary-100 font-medium flex items-center gap-2">
      <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
      조명 그룹 상태
    </h4>
    <div className="bg-gray-800/40 rounded-lg p-4 border border-gray-500/30">
      <div className="grid gap-4">
        <div className="bg-primary-900/30 rounded-lg p-3 border border-primary-700/20">
          <div className="flex items-center gap-2 mb-2 text-yellow-300">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            그룹 제어 정보
          </div>
          <div className="grid grid-cols-2 gap-3">
            <StatusRow label="동작 상태" status={device.status} type="onoff" />
            <StatusRow label="제어 위치" status={device.controlPosition} type="remoteLocal" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ShutterGroupDetails = ({ device }: { device: ShutterGroup }) => (
  <div className="space-y-4">
    <h4 className="text-primary-100 font-medium flex items-center gap-2">
      <svg className="w-5 h-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M19 9l-7 7-7-7M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
      셔터 그룹 상태
    </h4>
    <div className="bg-gray-800/40 rounded-lg p-4 border border-gray-500/30 space-y-4">
      <div className="bg-primary-900/30 rounded-lg p-3 border border-primary-700/20">
        <div className="flex items-center gap-2 mb-2 text-orange-300">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          스케줄 설정
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-primary-950/40 rounded-lg px-3 py-2">
            <span className="text-primary-200 text-sm">자동개폐</span>
            <div className="text-primary-100 font-medium">
              {device.scheduleSetting === '1' ? '설정중' : '없음'}
            </div>
          </div>
          {device.scheduleSetting === '1' && (
            <div className="bg-primary-950/40 rounded-lg px-3 py-2">
              <span className="text-primary-200 text-sm">예약시간</span>
              <div className="text-primary-100 font-medium text-xs">
                ON: {device.scheduleTime.on} / OFF: {device.scheduleTime.off}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {device.shutterList && device.shutterList.length > 0 && (
        <div className="bg-primary-900/30 rounded-lg p-3 border border-primary-700/20">
          <div className="flex items-center gap-2 mb-3 text-orange-300">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            그룹 내 셔터 목록 ({device.shutterList.length}개)
          </div>
          <div className="space-y-2 max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-primary-400/30 scrollbar-track-primary-600/20">
            {device.shutterList.map((shutter, index) => (
              <div key={`${shutter.shutterId}-${index}`} 
                   className="bg-primary-950/40 rounded-lg px-3 py-2 border border-primary-700/10">
                <div className="flex justify-between items-center">
                  <span className="text-primary-100 text-sm font-medium">{shutter.shutterName}</span>
                  <StatusBadge status={shutter.status} type="shutter" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);
