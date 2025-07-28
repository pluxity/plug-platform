import React from "react";
import { Button, MultiSelect } from "@plug/ui";
import { Input } from "@plug/ui";
import { ModalFormItem } from "@plug/ui";
import { useLinesSWR } from "@plug/common-services";

interface StationInfoProps {
  stationCodes: string[];
  lineIds: number[];
  onStationCodesChange: (codes: string[]) => void;
  onLineIdsChange: (lineIds: number[]) => void;
}

export const StationInfoSection: React.FC<StationInfoProps> = ({ stationCodes, lineIds, onStationCodesChange, onLineIdsChange }) => {
  const { data: lines } = useLinesSWR();

  return (
    <>
      <div className="col-span-2 p-4 bg-gray-50 flex items-center gap-2 border-b">
        <div className="w-1 h-6 bg-blue-600"></div>
        <h3 className="text-lg font-medium">역사 코드 입력</h3>
      </div>
      <ModalFormItem label="역사 코드">
        <div className="space-y-2">
          {stationCodes?.map((code, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                type="text"
                value={code}
                onChange={(e) => {
                  const newCodes = [...stationCodes];
                  newCodes[index] = e.target.value;
                  onStationCodesChange(newCodes);
                }}
                placeholder={`역사 코드 ${index + 1}`}
                className="flex-1"
                required
              />
              <Button
                type="button"
                onClick={() => {
                  const newCodes = [...stationCodes];
                  newCodes.splice(index, 1);
                  onStationCodesChange(newCodes);
                }}
                className="px-2 py-1"
              >
                삭제
              </Button>
            </div>
          ))}
          <Button
            type="button"
            onClick={() => {
              onStationCodesChange([...stationCodes, '']);
            }}
            className="mt-2"
          >
            코드 추가
          </Button>
        </div>
      </ModalFormItem>

      <ModalFormItem label="호선 정보" className="border-b h-full">
        <MultiSelect
          options={lines?.map((line) => ({
            label: line.name,
            value: String(line.id),
          })) || []}
          value={lineIds.map(id => String(id))}
          onChange={(value: string[]) => {
            onLineIdsChange(value.map((v) => parseInt(v)));
          }}
        />
      </ModalFormItem>
    </>
  );
};