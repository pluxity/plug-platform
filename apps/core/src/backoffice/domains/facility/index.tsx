import React, { useEffect, useState, useCallback } from "react";
import { PageContainer } from "@/backoffice/common/view/layouts";
import { FacilityLayout } from "./components/FacilityLayout";
import { useLocation } from "react-router-dom";
import { useFacilityListStore, FacilityType, FACILITY_BUTTON_LABELS } from "./store/FacilityListStore";
import { FacilityCardList } from "@/backoffice/domains/facility/components/FacilityCardList";
import { CardList } from "@/backoffice/domains/facility/components/CardList";
import { FacilityForm } from "@/backoffice/domains/facility/plugin/FacilityForm";

const FacilityManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FacilityType>("facilities");
  const [isCreateMode, setIsCreateMode] = useState(false);
  const location = useLocation();
  const previousPathRef = React.useRef<string | null>(null);
  const { setSelectedType } = useFacilityListStore();

  useEffect(() => {
    if (previousPathRef.current !== location.pathname && location.pathname === '/admin/facility') {
      setActiveTab('facilities');
      setSelectedType('facilities');
      setIsCreateMode(false);
    }

    previousPathRef.current = location.pathname;
  }, [location.pathname, setSelectedType]);

  useEffect(() => {
    if (isCreateMode && activeTab === 'facilities') {
      setActiveTab("buildings");
      setSelectedType('buildings');
    }
  }, [isCreateMode, activeTab, setActiveTab, setSelectedType]);


  const handleTabChange = useCallback((tab: FacilityType) => {
    setActiveTab(tab);
    setSelectedType(tab);

    if (tab === 'facilities') setIsCreateMode(false);
  }, [setSelectedType]);

  const handleButtonClick = useCallback(() => {
    setIsCreateMode(!isCreateMode);
  }, [isCreateMode]);

  const getButtonText = useCallback(() => {
    if (isCreateMode) {
      return "시설 목록";
    }

    return FACILITY_BUTTON_LABELS[activeTab];
  }, [isCreateMode, activeTab]);

  const renderCreateForm = useCallback(() => {
    switch (activeTab) {
      case 'facilities':
      case 'buildings':
      case 'stations':
        return (
          <FacilityForm
            facilityType={activeTab === 'facilities' ? 'buildings' : activeTab}
            onSaveSuccess={() => setIsCreateMode(false)}
          />
        );
      default:
        return (
          <div className="p-6 bg-white rounded-md border border-gray-200">
            <h3 className="text-lg font-medium mb-4">지원하지 않는 시설 유형</h3>
            <p>선택한 시설 유형의 추가 양식이 구현되지 않았습니다.</p>
          </div>
        );
    }
  }, [activeTab, setIsCreateMode]);



  const renderListComponent = useCallback(() => {
    return (
      <FacilityCardList initialType={activeTab}>
        {({ standardizedData, filterFacilities, actions, filterOptions, emptyStateAction, renderOptions }) => (
          <CardList dataResponse={standardizedData} filterData={filterFacilities} actions={actions} filterOptions={filterOptions} emptyStateAction={emptyStateAction} pageSize={8} renderOptions={renderOptions} />
        )}
      </FacilityCardList>
    );
  }, [activeTab]);

  return (
    <PageContainer title={isCreateMode ? "시설 추가" : "시설 관리"}>
      <FacilityLayout
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        showButton={activeTab !== 'facilities' || !isCreateMode}
        buttonText={getButtonText()}
        onButtonClick={handleButtonClick}
        hideFirstTab={isCreateMode}
      >
        {isCreateMode ? renderCreateForm() : renderListComponent()}
      </FacilityLayout>
    </PageContainer>
  );
};

export default FacilityManagement;