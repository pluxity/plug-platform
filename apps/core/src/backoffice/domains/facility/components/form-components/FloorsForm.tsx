import React, { useEffect } from 'react';
import { useFieldArray } from 'react-hook-form';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Input,
} from '@plug/ui';
import { FloorsFormProps } from '../../types';

export const FloorsForm: React.FC<FloorsFormProps> = ({
  control,
  register,
  errors,
  onFloorsReplaceReady,
  isProcessingDrawing = false,
}) => {
  const { fields, replace } = useFieldArray({
    control,
    name: 'floors',
  });

  useEffect(() => {
    if (onFloorsReplaceReady) {
      onFloorsReplaceReady(replace);
    }
  }, [onFloorsReplaceReady, replace]);

  return (
    <Card>
      <CardHeader className="pt-2">
        <CardTitle>층 정보</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 py-2">
        {fields.length > 0 ? (
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="p-4 border rounded-lg bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      층 이름 <span className="text-red-500">*</span>
                    </label>
                    <Input
                      {...register(`floors.${index}.name`)}
                      placeholder="층 이름을 입력하세요 (예: 1층, B1층)"
                      readOnly
                      className="bg-gray-100"
                    />
                    {errors.floors?.[index]?.name && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.floors[index]?.name?.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      층 ID <span className="text-red-500">*</span>
                    </label>
                    <Input
                      {...register(`floors.${index}.floorId`)}
                      placeholder="층 ID를 입력하세요 (예: F1, B1)"
                      readOnly
                      className="bg-gray-100"
                    />
                    {errors.floors?.[index]?.floorId && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.floors[index]?.floorId?.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-500">
              <p className="text-lg mb-2">층 정보가 없습니다</p>
              <p className="text-sm">도면 파일(GLB/GLTF)을 업로드하면 층 정보가 자동으로 추출됩니다</p>
            </div>
          </div>
        )}

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          {isProcessingDrawing ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
              <p className="text-sm text-blue-700">
                도면 파일에서 층 정보를 추출하는 중입니다...
              </p>
            </div>
          ) : (
            <p className="text-sm text-blue-700">
              📋 층 정보는 업로드된 도면 파일(GLB/GLTF)에서 자동으로 추출됩니다.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

