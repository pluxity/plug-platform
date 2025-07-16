import React, { useState } from "react";
import { PageContainer } from "@/backoffice/common/view/layouts";
import { FacilityLayout, FacilityTabLayout } from "./components/FacilityTabLayout";
import { FacilityCardList } from "@/backoffice/domains/facility/components/cardList/variants/FacilityCardList";
import { BuildingCardList } from "@/backoffice/domains/facility/components/cardList/variants/BuildingCardList";
import { BuildingForm } from "./buildings/BuildingForm";

const FacilityManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FacilityTabLayout>("facilities");
  const [isCreateMode, setIsCreateMode] = useState(false);

  const handleTabChange = (tab: FacilityTabLayout) => {
    setActiveTab(tab);
    if (tab === 'facilities') {
      setIsCreateMode(false);
    }
  };

  const handleButtonClick = () => {
    setIsCreateMode(!isCreateMode);
  };

  const getButtonText = () => {
    if (isCreateMode) {
      return "시설 목록";
    }

    const buttonTexts = {
      facilities: "시설 추가",
      buildings: "건물 추가",
      stations: "역사 추가",
      factories: "공장 추가"
    };

    return buttonTexts[activeTab];
  };

  const renderCreateForm = () => {
    switch (activeTab) {
      case 'facilities':
        return (setActiveTab("buildings"))
      case 'buildings':
        return <BuildingForm onSaveSuccess={() => setIsCreateMode(false)} />;
      case 'stations':
        return (
          <div className="p-6 bg-white rounded-md border border-gray-200">
            <h3 className="text-lg font-medium mb-4">역사 추가 양식</h3>
            <p>역사 추가 양식은 현재 개발 중입니다.</p>
          </div>
        );
      case 'factories':
        return (
          <div className="p-6 bg-white rounded-md border border-gray-200">
            <h3 className="text-lg font-medium mb-4">공장 추가 양식</h3>
            <p>공장 추가 양식은 현재 개발 중입니다.</p>
          </div>
        );
      default:
        return null;
    }
  };

  const renderListComponent = () => {
    switch (activeTab) {
      case 'facilities':
        return <FacilityCardList />;
      case 'buildings':
        return <BuildingCardList />;
      case 'stations':
        return <BuildingCardList />;
      case 'factories':
        return <BuildingCardList />;
      default:
        return <FacilityCardList />;
    }
  };

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