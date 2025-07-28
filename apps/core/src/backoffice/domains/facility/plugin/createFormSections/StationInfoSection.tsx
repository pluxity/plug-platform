import React from "react";
import { MultiSelect } from "@plug/ui";
import { Input } from "@plug/ui";
import { ModalFormItem } from "@plug/ui";
import { StationInfo, useLinesSWR } from "@plug/common-services";

interface StationInfoProps {
  stationInfo?: Partial<StationInfo>;
  onStationCodesChange?: (codes: string[]) => void;
  onLineIdsChange?: (lineIds: number[]) => void;
}

export const StationInfoSection: React.FC<StationInfoProps> = ({ stationInfo = { stationCodes: [], lineIds: [] }, onStationCodesChange, onLineIdsChange
}) => {
  const { data: lines } = useLinesSWR();

  const stationCodes = stationInfo?.stationCodes || [];
  const lineIds = stationInfo?.lineIds || [];

  return (
    <>
      <div className="col-span-2 p-4 bg-gray-50 flex items-center gap-2 border-b">
        <div className="w-1 h-6 bg-blue-600"></div>
        <h3 className="text-lg font-medium">역사 코드 입력</h3>
      </div>
      <ModalFormItem label="역사 코드">
        <div className="space-y-2">
          <Input
            type="text"
            value={stationCodes.join(",")}
            onChange={(e) => {
              const newCodes = e.target.value
                .split(",")
                .map((code) => code.trim())
                .filter(code => code !== ""); // 빈 코드 제거
              if (onStationCodesChange) {
                onStationCodesChange(newCodes);
              }
            }}
            placeholder="역사 코드를 입력하세요 (쉼표로 구분)"
            className="flex-1"
            required
          />
        </div>
      </ModalFormItem>

      <ModalFormItem label="호선 정보" className="border-b h-full">
        <MultiSelect
          options={
            lines?.map((line) => ({
              label: line.name,
              value: String(line.id),
            })) || []
          }
          value={lineIds.map((id) => String(id))}
          onChange={(value: string[]) => {
            if (onLineIdsChange) {
              onLineIdsChange(value.map((v) => parseInt(v)));
            }
          }}
        />
      </ModalFormItem>
    </>
  );
};