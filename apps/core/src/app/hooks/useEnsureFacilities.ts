import { useEffect } from 'react';
import { useFacilityStore } from '@/app/store/facilityStore';

/**
 * Ensures facilities are loaded and (optionally) revalidated if stale.
 * @param options - control stale revalidation behavior
 */
export function useEnsureFacilities(options?: { revalidateIfStale?: boolean; force?: boolean }) {
  const loadFacilities = useFacilityStore((s) => s.loadFacilities);
  const isStale = useFacilityStore((s) => s.isStale);
  const facilitiesFetched = useFacilityStore((s) => s.facilitiesFetched);

  useEffect(() => {
    if (options?.force) {
    loadFacilities({ force: true });
    return;
    }
    if (!facilitiesFetched) {
    loadFacilities();
    return;
    }
    if (options?.revalidateIfStale && isStale()) {
    loadFacilities();
    }
  }, [facilitiesFetched, loadFacilities, isStale, options?.revalidateIfStale, options?.force]);
}
