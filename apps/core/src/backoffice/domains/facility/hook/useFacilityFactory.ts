import { useEffect } from "react";
import { useDetail, useCreate, useUpdate, useDeletion } from "@plug/common-services";
import { FacilityServiceFactory } from "../services/facilityServiceFactory";
import { FacilityType } from "../types/facilityTypes";
import { IFacilityService } from "../services/facilityServiceFactory";

export function useRegisterFacilityHooks(type: FacilityType, id?: number) {
  const buildingDetailHook = useDetail('buildings', id || 0);
  const stationDetailHook = useDetail('stations', id || 0);

  const buildingCreateHook = useCreate('buildings');
  const stationCreateHook = useCreate('stations');

  const buildingUpdateHook = useUpdate('buildings', id || 0);
  const stationUpdateHook = useUpdate('stations', id || 0);

  const buildingDeleteHook = useDeletion('buildings', id || 0);
  const stationDeleteHook = useDeletion('stations', id || 0);

  const buildingDrawingUpdateHook = useUpdate('buildings', id || 0);
  const stationDrawingUpdateHook = useUpdate('stations', id || 0);

  const buildingService = FacilityServiceFactory.getService('buildings') as IFacilityService;
  const stationService = FacilityServiceFactory.getService('stations') as IFacilityService;

  useEffect(() => {
    if (id) {
      if (type === 'buildings') {
        buildingService.registerHook?.('buildings', 'useDetail', id, buildingDetailHook);
      } else if (type === 'stations') {
        stationService.registerHook?.('stations', 'useDetail', id, stationDetailHook);
      }

      if (type === 'buildings') {
        buildingService.registerHook?.('buildings', 'useUpdate', id, buildingUpdateHook);
      } else if (type === 'stations') {
        stationService.registerHook?.('stations', 'useUpdate', id, stationUpdateHook);
      }

      if (type === 'buildings') {
        buildingService.registerHook?.('buildings', 'useDeletion', id, buildingDeleteHook);
      } else if (type === 'stations') {
        stationService.registerHook?.('stations', 'useDeletion', id, stationDeleteHook);
      }

      if (type === 'buildings') {
        buildingService.registerHook?.('buildings', 'useUpdateDrawing', id, buildingDrawingUpdateHook);
      } else if (type === 'stations') {
        stationService.registerHook?.('stations', 'useUpdateDrawing', id, stationDrawingUpdateHook);
      }
    }

    if (type === 'buildings') {
      buildingService.registerHook?.('buildings', 'useCreate', null, buildingCreateHook);
    } else if (type === 'stations') {
      stationService.registerHook?.('stations', 'useCreate', null, stationCreateHook);
    }

    return () => {
      if (id) {
        if (type === 'buildings') {
          buildingService.clearHook?.('buildings', 'useDetail', id);
          buildingService.clearHook?.('buildings', 'useUpdate', id);
          buildingService.clearHook?.('buildings', 'useDeletion', id);
          buildingService.clearHook?.('buildings', 'useUpdateDrawing', id);
        } else if (type === 'stations') {
          stationService.clearHook?.('stations', 'useDetail', id);
          stationService.clearHook?.('stations', 'useUpdate', id);
          stationService.clearHook?.('stations', 'useDeletion', id);
          stationService.clearHook?.('stations', 'useUpdateDrawing', id);
        }
      }

      if (type === 'buildings') {
        buildingService.clearHook?.('buildings', 'useCreate', null);
      } else if (type === 'stations') {
        stationService.clearHook?.('stations', 'useCreate', null);
      }
    };
  }, [type, id,
    buildingDetailHook, stationDetailHook,
    buildingCreateHook, stationCreateHook,
    buildingUpdateHook, stationUpdateHook,
    buildingDeleteHook, stationDeleteHook,
    buildingDrawingUpdateHook, stationDrawingUpdateHook,
    buildingService, stationService]);
}