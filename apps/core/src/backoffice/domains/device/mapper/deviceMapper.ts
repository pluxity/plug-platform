import { DeviceResponse } from "@plug/common-services/types";
import { DeviceData } from "../types/device";

export const DeviceMapper = (device: DeviceResponse): DeviceData => ({
    id: device.id,
    name: device.name,
    categoryName: device.deviceCategory?.name,
    companyType: device.companyType,
    deviceType: device.deviceType,
});