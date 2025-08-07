import React, { useEffect } from 'react';
import { useFieldArray } from 'react-hook-form';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Input,
  // Button, // 일시적으로 비활성화
} from '@plug/ui';
// import { Plus, Trash2 } from 'lucide-react'; // 일시적으로 비활성화
import { FloorsFormComponentProps } from '../../types';

export const FloorsFormComponent: React.FC<FloorsFormComponentProps> = ({
  control,
  register,
  errors,
  onFloorsReplaceReady,
  isProcessingDrawing = false,
}) => {
  const { fields, replace /* append, remove */ } = useFieldArray({
    control,
    name: 'floors',
  });

  // 컴포넌트가 마운트될 때 replace 함수를 부모에게 전달
  useEffect(() => {
    if (onFloorsReplaceReady) {
      onFloorsReplaceReady(replace);
    }
  }, [onFloorsReplaceReady, replace]);

  // 도면 파일에서 자동 추출되므로 일시적으로 비활성화
  // const addFloor = () => {
  //   append({ name: '', floorId: '' });
  // };

  // const removeFloor = (index: number) => {
  //   if (fields.length > 1) {
  //     remove(index);
  //   }
  // };

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
                <div className="flex justify-between items-center mb-3">
                  {/* 도면 파일에서 자동 추출된 층 정보이므로 삭제 기능 비활성화 */}
                  {/* {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFloor(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </Button>
                  )} */}
                </div>
                
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

        {/* 도면 파일에서 자동 추출된 층 정보 안내 */}
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          {isProcessingDrawing ? (
            <p className="text-sm text-blue-700">
              � 도면 파일에서 층 정보를 추출하는 중입니다...
            </p>
          ) : (
            <p className="text-sm text-blue-700">
              �📋 층 정보는 업로드된 도면 파일(GLB/GLTF)에서 자동으로 추출됩니다.
            </p>
          )}
        </div>

        {/* 층 추가 버튼 - 도면 파일 기반이므로 일시적으로 비활성화 */}
        {/* <Button
          type="button"
          variant="outline"
          onClick={addFloor}
          className="w-full"
        >
          <Plus size={16} className="mr-2" />
          층 추가
        </Button> */}
      </CardContent>
    </Card>
  );
};
