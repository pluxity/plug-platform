import React, { useEffect } from 'react';
import { useFieldArray } from 'react-hook-form';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@plug/ui";

import { FloorsFormProps } from '../../types';

export const FloorsForm: React.FC<FloorsFormProps> = ({
  control,
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
    <div className="space-y-4">
      <div className="text-2xl font-bold text-gray-700" data-testid="facility-form-title">
        층 정보
      </div>

      <div className="space-y-4 border rounded-lg p-6 h-80 overflow-y-auto">
        <p className="text-sm text-primary-800">
          📋 층 정보는 업로드된 도면 파일(GLB/GLTF)에서 자동으로 추출됩니다.
        </p>
        {isProcessingDrawing && (
          <div className="flex items-center space-x-2 p-3 bg-primary-100 border border-primary-200 rounded-lg">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-600 border-t-transparent"></div>
            <p className="text-sm text-primary-700">
              도면 파일에서 층 정보를 추출하는 중입니다...
            </p>
          </div>
        )}
        {fields.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow className="grid grid-cols-3">
                <TableHead >층 ID</TableHead>
                <TableHead className="col-span-2">층 정보</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {fields.map((field) => {
                return (
                  <TableRow key={field.id} className="grid grid-cols-3">
                    <TableCell>{field.floorId}</TableCell>
                    <TableCell className="col-span-2">{field.name}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg mb-2 text-secondary-900">층 정보가 없습니다</p>
            <p className="text-sm text-gray-500">
              도면 파일(GLB/GLTF)을 업로드하면 층 정보가 자동으로 추출됩니다
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

