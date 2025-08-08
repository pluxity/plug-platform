import { GsDeviceResponse } from "@plug/common-services/types";
import { DeviceData } from "../types/device";

export const DeviceMapper = (device: GsDeviceResponse): DeviceData => ({
    id: device.id,
    name: device.name,
    categoryName: device.deviceCategory?.name,
    thumbnailFile: device.deviceCategory?.thumbnailFile?.originalFileName,
});