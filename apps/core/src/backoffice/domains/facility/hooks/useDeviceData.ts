import { useDevicesSWR } from "@plug/common-services";
import { useMemo } from "react";

export const useDeviceData = () => {
    const { data: devicesArray, error, isLoading, mutate } = useDevicesSWR();

    const getAllDevices = useMemo(() => {
        if (!Array.isArray(devicesArray)) return [];
        return devicesArray;
    }, [devicesArray]);

    const assignedDevices = useMemo(() => {
        return getAllDevices.filter(device => Boolean(device.feature?.id));
    }, [getAllDevices]);

    const unassignedDevices = useMemo(() => {
        return getAllDevices.filter(device => !Boolean(device.feature?.id));
    }, [getAllDevices]);

    return {
        getAllDevices,  
        assignedDevices,
        unassignedDevices,
        isLoading,
        error: error?.message || null,
        refetch: mutate
    }
}