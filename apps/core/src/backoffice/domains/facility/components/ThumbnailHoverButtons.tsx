
import { Edit2, Trash2, Eye, Map } from 'lucide-react';
import React from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@plug/ui';

interface ThumbnailHoverButtonsProps {
  onView?: () => void;
  onEdit?: () => void;
  onIndoorEdit?: () => void;
  onIndoorView?: () => void; // 새 실내 보기 버튼
  onDelete?: () => void;
  facilityName?: string;
}

const ThumbnailHoverButtons: React.FC<ThumbnailHoverButtonsProps> = ({
  onView,
  onIndoorEdit,
  onIndoorView,
  onDelete,
  facilityName = '시설'
}) => {
  return (
    <div className="absolute inset-0 bg-black/60 bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
      {onView && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onView();
          }}
          className="p-2 bg-white rounded-full shadow-lg hover:bg-primary-300 transition-colors cursor-pointer"
          title="상세보기"
        >
          <Eye size={16} className="text-green-600" />
        </button>
      )}
      {onIndoorEdit && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onIndoorEdit();
          }}
          className="p-2 bg-white rounded-full shadow-lg hover:bg-primary-300 transition-colors cursor-pointer"
          title="실내지도 편집"
        >
          <Edit2 size={16} className="text-purple-600" />
        </button>
      )}
      {onIndoorView && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onIndoorView();
          }}
          className="p-2 bg-white rounded-full shadow-lg hover:bg-primary-300 transition-colors cursor-pointer"
          title="실내보기로 이동"
        >
          <Map size={16} className="text-amber-600" />
        </button>
      )}
      {onDelete && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="p-2 bg-white rounded-full shadow-lg hover:bg-primary-300 transition-colors cursor-pointer"
              title="삭제"
            >
              <Trash2 size={16} className="text-red-600" />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>시설 삭제</AlertDialogTitle>
              <AlertDialogDescription>
                '{facilityName}' 시설을 정말로 삭제하시겠습니까?
                <br />
                이 작업은 되돌릴 수 없습니다.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>취소</AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDelete();
                }}
              >
                삭제
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default ThumbnailHoverButtons;
