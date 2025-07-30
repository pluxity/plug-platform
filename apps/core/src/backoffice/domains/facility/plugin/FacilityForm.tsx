import React from "react";
import { Card, CardContent } from "@plug/ui";
import { FacilityType } from "../store/FacilityListStore";
import { useNavigate } from "react-router-dom";
import { FacilityFormLayout } from "../components/layout/FacilityFormLayout";
import { useFacilityFormHandler } from "@/backoffice/domains/facility/plugin/FacilityFormHandler";

interface FacilityFormProps {
  facilityType: FacilityType;
  onSaveSuccess?: () => void;
  initialData?: any;
  facilityId?: number;
}

export const FacilityForm: React.FC<FacilityFormProps> = ({ facilityType, onSaveSuccess, initialData, facilityId }) => {
  const navigate = useNavigate();

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
          onSave={handlers.handleSave}
          onBack={() => navigate(-1)}
          thumbnailUploader={data.thumbnailUploader}
          drawingUploader={data.drawingUploader}
        />
      </CardContent>
    </Card>
  );
};