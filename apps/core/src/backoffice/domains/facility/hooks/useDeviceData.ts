import { useDevicesSWR } from '@plug/common-services';
import { useMemo } from 'react';

export const useDeviceData = () => {
    const { data: devicesArray, isLoading, mutate } = useDevicesSWR();

    const getAllDevices = useMemo(() => {
        if (!Array.isArray(devicesArray)) return [];
        return devicesArray;
    }, [devicesArray]);

    const assignedDevices = useMemo(() => getAllDevices.filter((device) => Boolean(device.feature?.id)), [getAllDevices]);

    const unassignedDevices = useMemo(() => getAllDevices.filter((device) => !device.feature?.id), [getAllDevices]);

    return {
        getAllDevices,
        assignedDevices,
        unassignedDevices,
        isLoading,
        refetch: mutate,
    };
};