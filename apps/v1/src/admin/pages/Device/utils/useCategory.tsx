import { CategoryResponse } from "@plug/common-services";
import { Category } from '../../Device/types/category.types';
import { Button } from '@plug/ui';
import  DateFormatter from '@plug/v1/app/utils/dateFormatter';

export const useCategory = (
    data: CategoryResponse[],
    onDelete: (categoryId: number) => void,
    onEdit: (categoryId: number) => void,
): Category[] => {
    return data.map(category => ({  
        id: category.id,
        name: category.name,
        iconFile: category.iconFile?.originalFileName,
        code: category.baseResponse.createdBy,
        update: DateFormatter(category.baseResponse.createdAt),
        management: (
            <div className="flex flex-wrap gap-1">
            <Button color="primary" className="w-15" onClick={() => onEdit(category.id)}>수정</Button>
            <Button 
                color="destructive" 
                className="w-15"
                onClick={() => {onDelete(category.id)}}
              >삭제</Button>
          </div>
        )

    }));
}