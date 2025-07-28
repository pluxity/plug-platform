import React from "react";
import { Button } from "@plug/ui";
import { FacilityType } from "../store/FacilityListStore";
import { FacilityInfoSection } from "./createFormSections/FacilityInfoSection";
import { FacilityRegistry } from "./registry/FacilityRegistry";
import { FacilityFormHandler } from "./FacilityFormHandler";
import { FacilityData, isBuildingFacility, isStationFacility } from "../types/facilityTypeGuard";
import { FormProvider, useForm } from "react-hook-form";
import "./definitions/BuildingDefinition";
import "./definitions/StationDefinition";
import { FacilityRequest } from "@plug/common-services";

interface FacilityFormProps {
  facilityType: FacilityType;
  onSaveSuccess?: () => void;
  initialData?: FacilityData;
  mode?: 'create' | 'update';
  facilityId?: number;
}

export const FacilityForm: React.FC<FacilityFormProps> = ({ facilityType, onSaveSuccess, initialData, mode = 'create', facilityId }) => {
  const facilityDefinition = FacilityRegistry.get(facilityType);
  const methods = useForm();

  return (
    <FormProvider {...methods}>
      <FacilityFormHandler
        facilityType={facilityType}
        initialData={initialData}
        onSaveSuccess={onSaveSuccess}
        mode={mode}
        facilityId={facilityId}
      >
        {({ data, handlers, state }) => (
          <form onSubmit={handlers.handleSubmit}>
            <FacilityInfoSection
              title={`${mode === 'create' ? '새 ' : ''}${facilityDefinition?.displayName || '시설'} ${mode === 'create' ? '등록' : '수정'}`}
              facilityData={data as FacilityRequest}
              onChange={handlers.handleInputChange}
              onThumbnailUpload={handlers.handleThumbnailUpload}
              onDrawingUpload={handlers.handleDrawingUpload}
              thumbnailUploader={state.thumbnailUploader}
              drawingUploader={state.drawingUploader}
              showFloorInfo={isBuildingFacility(data)}
              onFloorsChange={isBuildingFacility(data) ? (floors) => {
                handlers.handleDataChange({
                  ...data,
                  floors
                });
              } : undefined}
            >
              {facilityDefinition?.sections.map((section) => (
                <React.Fragment key={section.id}>
                  {section.render({
                    data,
                    onChange: handlers.handleDataChange,
                    handlers: {
                      onFloorsChange: isBuildingFacility(data) ? (floors) => {
                        handlers.handleDataChange({ ...data, floors });
                      } : undefined,

                      onStationCodesChange: isStationFacility(data) ? (codes) => {
                        handlers.handleDataChange({
                          ...data,
                          stationInfo: {
                            ...data.stationInfo,
                            stationCodes: codes
                          }
                        });
                      } : undefined,

                      onLineIdsChange: isStationFacility(data) ? (lineIds) => {
                        handlers.handleDataChange({
                          ...data,
                          stationInfo: {
                            ...data.stationInfo,
                            lineIds
                          }
                        });
                      } : undefined,
                    }
                  })}
                </React.Fragment>
              ))}
            </FacilityInfoSection>

            {state.error && (
              <div className="text-red-500 mt-4 text-center">{state.error}</div>
            )}

            <div className="flex items-center justify-end mt-6 gap-2">
              <Button type="submit" disabled={state.isSubmitDisabled}>
                {state.isSubmitting
                  ? "처리 중..."
                  : (state.isSubmitDisabled && !state.isSubmitting
                    ? "파일 업로드 완료 대기 중..."
                    : mode === 'create' ? "저장" : "수정")}
              </Button>
            </div>
          </form>
        )}
      </FacilityFormHandler>
    </FormProvider>
  );
};