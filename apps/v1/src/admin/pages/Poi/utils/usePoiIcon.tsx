import { AssetResponse } from '@plug/common-services';
import { PoiIcon } from '../types/PoiIcon.types';
import { Button } from '@plug/ui';
import  DateFormatter from '@plug/v1/service/utils/dateFormatter';

export const usePoiIcon = (
  data: AssetResponse[],
  openModal: (mode: 'create' | 'edit') => void,
  onDelete: (userId: number) => void,
): PoiIcon[] => {
  return data.map(asset => ({
    id: String(asset.id),
    name: asset.name,
    icon: <img src={asset.file?.url} alt={asset.file?.originalFileName} className="w-6 h-6" />,
    code: asset.createdBy,
    update: DateFormatter(asset.createdAt),
    management: (
      <div className="flex flex-wrap gap-1">
        <Button color="primary" className="w-15" onClick={() => openModal('edit')}>수정</Button>
        <Button 
            color="destructive" 
            className="w-15"
            onClick={() => {onDelete(asset.id)}}
          >삭제</Button>
      </div>
    ),
  }));
}