import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Card, CardContent } from "@plug/ui";
import { PageContainer } from '@/backoffice/common/view/layouts';
import { FacilityFormLayout } from "@/backoffice/domains/facility/components/layout/FacilityFormLayout";
import { useFacilityFormHandler } from "@/backoffice/domains/facility/hook/useFacilityFormHandler";
import { FacilityData } from "@/backoffice/domains/facility/types/facilityTypeGuard";
import { useHistory } from "@plug/common-services";
import { FacilityType } from "@/backoffice/domains/facility/types/facilityTypes";
import { useRegisterFacilityHooks } from "@/backoffice/domains/facility/hook/useFacilityFactory";

const FacilityDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  const getFacilityTypeFromPath = (): FacilityType => {
    const pathSegments = location.pathname.split('/');
    const facilityIndex = pathSegments.findIndex(segment => segment === 'facility');
    if (facilityIndex >= 0 && facilityIndex + 1 < pathSegments.length) {
      const type = pathSegments[facilityIndex + 1];
      if (type === 'buildings' || type === 'stations') {
        return type as FacilityType;
      }
    }
    return 'facilities';
  };

  const facilityType = getFacilityTypeFromPath();
  const facilityId = id ? Number(id) : 0;

  useRegisterFacilityHooks(facilityType, facilityId);

  const { data: historyData, isLoading: historyLoading } = useHistory(facilityType, facilityId);
  const { data, handlers } = useFacilityFormHandler({
    facilityType: facilityType,
    facilityId,
    mode: "detail",
    onSaveSuccess: () => console.log("저장 성공"),
  });


  const typeTitle = facilityType === 'buildings' ? '건물' : facilityType === 'stations' ? '역' : '시설';

  if (!facilityType) {
    return (
      <PageContainer title="시설 상세 정보">
        <div className="bg-orange-50 border border-orange-200 p-4 rounded-md">
          <h2 className="text-orange-700 text-lg font-medium mb-2">
            알 수 없는 시설 유형
          </h2>
          <p className="text-orange-600">
            URL에서 시설 유형을 확인할 수 없습니다.
          </p>
          <button
            onClick={() => window.history.back()}
            className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md"
          >
            목록으로 돌아가기
          </button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title={data.isEditMode ? `${typeTitle} 편집` : `${typeTitle} 상세 정보`}>
      <Card>
        <CardContent>
          <FacilityFormLayout
            mode={data.isEditMode ? 'edit' : 'detail'}
            facilityData={data?.facilityData as FacilityData || undefined}
            formData={data?.formData as FacilityData || undefined}
            isLoading={data.isLoading || historyLoading}
            error={data.error}
            onInputChange={handlers.handleInputChange as (field: string, value: string | number | string[] | number[]) => void}
            onThumbnailUpload={handlers.handleThumbnailUpload}
            onDrawingUpload={handlers.handleDrawingUpload}
            onUpdateDrawing={handlers.handleUpdateDrawing}
            onSave={handlers.handleSave}
            onDelete={handlers.handleDelete}
            onBack={handlers.handleBack}
            onEditToggle={handlers.handleEditToggle}
            thumbnailUploader={data.thumbnailUploader}
            drawingUploader={data.drawingUploader}
            history={historyData}
            facilityType={facilityType}
          />
        </CardContent>
      </Card>
    </PageContainer>
  );
};

export default FacilityDetailPage;