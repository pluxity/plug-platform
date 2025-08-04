import React from "react";
import { Button } from "@plug/ui";
import { FacilityType } from "../store/FacilityListStore";

import { FacilityRegistry } from "./registry/FacilityRegistry";
import { FacilityFormHandler } from "./FacilityFormHandler";
import {
  FacilityCreateRequest,
  FacilityData,
  FacilityUpdateRequest,
  isBuildingFacility,
  isStationFacility
} from "../types/facilityTypeGuard";
import { FormProvider, useForm } from "react-hook-form";
import "./definitions/BuildingDefinition";
import "./definitions/StationDefinition";
import { FacilityDetailLayout } from "@/backoffice/domains/facility/components/layout/FacilityDetailLayout";
interface FacilityFormProps {
  facilityType: FacilityType;
  onSaveSuccess?: () => void;
  initialData?: FacilityCreateRequest;
  facilityId?: number;
}

export const FacilityForm: React.FC<FacilityFormProps> = ({ facilityType, onSaveSuccess, initialData, facilityId }) => {
  const facilityDefinition = FacilityRegistry.get(facilityType);
  const methods = useForm();

  return (
    <FormProvider {...methods}>
      <FacilityFormHandler
        facilityType={facilityType}
        initialData={initialData}
        onSaveSuccess={onSaveSuccess}
        facilityId={facilityId}
      >
        {({ data, handlers, state }) => (
          <form onSubmit={handlers.handleSubmit}>
            <FacilityDetailLayout
              title={`새 ${facilityDefinition?.displayName || "시설"} 등록`}
              facilityData={data as FacilityCreateRequest | FacilityData | FacilityUpdateRequest}
              onChange={handlers.handleInputChange}
              onThumbnailUpload={handlers.handleThumbnailUpload}
              onDrawingUpload={handlers.handleDrawingUpload}
              thumbnailUploader={state.thumbnailUploader}
              drawingUploader={state.drawingUploader}
              showFloorInfo={isBuildingFacility(data)}

            >
              {facilityDefinition?.sections.map((section) => (
                <React.Fragment key={section.id}>
                  {section.render({
                    data,
                    onChange: handlers.handleDataChange,
                    handlers: {
                      onFloorsChange: isBuildingFacility(data)
                        ? (floors) => {
                            handlers.handleDataChange({ ...data, floors });
                          }
                        : undefined,

                      onStationCodesChange: isStationFacility(data)
                        ? (codes) => {
                          handlers.handleDataChange({
                            ...data,
                            stationInfo: {
                              ...(data.stationInfo || { lineIds: [], stationCodes: [] }),
                              stationCodes: codes,
                            },
                          });
                        }
                        : undefined,

                      onLineIdsChange: isStationFacility(data)
                        ? (lineIds) => {
                          handlers.handleDataChange({
                            ...data,
                            stationInfo: {
                              ...(data.stationInfo || { lineIds: [], stationCodes: [] }),
                              lineIds,
                            },
                          });
                        }
                        : undefined,

                    },
                  })}
                </React.Fragment>
              ))}
            </FacilityDetailLayout>

            {state.error && (
              <div className="text-red-500 mt-4 text-center">{state.error}</div>
            )}

            <div className="flex items-center justify-end mt-6 gap-2">
              <Button type="submit" disabled={state.isSubmitDisabled}>
                {state.isSubmitting
                  ? "처리 중..."
                  : state.isSubmitDisabled && !state.isSubmitting
                    ? "파일 업로드 완료 대기 중..."
                      : "저장"}
              </Button>
            </div>
          </form>
        )}
      </FacilityFormHandler>
    </FormProvider>
  );
};