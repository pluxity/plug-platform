import React, { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '@plug/ui';
import { StationInfoRequest, StationInfoResponse } from '@plug/common-services';
import { Plus, Trash2 } from 'lucide-react';

const stationInfoSchema = z.object({
  stationCodes: z.array(z.object({
    code: z.string(),
  })),
  lineIds: z.array(z.object({
    id: z.number(),
  }))
});

type StationInfoFormData = z.infer<typeof stationInfoSchema>;

interface StationInfoComponentProps {
  stationInfo?: StationInfoResponse;
  onSave: (data: { stationInfo: StationInfoRequest }) => Promise<void>;
  isLoading?: boolean;
}

export const StationInfoComponent: React.FC<StationInfoComponentProps> = ({
  stationInfo,
  onSave,
  isLoading = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<StationInfoFormData>({
    resolver: zodResolver(stationInfoSchema),
    defaultValues: {
      stationCodes: stationInfo?.stationCodes?.map(code => ({ code })) || [{ code: '' }],
      lineIds: stationInfo?.lineIds?.map(id => ({ id })) || [],
    },
  });

  const { fields: stationCodeFields, append: appendStationCode, remove: removeStationCode } = useFieldArray({
    control,
    name: 'stationCodes',
  });

  const { fields: lineIdFields, append: appendLineId, remove: removeLineId } = useFieldArray({
    control,
    name: 'lineIds',
  });

  const onSubmit = async (data: StationInfoFormData) => {
    const updateData: { stationInfo: StationInfoRequest } = {
      stationInfo: {
        lineIds: data.lineIds.map(item => item.id).filter((id): id is number => typeof id === 'number' && !isNaN(id)),
        stationCodes: data.stationCodes.map(item => item.code).filter(code => code && code.trim() !== ''),
      },
    };
    
    await onSave(updateData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  const addStationCode = () => {
    appendStationCode({ code: '' });
  };

  const removeStationCodeField = (index: number) => {
    if (stationCodeFields.length > 1) {
      removeStationCode(index);
    }
  };

  const addLineId = () => {
    appendLineId({ id: 0 });
  };

  const removeLineIdField = (index: number) => {
    removeLineId(index);
  };

  if (!isEditing) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>역사 정보</CardTitle>
          <Button onClick={() => setIsEditing(true)} variant="outline">
            편집
          </Button>
        </CardHeader>
        <CardContent>
          {!stationInfo || (stationInfo.lineIds.length === 0 && stationInfo.stationCodes.length === 0) ? (
            <p className="text-gray-500">등록된 역사 정보가 없습니다.</p>
          ) : (
            <div className="space-y-4">
              {stationInfo.stationCodes.length > 0 && (
                <div>
                  <span className="text-sm font-medium text-gray-600">역 코드</span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {stationInfo.stationCodes.map((code, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                        {code}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {stationInfo.lineIds.length > 0 && (
                <div>
                  <span className="text-sm font-medium text-gray-600">노선 ID</span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {stationInfo.lineIds.map((lineId, index) => (
                      <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                        {lineId}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>역사 정보 편집</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
              {stationCodeFields.map((field, index) => (
                <div key={field.id} className="flex gap-2">
                  <Input
                    {...register(`stationCodes.${index}.code`)}
                    placeholder="역 코드를 입력하세요 (예: 201, 강남)"
                    className="flex-1"
                  />
                  {stationCodeFields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeStationCodeField(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            {errors.stationCodes && (
              <p className="text-red-500 text-sm mt-1">
                유효한 역 코드를 입력해주세요.
              </p>
            )}
          </div>

          {/* 노선 ID 섹션 */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-medium">노선 ID</label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addLineId}
              >
                <Plus size={16} className="mr-1" />
                추가
              </Button>
            </div>
            
            <div className="space-y-3">
              {lineIdFields.map((field, index) => (
                <div key={field.id} className="flex gap-2">
                  <Input
                    {...register(`lineIds.${index}.id`, { valueAsNumber: true })}
                    type="number"
                    placeholder="노선 ID를 입력하세요 (예: 1, 2, 3)"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeLineIdField(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
            </div>
            {errors.lineIds && (
              <p className="text-red-500 text-sm mt-1">
                유효한 노선 ID를 입력해주세요.
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
            >
              취소
            </Button>
            <Button 
              type="submit" 
              disabled={!isDirty || isLoading}
            >
              {isLoading ? '저장 중...' : '저장'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
