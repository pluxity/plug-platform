import React, { useState } from "react";
import { MultiSelect } from "@plug/ui";
import { Input } from "@plug/ui";
import { StationInfo, useLinesSWR } from "@plug/common-services";
import { FacilityFormItem } from "../../components/FacilityFormComponent";

const DeleteIcon = ({ onClick }: { onClick?: (e: React.MouseEvent) => void }) => (
  <div data-property-1="delete" className="w-3.5 h-3.5 relative cursor-pointer" onClick={onClick}>
    <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="7" cy="7.5" r="5" fill="#C7DDFD"/>
      <path d="M8.74264 5L9.44975 5.70711L5.20711 9.94975L4.5 9.24264L8.74264 5Z" fill="#9CA8BA"/>
      <path d="M9.44975 9.24264L8.74264 9.94975L4.5 5.70711L5.20711 5L9.44975 9.24264Z" fill="#9CA8BA"/>
    </svg>
  </div>
);

interface StationInfoProps {
  stationInfo?: Partial<StationInfo>;
  onStationCodesChange?: (codes: string[]) => void;
  onLineIdsChange?: (lineIds: number[]) => void;
}

export const StationInfoSection: React.FC<StationInfoProps> = ({ stationInfo = { stationCodes: [], lineIds: [] }, onStationCodesChange, onLineIdsChange }) => {
  const { data: lines } = useLinesSWR();
  const [inputValue, setInputValue] = useState("");

  const stationCodes = stationInfo?.stationCodes || [];
  const lineIds = stationInfo?.lineIds || [];

  const handleAddCode = () => {
    if (!inputValue.trim()) return;

    const newCode = inputValue.trim();
    if (!stationCodes.includes(newCode)) {
      const newCodes = [...stationCodes, newCode];
      if (onStationCodesChange) {
        onStationCodesChange(newCodes);
      }
    }
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCode();
    }
  };

  const handleRemoveCode = (codeToRemove: string) => {
    const newCodes = stationCodes.filter(code => code !== codeToRemove);
    if (onStationCodesChange) {
      onStationCodesChange(newCodes);
    }
  };

  return (
    <>
      <div className="col-span-2 p-4 bg-gray-50 flex items-center gap-2 border-b">
        <div className="w-1 h-6 bg-blue-600"></div>
        <h3 className="text-lg font-medium">역사 코드 입력</h3>
      </div>
      <FacilityFormItem label="역사 코드">
        <div className="space-y-2">
          <div className="flex">
            <Input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="역사 코드를 입력하고 엔터키를 누르세요"
              className="flex-1"
            />
            <button type="button" onClick={handleAddCode} className="ml-2 px-3 py-1 bg-blue-600 text-white rounded-sm">
              추가
            </button>
          </div>

          {stationCodes.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {stationCodes.map((code, index) => (
                <div key={index} className="px-[5px] py-1 bg-blue-50 inline-flex justify-center items-center gap-[3px]">
                  <div className="justify-start text-zinc-700 text-xs font-medium">{code}</div>
                  <DeleteIcon onClick={() => handleRemoveCode(code)} />
                </div>
              ))}
            </div>
          )}
        </div>
      </FacilityFormItem>

      <FacilityFormItem label="호선 정보" className="border-b h-full">
        <MultiSelect
          options={
            lines?.map((line) => ({
              label: line.name,
              value: String(line.id),
            })) || []
          }
          value={lineIds.map((id) => String(id))}
          onChange={(values) => {
            if (onLineIdsChange) {
              onLineIdsChange(values.map(v => parseInt(v)));
            }
          }}
          placeholder="호선을 선택하세요"
          className="flex-1"
        />
      </FacilityFormItem>
    </>
  );
};