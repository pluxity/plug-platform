import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Textarea,
} from '@plug/ui';
import { FacilityFormComponentProps } from '../../types';

export const BoundaryFormComponent: React.FC<FacilityFormComponentProps> = ({
  register,
  errors,
}) => {
  return (
    <Card>
      <CardHeader className="pt-2">
        <CardTitle>경계 정보</CardTitle>
      </CardHeader>
      <CardContent className="py-2">
        <div>
          <label className="block text-sm font-medium mb-2">
            경계 데이터
          </label>
          <Textarea
            {...register('boundary')}
            placeholder="경계 데이터를 입력하세요 (GeoJSON 형식 등)"
            rows={6}
            className="font-mono text-sm"
          />
          {errors.boundary && (
            <p className="text-red-500 text-sm mt-1">
              {errors.boundary.message || '유효한 경계 데이터를 입력해주세요.'}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
