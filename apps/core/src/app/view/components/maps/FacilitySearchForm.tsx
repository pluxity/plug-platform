import * as Cesium from 'cesium';

import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';

import type { FacilityResponse } from '@plug/common-services';

import { useEnsureFacilities } from '@/app/hooks/useEnsureFacilities';
import { useFacilityStore } from '@/app/store/facilityStore';
import { GroupSearchForm, type GroupSearchGroup, type GroupSearchFormRef } from '@/app/view/components/group-search-form';
interface FacilitySearchFormProps {
  viewer: Cesium.Viewer | null;
  onFacilitySelectInfo?: (facility: FacilityResponse) => void;
  onFacilityPreSelect?: () => void;
}

const FacilitySearchForm: React.FC<FacilitySearchFormProps> = ({ viewer, onFacilitySelectInfo, onFacilityPreSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const formRef = useRef<GroupSearchFormRef>(null);
  const facilities = useFacilityStore((s) => s.facilities);
  const facilitiesFetched = useFacilityStore((s) => s.facilitiesFetched);
  // Ensure facilities are available (revalidate if stale silently)
  useEnsureFacilities({ revalidateIfStale: true });

  const [pendingFacility, setPendingFacility] = useState<FacilityResponse | null>(null);

  const matchesSearch = (facility: FacilityResponse, query: string) => {
    const name = facility.name?.toLowerCase() ?? '';
    const code = facility.code?.toLowerCase() ?? '';
    const description = facility.description?.toLowerCase() ?? '';
    return name.includes(query) || code.includes(query) || description.includes(query);
  };

  const groups: GroupSearchGroup<FacilityResponse>[] = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];
    const filtered = facilities.filter((f) => matchesSearch(f as FacilityResponse, query)) as FacilityResponse[];
    return [{ heading: '시설', items: filtered }];
  }, [searchQuery, facilities]);

  const flyToFacility = useCallback((facility: FacilityResponse, done?: () => void) => {
    if (!viewer) return;
    try {
      const entityId = `facility-${facility.id}`;
      const entity = viewer.entities.getById(entityId);

      let targetCartesian: Cesium.Cartesian3 | undefined;
      if (entity?.position) {
        targetCartesian = entity.position.getValue(Cesium.JulianDate.now()) as Cesium.Cartesian3 | undefined;
      }
      if (!targetCartesian && facility.lat && facility.lon) {
        targetCartesian = Cesium.Cartesian3.fromDegrees(facility.lon, facility.lat, 0);
      }
      if (!targetCartesian) return;

      const dist = Cesium.Cartesian3.distance(viewer.camera.position, targetCartesian);
      if (dist < 30) {
        done?.();
        return;
      }

      (viewer.camera as unknown as (Cesium.Camera & { cancelFlight?: () => void })).cancelFlight?.();

      const desiredAltitude = 650;
      const pitch = -20;
      const range = desiredAltitude / Math.sin(Math.abs(pitch) * Math.PI / 180);
      const offset = new Cesium.HeadingPitchRange(0, Cesium.Math.toRadians(pitch), range);

      let lookCenter = targetCartesian;
      try {
        const enu = Cesium.Transforms.eastNorthUpToFixedFrame(targetCartesian);
        const eastCol = Cesium.Matrix4.getColumn(enu, 0, new Cesium.Cartesian4());
        const northCol = Cesium.Matrix4.getColumn(enu, 1, new Cesium.Cartesian4());
        const east = new Cesium.Cartesian3(eastCol.x, eastCol.y, eastCol.z);
        const north = new Cesium.Cartesian3(northCol.x, northCol.y, northCol.z);
        Cesium.Cartesian3.normalize(east, east);
        Cesium.Cartesian3.normalize(north, north);
        const horizontalFactor = -0.1;
        const verticalFactor = 0.12;
        const horizShift = Cesium.Cartesian3.multiplyByScalar(east, -range * horizontalFactor, new Cesium.Cartesian3());
        const vertShift = Cesium.Cartesian3.multiplyByScalar(north, range * verticalFactor, new Cesium.Cartesian3());
        const combined = Cesium.Cartesian3.add(horizShift, vertShift, new Cesium.Cartesian3());
        lookCenter = Cesium.Cartesian3.add(targetCartesian, combined, new Cesium.Cartesian3());
      } catch {
        /* noop */
      }

      const sphere = new Cesium.BoundingSphere(lookCenter, Math.min(Math.max(dist * 0.1, 80), 1200));
      viewer.camera.flyToBoundingSphere(sphere, {
        duration: 0.5,
        offset,
        maximumHeight: 20000,
        complete: () => done?.(),
      });
    } catch {
      /* noop */
    }
  }, [viewer]);

  const handleSelectFacility = (facility: FacilityResponse) => {
    setSearchQuery('');
    formRef.current?.close();
    onFacilityPreSelect?.();
    setPendingFacility(facility);
  };

  useEffect(() => {
    if (viewer && pendingFacility) {
      const fac = pendingFacility;
      flyToFacility(fac, () => {
        onFacilitySelectInfo?.(fac);
        setPendingFacility(null);
      });
    }
  }, [viewer, pendingFacility, flyToFacility, onFacilitySelectInfo]);

  return (
    <GroupSearchForm<FacilityResponse>
      ref={formRef}
      value={searchQuery}
      onValueChange={setSearchQuery}
      groups={groups}
      placeholder={facilitiesFetched ? '시설명 또는 코드를 검색하세요...' : '시설 데이터를 불러오는 중...'}
      disabled={!facilitiesFetched}
  renderItem={(facility) => (
        <div>
          <div className="flex w-full items-start gap-2">
            <div className="w-3/5 break-words font-medium text-gray-900">
              {facility.name}
            </div>
            <div className="w-2/5 break-all whitespace-pre-wrap text-right">
              {facility.code && (
                <span className="inline-block text-[10px] leading-4 bg-blue-100 text-blue-800 px-2 py-1 rounded break-all">
                  {facility.code}
                </span>
              )}
            </div>
          </div>
          {facility.description && (
            <div className="text-xs text-gray-500 mt-1 break-words">{facility.description}</div>
          )}
          <div className="text-[10px] text-blue-600 mt-1">
            위도: {facility.lat?.toFixed(6)}, 경도: {facility.lon?.toFixed(6)}
          </div>
        </div>
      )}
      onSelect={handleSelectFacility}
      getItemKey={(facility) => facility.id}
    />
  );
};

export default FacilitySearchForm;
