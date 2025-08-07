import React, { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '@plug/ui';
import { FloorRequest, FloorResponse } from '@plug/common-services';
import { Plus, Trash2 } from 'lucide-react';

const floorSchema = z.object({
  floors: z.array(z.object({
    name: z.string().min(1, '층 이름은 필수입니다'),
    floorId: z.string().min(1, '층 ID는 필수입니다'),
  }))
});

type FloorsFormData = z.infer<typeof floorSchema>;

interface FloorsComponentProps {
  floors: FloorResponse[];
  onSave: (data: { floors: FloorRequest[] }) => Promise<void>;
  isLoading?: boolean;
}

export const FloorsComponent: React.FC<FloorsComponentProps> = ({
  floors,
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
  } = useForm<FloorsFormData>({
    resolver: zodResolver(floorSchema),
    defaultValues: {
      floors: floors.length > 0 ? floors : [{ name: '', floorId: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'floors',
  });

  const onSubmit = async (data: FloorsFormData) => {
    await onSave(data);
    setIsEditing(false);
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  const addFloor = () => {
    append({ name: '', floorId: '' });
  };

  const removeFloor = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  if (!isEditing) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>층 정보</CardTitle>
          <Button onClick={() => setIsEditing(true)} variant="outline">
            편집
          </Button>
        </CardHeader>
        <CardContent>
          {floors.length === 0 ? (
            <p className="text-gray-500">등록된 층 정보가 없습니다.</p>
          ) : (
            <div className="space-y-3">
              {floors.map((floor, index) => (
                <div key={index} className="p-3 border rounded-lg bg-gray-50">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium text-gray-600">층 이름</span>
                      <p className="text-sm">{floor.name}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">층 ID</span>
                      <p className="text-sm">{floor.floorId}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>층 정보 편집</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="p-4 border rounded-lg bg-gray-50">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-sm font-medium">층 {index + 1}</h4>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFloor(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      층 이름 <span className="text-red-500">*</span>
                    </label>
                    <Input
                      {...register(`floors.${index}.name`)}
                      placeholder="층 이름을 입력하세요 (예: 1층, B1층)"
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

          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={addFloor}
            >
              <Plus size={16} className="mr-2" />
              층 추가
            </Button>
            
            <div className="space-x-2">
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
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
