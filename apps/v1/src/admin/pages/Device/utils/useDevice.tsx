import { DeviceResponse } from "@plug/common-services";
import { Device } from '../../Device/types/device.types';
import { Button } from '@plug/ui';
import  DateFormatter from '@plug/v1/app/utils/dateFormatter';

export const useDevice = (
    data: DeviceResponse[],
    onDelete: (deviceId: number) => void,
    onEdit: (deviceId: number) => void,
): Device[] => {
    return data.map(device => ({  
        id: device.id,
        name: device.name,
        code: device.code,
        categoryName: device.categoryName,
        creator: device.createdBy,
        update: DateFormatter(device.createdAt),
        management: (
            <div className="flex flex-wrap gap-1">
            <Button color="primary" className="w-15" onClick={() => onEdit(device.id)}>수정</Button>
            <Button 
                color="destructive" 
                className="w-15"
                onClick={() => {onDelete(device.id)}}
              >삭제</Button>
          </div>
        )

    }));
}