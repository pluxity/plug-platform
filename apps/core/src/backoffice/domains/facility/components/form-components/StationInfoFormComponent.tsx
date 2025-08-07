import React, { useState, useMemo } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Input,
  Button,
  MultiSelect,
} from '@plug/ui';
import { Plus, Trash2 } from 'lucide-react';
import { useLinesSWR } from '@plug/common-services';
import { StationInfoFormComponentProps } from '../../types';

export const StationInfoFormComponent: React.FC<StationInfoFormComponentProps> = ({
  errors,
  setValue,
  watch,
}) => {
  const [stationCodes, setStationCodes] = useState<string[]>(['']);
  
  // 노선 목록 조회
  const { data: linesData } = useLinesSWR();
  
  // 현재 선택된 노선 ID들 가져오기
  const watchedLineIds = watch?.('stationInfo.lineIds') || [];

  // 노선 옵션 생성
  const lineOptions = useMemo(() => {
    return linesData?.map(line => ({
      label: line.name,
      value: line.id.toString(),
    })) || [];
  }, [linesData]);

  // 노선 ID 변경 핸들러
  const handleLineIdsChange = (selectedValues: string[]) => {
    const lineIds = selectedValues.map(Number);
    setValue('stationInfo.lineIds', lineIds);
  };

  const addStationCode = () => {
    const newCodes = [...stationCodes, ''];
    setStationCodes(newCodes);
  };

  const removeStationCode = (index: number) => {
    if (stationCodes.length > 1) {
      const newCodes = stationCodes.filter((_, i) => i !== index);
      setStationCodes(newCodes);
    }
  };

  const handleStationCodeChange = (index: number, value: string) => {
    const newCodes = [...stationCodes];
    newCodes[index] = value;
    setStationCodes(newCodes);
    setValue('stationInfo.stationCodes', newCodes.filter(code => code.trim() !== ''));
  };

  return (
    <Card>
      <CardHeader className="pt-2">
        <CardTitle>역사 정보</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 py-2">
        {/* 역 코드 섹션 */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="text-sm font-medium">역 코드</label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addStationCode}
            >
              <Plus size={16} className="mr-1" />
              추가
            </Button>
          </div>
          
          <div className="space-y-3">
            {stationCodes.map((code, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={code}
                  onChange={(e) => handleStationCodeChange(index, e.target.value)}
                  placeholder="역 코드를 입력하세요 (예: 201, 강남)"
                  className="flex-1"
                />
                {stationCodes.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeStationCode(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </Button>
                )}
              </div>
            ))}
          </div>
          {errors.stationInfo?.stationCodes && (
            <p className="text-red-500 text-sm mt-1">
              유효한 역 코드를 입력해주세요.
            </p>
          )}
        </div>

        {/* 노선 ID 섹션 */}
        <div>
          <label className="block text-sm font-medium mb-2">노선</label>
          <MultiSelect
            value={watchedLineIds.map(String)}
            onChange={handleLineIdsChange}
            options={lineOptions}
            placeholder="노선을 선택하세요"
          />
          {errors.stationInfo?.lineIds && (
            <p className="text-red-500 text-sm mt-1">
              노선을 선택해주세요.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
