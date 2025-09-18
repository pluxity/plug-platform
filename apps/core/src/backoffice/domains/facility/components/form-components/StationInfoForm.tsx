import React, { useState, useMemo, useEffect } from 'react';
import { Input, Button, MultiSelect, DeleteIcon } from "@plug/ui";
import { useLinesSWR } from '@plug/common-services';
import { StationInfoFormProps } from '../../types';

export const StationInfoForm: React.FC<StationInfoFormProps> = ({
                                                                  errors,
                                                                  setValue,
                                                                  watch,
                                                                }) => {
  const [stationCode, setStationCode] = useState('');
  const [stationCodes, setStationCodes] = useState<string[]>([]);
  const { data: linesData } = useLinesSWR();
  const currentLineIds = watch?.('stationInfo.lineIds') || [];

  useEffect(() => {
    const currentStationCodes = watch?.('stationInfo.stationCodes') || [];
    setStationCodes(currentStationCodes);
  }, [watch]);

  const lineOptions = useMemo(() => {
    return (
      linesData?.map((line) => ({
        label: line.name,
        value: line.id.toString(),
      })) || []
    );
  }, [linesData]);

  const handleLineIdsChange = (selectedValues: string[]) => {
    const lineIds = selectedValues.map(Number);
    setValue('stationInfo.lineIds', lineIds);
  };

  const addStationCode = () => {
    const trimmedCode = stationCode.trim();
    if (trimmedCode && !stationCodes.includes(trimmedCode)) {
      const newCodes = [...stationCodes, trimmedCode];
      setStationCodes(newCodes);
      setValue('stationInfo.stationCodes', newCodes);
      setStationCode('');
    }
  };

  const removeStationCode = (codeToRemove: string) => {
    const newCodes = stationCodes.filter((code) => code !== codeToRemove);
    setStationCodes(newCodes);
    setValue('stationInfo.stationCodes', newCodes);
  };

  return (
    <div className="space-y-4" data-testid="station-info-form">
      <div
        className="text-2xl font-bold text-gray-700"
        data-testid="facility-form-title"
      >
        역사 정보
      </div>
      <div className="space-y-6 border rounded-lg p-6 h-80 overflow-y-auto scrollbar-thin">
        <div>
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center">
              <div className="w-0.5 h-5 rounded-full bg-primary-600 inline-block mr-3" />
              <label className="block font-bold">역사 코드</label>
            </div>
          </div>

          <div className="flex gap-2">
            <Input
              value={stationCode}
              onChange={(e) => setStationCode(e.target.value)}
              placeholder="역 코드를 입력하세요 (예: 201, 강남)"
              className="flex-1"
            />
            <Button
              type="button"
              onClick={addStationCode}
              className="whitespace-nowrap"
            >
              코드 추가
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            {stationCodes.map((code, index) => (
              <div
                key={index}
                className="px-1.5 py-1 bg-primary-200 inline-flex justify-center rounded-sm items-center gap-1"
              >
                <div className="justify-start text-zinc-700 text-xs font-medium font-['SUIT']">
                  {code}
                </div>
                <DeleteIcon
                  onClick={() => removeStationCode(code)}
                />
              </div>
            ))}
          </div>

          {errors.stationInfo?.stationCodes && (
            <p className="text-red-500 text-sm mt-1">
              유효한 역 코드를 입력해주세요.
            </p>
          )}
        </div>

        <div>
          <div className="flex items-center mb-3">
            <div className="w-0.5 h-5 rounded-full bg-primary-600 inline-block mr-3" />
            <label className="block font-bold">호선</label>
          </div>
          <MultiSelect
            value={currentLineIds.map(String)}
            onChange={handleLineIdsChange}
            options={lineOptions}
            placeholder="노선을 선택하세요"
          />
          {errors.stationInfo?.lineIds && (
            <p className="text-red-500 text-sm mt-1">노선을 선택해주세요.</p>
          )}
        </div>
      </div>
    </div>
  );
};