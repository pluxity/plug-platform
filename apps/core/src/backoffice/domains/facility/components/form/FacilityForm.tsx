import React from "react";
import { Card, CardContent } from "@plug/ui";
import { useNavigate } from "react-router-dom";
import { FacilityFormLayout } from "../layout/FacilityFormLayout";
import { useFacilityFormHandler } from "../../hook/useFacilityFormHandler";
import { useRegisterFacilityHooks } from "@/backoffice/domains/facility/hook/useFacilityFactory";
import { FacilityType } from "@/backoffice/domains/facility/types/facilityTypes";

interface FacilityFormProps {
  facilityType: FacilityType;
  onSaveSuccess?: () => void;
  initialData?: unknown;
  facilityId?: number;
}

export const FacilityForm: React.FC<FacilityFormProps> = ({
                                                            facilityType,
                                                            onSaveSuccess,
                                                            initialData,
                                                            facilityId
                                                          }) => {
  const navigate = useNavigate();

  useRegisterFacilityHooks(facilityType, facilityId);

  const { data, handlers } = useFacilityFormHandler({
    facilityType,
    facilityId,
    mode: facilityId ? 'edit' : 'create',
    initialData,
    onSaveSuccess
  });

  return (
    <Card>
      <CardContent>
        <FacilityFormLayout
          mode={facilityId ? 'edit' : 'create'}
          facilityData={data.facilityData}
          formData={data.formData}
          isLoading={data.isLoading}
          error={data.error}
          onInputChange={handlers.handleInputChange}
          onThumbnailUpload={handlers.handleThumbnailUpload}
          onDrawingUpload={handlers.handleDrawingUpload}
          onUpdateDrawing={handlers.handleUpdateDrawing}
          onSave={handlers.handleSave}
          onBack={() => navigate(-1)}
          thumbnailUploader={data.thumbnailUploader}
          drawingUploader={data.drawingUploader}
          facilityType={facilityType}
        />
      </CardContent>
    </Card>
  );
};