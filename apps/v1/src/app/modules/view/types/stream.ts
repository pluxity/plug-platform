export interface TrainData {
  opCode: string;
  time: {
    year: string;
    month: string;
    day: string;
    hour: string;
    minute: string;
    second: string;
  };
  arrivalStationName: string;
  trainDirection: string;
  thisTrainNumber: string;
  lineNumber?: string;
}
