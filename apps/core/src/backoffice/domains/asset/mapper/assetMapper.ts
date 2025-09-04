import { AssetData } from '../types/asset';

import { AssetResponse } from '@plug/common-services/types';
export const AssetMapper = (asset: AssetResponse): AssetData => ({
  categoryId: asset.categoryId,
  categoryName: asset.categoryName || '',
  id: String(asset.id),
  code: asset.code,
  name: asset.name,
  file: asset.file?.originalFileName || '',
  thumbnailFile: asset.thumbnailFile?.url || '',
});