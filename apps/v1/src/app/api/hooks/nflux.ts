// NFlux API용 React 훅들
import { useState, useEffect } from 'react';
import { nfluxService } from '../services/nflux';
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
  Elevator,
  Escalator,
  WaterTank,
  Catchpit,
  AirPurifier,
  AlarmCurrentStat,
  AlarmTodayStat,
  Alarm,
  AlarmQueryParams
} from '../types/nflux';

// 공통 훅 타입
interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// === 맵 대시보드 메인 ===
export const useStations = (lineNo: string = '1'): UseApiResult<Station[]> => {
  const [data, setData] = useState<Station[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await nfluxService.getStations(lineNo);
      setData(result.stations);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [lineNo]);

  return { data, loading, error, refetch: fetchData };
};

export const useMapCCTV = (lineNo: string = '1'): UseApiResult<CCTV[]> => {
  const [data, setData] = useState<CCTV[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await nfluxService.getMapCCTV(lineNo);
      setData(result.cctv);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [lineNo]);

  return { data, loading, error, refetch: fetchData };
};

export const useWindGauge = (lineNo: string = '1'): UseApiResult<WindGauge> => {
  const [data, setData] = useState<WindGauge | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await nfluxService.getWindGauge(lineNo);
      setData(result['wind-gauge']);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // 5분마다 업데이트
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [lineNo]);

  return { data, loading, error, refetch: fetchData };
};

// === 역사 환경 정보 ===
export const useStationEnv = (stationId: string): UseApiResult<StationEnv & { stationId: string; fcltsType: string }> => {
  const [data, setData] = useState<StationEnv & { stationId: string; fcltsType: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!stationId) return;
    
    try {
      setLoading(true);
      const result = await nfluxService.getStationEnv(stationId);
      setData(result.stationEnv);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // 1분마다 업데이트
    const interval = setInterval(fetchData, 60 * 1000);
    return () => clearInterval(interval);
  }, [stationId]);

  return { data, loading, error, refetch: fetchData };
};

// === 역사 이벤트 정보 ===
export const useStationEvents = (stationId: string): UseApiResult<StationEvents> => {
  const [data, setData] = useState<StationEvents | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!stationId) return;
    
    try {
      setLoading(true);
      const result = await nfluxService.getStationEvents(stationId);
      setData(result.events);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // 10초마다 업데이트
    const interval = setInterval(fetchData, 10 * 1000);
    return () => clearInterval(interval);
  }, [stationId]);

  return { data, loading, error, refetch: fetchData };
};

// === 조명 관련 ===
export const useLights = (stationId: string): UseApiResult<Light[]> => {
  const [data, setData] = useState<Light[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!stationId) return;
    
    try {
      setLoading(true);
      const result = await nfluxService.getLights(stationId);
      setData(result.lights);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // 30초마다 업데이트
    const interval = setInterval(fetchData, 30 * 1000);
    return () => clearInterval(interval);
  }, [stationId]);

  return { data, loading, error, refetch: fetchData };
};

export const useLightGroups = (stationId: string): UseApiResult<LightGroup[]> => {
  const [data, setData] = useState<LightGroup[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!stationId) return;
    
    try {
      setLoading(true);
      const result = await nfluxService.getLightGroups(stationId);
      setData(result.lightGroups);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // 30초마다 업데이트
    const interval = setInterval(fetchData, 30 * 1000);
    return () => clearInterval(interval);
  }, [stationId]);

  return { data, loading, error, refetch: fetchData };
};

// === 셔터 관련 ===
export const useShutters = (stationId: string): UseApiResult<Shutter[]> => {
  const [data, setData] = useState<Shutter[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!stationId) return;
    
    try {
      setLoading(true);
      const result = await nfluxService.getShutters(stationId);
      setData(result.shutters);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // 30초마다 업데이트
    const interval = setInterval(fetchData, 30 * 1000);
    return () => clearInterval(interval);
  }, [stationId]);

  return { data, loading, error, refetch: fetchData };
};

export const useShutterGroups = (stationId: string): UseApiResult<ShutterGroup[]> => {
  const [data, setData] = useState<ShutterGroup[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!stationId) return;
    
    try {
      setLoading(true);
      const result = await nfluxService.getShutterGroups(stationId);
      setData(result.shutterGroups);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // 30초마다 업데이트
    const interval = setInterval(fetchData, 30 * 1000);
    return () => clearInterval(interval);
  }, [stationId]);

  return { data, loading, error, refetch: fetchData };
};

// === 기계 설비 관련 ===
export const useElevators = (stationId: string): UseApiResult<Elevator[]> => {
  const [data, setData] = useState<Elevator[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!stationId) return;
    
    try {
      setLoading(true);
      const result = await nfluxService.getElevators(stationId);
      setData(result.elevators);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // 1분마다 업데이트
    const interval = setInterval(fetchData, 60 * 1000);
    return () => clearInterval(interval);
  }, [stationId]);

  return { data, loading, error, refetch: fetchData };
};

export const useEscalators = (stationId: string): UseApiResult<Escalator[]> => {
  const [data, setData] = useState<Escalator[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!stationId) return;
    
    try {
      setLoading(true);
      const result = await nfluxService.getEscalators(stationId);
      setData(result.escalators);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // 1분마다 업데이트
    const interval = setInterval(fetchData, 60 * 1000);
    return () => clearInterval(interval);
  }, [stationId]);

  return { data, loading, error, refetch: fetchData };
};

export const useWaterTanks = (stationId: string): UseApiResult<WaterTank[]> => {
  const [data, setData] = useState<WaterTank[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!stationId) return;
    
    try {
      setLoading(true);
      const result = await nfluxService.getWaterTanks(stationId);
      setData(result.waterTanks);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // 5분마다 업데이트
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [stationId]);

  return { data, loading, error, refetch: fetchData };
};

export const useCatchpits = (stationId: string): UseApiResult<Catchpit[]> => {
  const [data, setData] = useState<Catchpit[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!stationId) return;
    
    try {
      setLoading(true);
      const result = await nfluxService.getCatchpits(stationId);
      setData(result.catchpits);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // 5분마다 업데이트
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [stationId]);

  return { data, loading, error, refetch: fetchData };
};

export const useAirPurifiers = (stationId: string): UseApiResult<AirPurifier[]> => {
  const [data, setData] = useState<AirPurifier[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!stationId) return;
    
    try {
      setLoading(true);
      const result = await nfluxService.getAirPurifiers(stationId);
      setData(result.airPurifiers);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // 2분마다 업데이트
    const interval = setInterval(fetchData, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, [stationId]);

  return { data, loading, error, refetch: fetchData };
};

// === 알람 관련 ===
export const useAlarmCurrentStat = (stationId: string): UseApiResult<AlarmCurrentStat> => {
  const [data, setData] = useState<AlarmCurrentStat | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!stationId) return;
    
    try {
      setLoading(true);
      const result = await nfluxService.getAlarmCurrentStat(stationId);
      setData(result.current);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // 30초마다 업데이트
    const interval = setInterval(fetchData, 30 * 1000);
    return () => clearInterval(interval);
  }, [stationId]);

  return { data, loading, error, refetch: fetchData };
};

export const useAlarmTodayStat = (stationId: string): UseApiResult<AlarmTodayStat> => {
  const [data, setData] = useState<AlarmTodayStat | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!stationId) return;
    
    try {
      setLoading(true);
      const result = await nfluxService.getAlarmTodayStat(stationId);
      setData(result.current);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [stationId]);

  return { data, loading, error, refetch: fetchData };
};

export const useAlarms = (stationId: string, params?: AlarmQueryParams): UseApiResult<Alarm[]> => {
  const [data, setData] = useState<Alarm[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!stationId) return;
    
    try {
      setLoading(true);
      const result = await nfluxService.getAlarms(stationId, params);
      setData(result.alarms);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [stationId, JSON.stringify(params)]);

  return { data, loading, error, refetch: fetchData };
};

// === 단일 위젯 조회 훅들 ===
export const useElevatorWidget = (elevatorId: string): UseApiResult<Elevator> => {
  const [data, setData] = useState<Elevator | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!elevatorId) return;
    
    try {
      setLoading(true);
      const result = await nfluxService.getElevatorWidget(elevatorId);
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // 1분마다 업데이트
    const interval = setInterval(fetchData, 60 * 1000);
    return () => clearInterval(interval);
  }, [elevatorId]);

  return { data, loading, error, refetch: fetchData };
};

export const useWaterTankWidget = (waterTankId: string): UseApiResult<WaterTank> => {
  const [data, setData] = useState<WaterTank | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!waterTankId) return;
    
    try {
      setLoading(true);
      const result = await nfluxService.getWaterTankWidget(waterTankId);
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // 5분마다 업데이트
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [waterTankId]);

  return { data, loading, error, refetch: fetchData };
};
