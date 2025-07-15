import { AssetResponse } from '@plug/common-services/types';
import { AssetData } from '../types/asset';

export const AssetMapper = (asset: AssetResponse): AssetData => ({
  categoryId: asset.categoryId || 0,
  categoryName: asset.categoryName || '',
  id: String(asset.id),
  code: String(asset.code),
  name: asset.name,
  file: asset.file?.originalFileName || '',
  thumbnailFile: asset.thumbnailFile?.originalFileName || '',
});