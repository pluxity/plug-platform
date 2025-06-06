export interface TrainData {
  messageNumber: number;
  opCode: string;
  time: string;
  arrivalStationName: string;
  trainDirection: string;
  thisTrainNumber: string;
  nextTrainNumber: string,
  lineNumber?: string;
}
