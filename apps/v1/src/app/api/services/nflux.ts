// NFlux Platform API 서비스
import { nfluxApiClient } from '../clients/nflux';
import type {
  Station,
  CCTV,
  WindGauge,
  StationEnv,
  StationEvents,
  Light,
  LightGroup,
  Shutter,
  ShutterGroup,
  FireSensor,
  Elevator,
  Escalator,
  WaterTank,
  Catchpit,
  AirPurifier,
  AlarmCurrentStat,
  AlarmTodayStat,
  Alarm,
  AlarmQueryParams,
  ControlRequest,
  ControlResponse
} from '../types/nflux';

export const nfluxService = {
  // === 맵 대시보드 메인 ===
  // 역사 정보 조회
  getStations: async (lineNo: string = '1'): Promise<{ stations: Station[] }> => {
    return nfluxApiClient.get(`poi/map/${lineNo}/stations`).json();
  },

  // 재난감시 CCTV 정보
  getMapCCTV: async (lineNo: string = '1'): Promise<{ cctv: CCTV[] }> => {
    return nfluxApiClient.get(`poi/map/${lineNo}/cctv`).json();
  },

  // 풍향풍속 정보
  getWindGauge: async (lineNo: string = '1'): Promise<{ 'wind-gauge': WindGauge }> => {
    return nfluxApiClient.get(`poi/map/${lineNo}/wind-gauge`).json();
  },

  // === 맵 대시보드 역사 ===
  // 역사 환경정보
  getStationEnv: async (stationId: string): Promise<{ stationEnv: StationEnv & { stationId: string; fcltsType: string } }> => {
    return nfluxApiClient.get(`poi/station/${stationId}/env`).json();
  },

  // 역사 이벤트 현황
  getStationEvents: async (stationId: string): Promise<{ events: StationEvents }> => {
    return nfluxApiClient.get(`poi/station/${stationId}/events`).json();
  },

  // 조명 정보
  getStationLights: async (stationId: string): Promise<{ lights: Light[] }> => {
    return nfluxApiClient.get(`poi/station/${stationId}/lights`).json();
  },

  // 셔터 정보
  getStationShutters: async (stationId: string): Promise<{ shutters: Shutter[] }> => {
    return nfluxApiClient.get(`poi/station/${stationId}/shutters`).json();
  },

  // 역사 CCTV 정보
  getStationCCTV: async (stationId: string): Promise<{ cctv: CCTV[] }> => {
    return nfluxApiClient.get(`poi/station/${stationId}/cctv`).json();
  },

  // 화재수신기 정보
  getFireSensors: async (stationId: string): Promise<{ 'fire-sensors': FireSensor[] }> => {
    return nfluxApiClient.get(`poi/station/${stationId}/fire-sensors`).json();
  },

  // 엘리베이터 정보
  getElevators: async (stationId: string): Promise<{ elevators: Elevator[] }> => {
    return nfluxApiClient.get(`poi/station/${stationId}/elevators`).json();
  },

  // 에스컬레이터 정보
  getEscalators: async (stationId: string): Promise<{ escalators: Escalator[] }> => {
    return nfluxApiClient.get(`poi/station/${stationId}/escalators`).json();
  },

  // 물탱크 정보
  getWaterTanks: async (stationId: string): Promise<{ waterTanks: WaterTank[] }> => {
    return nfluxApiClient.get(`poi/station/${stationId}/waterTanks`).json();
  },

  // 집수정 정보
  getCatchpits: async (stationId: string): Promise<{ catchpits: Catchpit[] }> => {
    return nfluxApiClient.get(`poi/station/${stationId}/catchpits`).json();
  },

  // 공기청정기 정보
  getAirPurifiers: async (stationId: string): Promise<{ airPurifiers: AirPurifier[] }> => {
    return nfluxApiClient.get(`poi/station/${stationId}/airPurifiers`).json();
  },

  // === 정보 대시보드 - 위젯 ===
  // 역사 위젯
  getStationWidget: async (stationId: string): Promise<{ stationEnv: StationEnv & { stationId: string; stationName: string; fcltsType: string; collectedTime: string } }> => {
    return nfluxApiClient.get(`poi/widget/station/${stationId}`).json();
  },

  // 풍향풍속계 위젯
  getWindGaugeWidget: async (gaugeId: string): Promise<{ 'wind-gauge': WindGauge }> => {
    return nfluxApiClient.get(`poi/widget/wind-gauge/${gaugeId}`).json();
  },

  // 조명 제어반(개소) 조회
  getLights: async (stationId: string): Promise<{ lights: Light[] }> => {
    return nfluxApiClient.get(`poi/widget/lights/${stationId}`).json();
  },

  // 조명 제어반(그룹) 조회
  getLightGroups: async (stationId: string): Promise<{ lightGroups: LightGroup[] }> => {
    return nfluxApiClient.get(`poi/widget/lightGroups/${stationId}`).json();
  },

  // 셔터 제어반(개소 목록) 조회
  getShutters: async (stationId: string): Promise<{ shutters: Shutter[] }> => {
    return nfluxApiClient.get(`poi/widget/shutters/${stationId}`).json();
  },

  // 셔터 제어반(그룹) 조회
  getShutterGroups: async (stationId: string): Promise<{ shutterGroups: ShutterGroup[] }> => {
    return nfluxApiClient.get(`poi/widget/shutterGroups/${stationId}`).json();
  },

  // CCTV 위젯
  getCCTVWidget: async (cctvId: string): Promise<CCTV & { stationId: string; stationName: string }> => {
    return nfluxApiClient.get(`poi/widget/cctv/${cctvId}`).json();
  },

  // 엘리베이터 정보
  getElevatorWidget: async (elevatorId: string): Promise<Elevator> => {
    return nfluxApiClient.get(`poi/widget/elevator/${elevatorId}`).json();
  },

  // 에스컬레이터 정보
  getEscalatorWidget: async (escalatorId: string): Promise<Escalator> => {
    return nfluxApiClient.get(`poi/widget/escalator/${escalatorId}`).json();
  },

  // 물탱크 정보
  getWaterTankWidget: async (waterTankId: string): Promise<WaterTank> => {
    return nfluxApiClient.get(`poi/widget/waterTank/${waterTankId}`).json();
  },

  // 집수정 정보
  getCatchpitWidget: async (catchpitId: string): Promise<Catchpit> => {
    return nfluxApiClient.get(`poi/widget/catchpit/${catchpitId}`).json();
  },

  // 공기청정기 정보
  getAirPurifierWidget: async (airPurifierId: string): Promise<AirPurifier> => {
    return nfluxApiClient.get(`poi/widget/airPurifier/${airPurifierId}`).json();
  },

  // 장애모니터링 위젯 - 실시간 현황
  getAlarmCurrentStat: async (stationId: string): Promise<{ current: AlarmCurrentStat }> => {
    return nfluxApiClient.get(`poi/widget/alarms/${stationId}/current-stat`).json();
  },

  // 장애모니터링 위젯 - 일일장애집계
  getAlarmTodayStat: async (stationId: string): Promise<{ current: AlarmTodayStat }> => {
    return nfluxApiClient.get(`poi/widget/alarms/${stationId}/today-stat`).json();
  },

  // 장애모니터링 위젯 - 전체
  getAlarms: async (stationId: string, params?: AlarmQueryParams): Promise<{ alarms: Alarm[] }> => {
    const searchParams = new URLSearchParams();
    if (params?.fcltsType) searchParams.set('fcltsType', params.fcltsType);
    if (params?.grade) searchParams.set('grade', params.grade);
    if (params?.dayFrom) searchParams.set('dayFrom', params.dayFrom);
    if (params?.dayTo) searchParams.set('dayTo', params.dayTo);
    if (params?.keyword) searchParams.set('keyword', params.keyword);
    
    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return nfluxApiClient.get(`poi/widget/alarms/${stationId}${query}`).json();
  },

  // === 모바일 ===
  // 모바일 역사정보
  getMobileStations: async (lineNo: string = '1'): Promise<{ stations: Station[] }> => {
    return nfluxApiClient.get(`poi/map/${lineNo}/stations`).json();
  },

  // 모바일 조명 제어반(그룹) 조회
  getMobileLightGroups: async (stationId: string): Promise<{ lightGroups: LightGroup[] }> => {
    return nfluxApiClient.get(`poi/widget/lightGroups/${stationId}`).json();
  },

  // 모바일 조명 제어반(개소 목록) 조회
  getMobileLights: async (lightGroupId: string): Promise<{ lights: Light[] }> => {
    return nfluxApiClient.get(`mobile/api/lights/${lightGroupId}`).json();
  },

  // 모바일 셔터 제어반(그룹, 개소별) 조회
  getMobileShutterGroups: async (stationId: string): Promise<{ shutterGroups: ShutterGroup[] }> => {
    return nfluxApiClient.get(`poi/widget/shutterGroups/${stationId}`).json();
  },

  // === 제어 기능 ===
  // 조명 제어
  controlLights: async (request: ControlRequest): Promise<ControlResponse> => {
    return nfluxApiClient.post('poi/widget/lights/control', { json: request }).json();
  },

  // 셔터 제어
  controlShutters: async (request: ControlRequest): Promise<ControlResponse> => {
    return nfluxApiClient.post('poi/widget/shutters/control', { json: request }).json();
  },

  // 셔터 그룹 자동개폐 설정
  controlShutterSchedule: async (request: { cmd: 'ENABLE' | 'DISABLE'; fcltsId: string }): Promise<ControlResponse> => {
    return nfluxApiClient.post('poi/widget/shutterGroup/scheduleSetting', { json: request }).json();
  }
};