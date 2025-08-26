import { useCctvSWR } from '@plug/common-services';
import { useMemo } from 'react';

export const useCctvData = () => {
    const { data: cctvsArray, error, isLoading, mutate } = useCctvSWR();

    const getAllCctvs = useMemo(() => {
        if(!Array.isArray(cctvsArray)) return [];
        return cctvsArray.map((cctv) => ({
            ...cctv,
        }))
    }, [cctvsArray]);

    const assignedCctvs = useMemo(() => {
        return getAllCctvs.filter(cctv => Boolean(cctv.feature?.id));
    }, [getAllCctvs]);

    const unassignedCctvs = useMemo(() => {
        return getAllCctvs.filter(cctv => !Boolean(cctv.feature?.id));
    }, [getAllCctvs]);

    return { 
        getAllCctvs, 
        assignedCctvs,
        unassignedCctvs,
        isLoading, 
        error: error?.message || null,
        refetch: mutate 
    };
}