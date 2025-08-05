import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
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
  onEdit?: () => void;
  onDelete?: () => void;
  facilityName?: string;
}

const ThumbnailHoverButtons: React.FC<ThumbnailHoverButtonsProps> = ({
  onEdit,
  onDelete,
  facilityName = '시설'
}) => {
  return (
    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
      {onEdit && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors cursor-pointer"
          title="편집"
        >
          <Edit2 size={16} className="text-blue-600" />
        </button>
      )}
      {onDelete && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors cursor-pointer"
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
                  e.stopPropagation();
                  onDelete();
                }}
                className="bg-red-600 hover:bg-red-700"
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
