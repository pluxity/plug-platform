import { DeviceCategoryResponse } from '@plug/common-services/types';
import { CategoryItem } from '@/backoffice/common/view/components/category';

export const DeviceCategoryMapper = (deviceCategory: DeviceCategoryResponse[]): CategoryItem[] => {
    return deviceCategory.map(item => ({
        id: item.id.toString(),
        name: item.name,
        depth: item.depth + 1,
        parentId: item.parentId?.toString(),
        thumbnailUrl: item.thumbnailFile?.url,    
        thumbnailFileId: item.thumbnailFile?.id, 
        children: item.children && item.children.length > 0 ? DeviceCategoryMapper(item.children) : undefined, 
    }));
};