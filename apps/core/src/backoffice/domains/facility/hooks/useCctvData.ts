import { useMemo } from 'react';

import { useCctvSWR } from '@plug/common-services';
export const useCctvData = () => {
    const { data: cctvsArray, isLoading, mutate } = useCctvSWR();

    const getAllCctvs = useMemo(() => {
        if (!Array.isArray(cctvsArray)) return [];
        return cctvsArray;
    }, [cctvsArray]);

    const assignedCctvs = useMemo(() => getAllCctvs.filter((cctv) => Boolean(cctv.feature?.id)), [getAllCctvs]);

    const unassignedCctvs = useMemo(() => getAllCctvs.filter((cctv) => !cctv.feature?.id), [getAllCctvs]);

    return {
        getAllCctvs,
        assignedCctvs,
        unassignedCctvs,
        isLoading,
        refetch: mutate,
    };
};