import { AssetResponse } from '@plug/common-services';
import { PoiIcon } from '../types/PoiIcon.types';
import { Button } from '@plug/ui';

export const usePoiIcon = (
  data: AssetResponse[],
  openModal: (mode: 'create' | 'edit') => void
): PoiIcon[] => {
  return data.map(asset => ({
    id: asset.id,
    name: asset.name,
    icon: <img src={asset.file?.url} alt={asset.file?.originalFileName} className="w-6 h-6" />,
    code: asset.createBy,
    update: asset.updatedAt,
    management: (
      <div className="flex flex-wrap gap-1">
        <Button color="primary" className="w-15" onClick={() => openModal('edit')}>수정</Button>
        <Button color="destructive" className="w-15">삭제</Button>
      </div>
    ),
  }));
}