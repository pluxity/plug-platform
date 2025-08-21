import { AssetCategoryResponse } from "@plug/common-services/types";
import { CategoryItem } from "@/backoffice/common/view/components/category";

export const assetCategoryMapper = (apiData: AssetCategoryResponse[]): CategoryItem[] => {
    return apiData.map(item => ({
      id: item.id.toString(),
      name: item.name,
      code: item.code,
      depth: item.depth + 1, 
      parentId: item.parentId?.toString(),
      thumbnailUrl: item.thumbnail?.url,
      thumbnailFileId: item.thumbnail?.id,
      children: item.children && item.children.length > 0 
        ? assetCategoryMapper(item.children) 
        : undefined
    }))
  }