import { AssetResponse } from '@plug/common-services';
import { PoiIcon } from '../types/PoiIcon.types';
import { Button } from '@plug/ui';

export function mapAssetsToPoiIcons(
  assets: AssetResponse[],
  openModal: (mode: 'create' | 'edit') => void
): PoiIcon[] {
  return assets.map(asset => ({
    id: asset.id,
    name: asset.name,
    icon: <img src={asset.file?.url} alt={asset.file?.originalFileName} className="w-6 h-6" />,
    code: asset. createBy,
    update: asset.updatedAt,
    management: (
      <div className="flex flex-wrap gap-1">
        <Button color="primary" onClick={() => openModal('edit')}>수정</Button>
        <Button color="destructive">삭제</Button>
      </div>
    ),
  }));
}