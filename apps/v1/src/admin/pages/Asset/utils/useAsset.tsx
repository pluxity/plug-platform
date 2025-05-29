import { AssetResponse } from '@plug/common-services';
import { Asset } from '../../Asset/types/asset.types';
import { Button } from '@plug/ui';
import  DateFormatter from '@plug/v1/app/utils/dateFormatter';

export const useAsset = (
  data: AssetResponse[],
  onDelete: (assetId: number) => void,
  onEdit: (assetId: number) => void
): Asset[] => {
  return data.map(asset => ({
    id: String(asset.id),
    name: asset.name,
    file: asset.file?.originalFileName,
    thumbnailFile: asset.thumbnailFile?.originalFileName,
    code: asset.createdBy,
    update: DateFormatter(asset.createdAt),
    management: (
      <div className="flex flex-wrap gap-1">
        <Button color="primary" className="w-15" onClick={() => onEdit(asset.id)}>수정</Button>
        <Button 
            color="destructive" 
            className="w-15"
            onClick={() => {onDelete(asset.id)}}
          >삭제</Button>
      </div>
    ),
  }));
}