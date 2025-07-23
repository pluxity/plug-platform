import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '@/backoffice/common/view/layouts';
import { BuildingForm } from './buildings/BuildingForm';
import { StationForm } from './station/StationForm';
import { useFacilityListStore, FacilityType, FACILITY_TYPE_LABELS } from './store/FacilityListStore';
import { Tabs, TabsList, TabsTrigger } from "@plug/ui";

const FacilityAddPage: React.FC = () => {
  const navigate = useNavigate();
  const { selectedType, setSelectedType, previousRoute } = useFacilityListStore();
  const [facilityType, setFacilityType] = useState<FacilityType>(
    selectedType !== 'facilities' ? selectedType : 'buildings'
  );

  useEffect(() => {
    if (selectedType !== 'facilities' && facilityType !== selectedType) {
      setFacilityType(selectedType);
    }
  }, [selectedType, facilityType]);

  const handleTypeChange = (value: string) => {
    const newType = value as FacilityType;
    setFacilityType(newType);
    setSelectedType(newType);
  };

  const handleBack = () => {
    if (previousRoute) {
      navigate(previousRoute.path);
    } else {
      navigate('/admin/facility');
    }
  };

  const handleSaveSuccess = () => {
    handleBack();
  };

  const renderFacilityForm = () => {
    switch (facilityType) {
      case 'buildings':
        return (
          <BuildingForm
            onSaveSuccess={handleSaveSuccess}
          />
        );
      case 'stations':
        return (
          <StationForm
            onSaveSuccess={handleSaveSuccess}
          />
        );
      default:
        return
    }
  };

  return (
    <PageContainer title="새 시설 추가">
      <div className="space-y-6">
        <div className="bg-white p-4 rounded-md border border-gray-200">
          <h2 className="text-lg font-medium mb-4">시설 유형 선택</h2>
          <Tabs value={facilityType} onValueChange={handleTypeChange} className="w-full">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="buildings">
                {FACILITY_TYPE_LABELS.buildings}
              </TabsTrigger>
              <TabsTrigger value="stations">
                {FACILITY_TYPE_LABELS.stations}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="bg-white p-6 rounded-md border border-gray-200">
          {renderFacilityForm()}
        </div>
      </div>
    </PageContainer>
  );
};

export default FacilityAddPage;