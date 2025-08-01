import React, { useState } from "react";
import { MultiSelect } from "@plug/ui";
import { Input } from "@plug/ui";
import { Floor, useLinesSWR } from "@plug/common-services";
import { FacilityFormItem } from "../FacilityFormField";
import { FacilityData, FacilityFormMode, hasStationInfo } from "../../../types/facilityTypeGuard";

const DeleteIcon = ({ onClick }: { onClick?: (e: React.MouseEvent) => void }) => (
  <div data-property-1="delete" className="w-3.5 h-3.5 relative cursor-pointer" onClick={onClick}>
    <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="7" cy="7.5" r="5" fill="#C7DDFD"/>
      <path d="M8.74264 5L9.44975 5.70711L5.20711 9.94975L4.5 9.24264L8.74264 5Z" fill="#9CA8BA"/>
      <path d="M9.44975 9.24264L8.74264 9.94975L4.5 5.70711L5.20711 5L9.44975 9.24264Z" fill="#9CA8BA"/>
    </svg>
  </div>
);

interface StationInfoSectionProps {
  data: FacilityData;
  handlers: {
    onStationCodesChange?: (codes: string[]) => void;
    onLineIdsChange?: (lineIds: number[]) => void;
    onFloorsChange?: (floors: Floor[]) => void;
  };
  disabled: boolean;
  mode: FacilityFormMode;
}

export const StationInfoSection: React.FC<StationInfoSectionProps> = ({ data, handlers, disabled, mode }) => {
  const { data: lines } = useLinesSWR();
  const [inputValue, setInputValue] = useState("");
  const stationInfo = hasStationInfo(data)
    ? data.stationInfo
    : { stationCodes: [], lineIds: [] };
  const stationCodes = stationInfo?.stationCodes || [];
  const lineIds = stationInfo?.lineIds || [];

  const isViewMode = mode === 'detail';
  const isEditMode = mode === 'edit';
  const isCreateMode = mode === 'create';
  const isInputEnabled = (isEditMode || isCreateMode) && !disabled;

  const handleAddCode = () => {
    if (!inputValue.trim() || !isInputEnabled) return;

    const newCode = inputValue.trim();
    if (!stationCodes.includes(newCode)) {
      const newCodes = [...stationCodes, newCode];
      if (handlers.onStationCodesChange) {
        handlers.onStationCodesChange(newCodes);
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
    if (!isInputEnabled) return;

    const newCodes = stationCodes.filter((code: string) => code !== codeToRemove);
    if (handlers.onStationCodesChange) {
      handlers.onStationCodesChange(newCodes);
    }
  };

  return (
    <>
      <div className="col-span-3 p-4 bg-gray-50 flex items-center gap-2 border-b">
        <div className="w-1 h-6 bg-blue-600"></div>
        <h3 className="text-lg font-medium">역사 코드 입력</h3>
      </div>
      <FacilityFormItem label="호선 정보" className="border-b">
        {isViewMode ? (
          <div className="space-y-2">
            {lineIds.length > 0 ? (
              <div className="flex flex-wrap gap-1 mt-2">
                {lineIds.map((id:number, index: number) => {
                  const lineName = lines?.find(line => line.id === id)?.name || `호선 ID: ${id}`;
                  return (
                    <div key={index} className="px-3 py-1.5 bg-gray-100 rounded inline-flex items-center">
                      <div className="text-zinc-700 text-sm">{lineName}</div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-gray-500">등록된 호선 정보가 없습니다.</div>
            )}
          </div>
        ) : (
          <MultiSelect
            options={
              lines?.map((line) => ({
                label: line.name,
                value: String(line.id),
              })) || []
            }
            value={lineIds.map((id:number) => String(id))}
            onChange={(values) => {
              if (handlers.onLineIdsChange && isInputEnabled) {
                handlers.onLineIdsChange(values.map(v => parseInt(v)));
              }
            }}
            placeholder="호선을 선택하세요"
            className="flex-1"
            disabled={!isInputEnabled}
          />
        )}
      </FacilityFormItem>
      <FacilityFormItem label="역사 코드" className='border-b col-span-2'>
        {isViewMode ? (
          <div className="space-y-2">
            {stationCodes.length > 0 ? (
              <div className="flex flex-wrap gap-1 mt-2">
                {stationCodes.map((code: string, index: number) => (
                  <div key={index} className="px-3 py-1.5 bg-gray-100 rounded inline-flex items-center">
                    <div className="text-zinc-700 text-sm">{code}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500">등록된 역사 코드가 없습니다.</div>
            )}
          </div>
        ) : (
          <div className="space-y-2 flex gap-2 items-center justify-center">
            <div className="flex mb-0">
              <Input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="역사 코드를 입력하고 엔터키를 누르세요"
                className="flex-1"
                disabled={!isInputEnabled}
              />
              <button
                type="button"
                onClick={handleAddCode}
                className={`ml-2 px-3 py-1 ${!isInputEnabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white `}
                disabled={!isInputEnabled}
              >
                추가
              </button>
            </div>

            {stationCodes.length > 0 && (
              <div className="flex flex-wrap gap-1 items-center justify-center">
                <p className='text-gray-500'>추가된 코드: </p>
                {stationCodes.map((code: string, index: number) => (
                  <div key={index} className="px-[5px] py-1 bg-blue-50 inline-flex justify-center items-center gap-[3px]">
                    <div className="justify-start text-zinc-700 text-xs font-medium">{code}</div>
                    {isInputEnabled && <DeleteIcon onClick={() => handleRemoveCode(code)} />}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </FacilityFormItem>
    </>
  );
};