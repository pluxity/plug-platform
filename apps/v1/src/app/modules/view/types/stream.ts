type OpCode = '열차 접근' | '출발' | '도착';

export interface TrainData {
  messageNumber: number;
  opCode: OpCode;
  arrivalStationCode: string;
  arrivalStationName: string;
  trainDirection: string;
  thisTrainNumber: string;
  nextTrainNumber: string;
  timestamp: string;
  line: string;
}

export interface EventData {
  // TODO: Event 데이터 구조 정의
  id: string;
  message: string;
  level: string;
}

export interface ShutterData {
  // TODO: Shutter 데이터 구조 정의
  id: string;
  status: {
    ioId: string;
    ioValue: string;
  }
}
