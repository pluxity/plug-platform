import { useAllDevicesSWR } from "@plug/common-services";
import { useMemo } from "react";

export const useDeviceData = () => {
    const { data: devicesArray, error, isLoading, mutate } = useAllDevicesSWR();

    const getAllDevices = useMemo(() => {
        if (!Array.isArray(devicesArray)) return [];
        return devicesArray;
    }, [devicesArray]);

    const assignedDevices = useMemo(() => {
        return getAllDevices.filter(device => Boolean(device.featureId));
    }, [getAllDevices]);

    const unassignedDevices = useMemo(() => {
        return getAllDevices.filter(device => !Boolean(device.featureId));
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