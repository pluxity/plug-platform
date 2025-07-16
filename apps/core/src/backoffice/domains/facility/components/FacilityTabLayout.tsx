import React from "react";
import { Building, TrainFront, Warehouse, Factory } from "lucide-react";
import { Button } from "@plug/ui";

export type FacilityTabLayout = 'facilities' | 'buildings' | 'stations' | 'factories';

interface FacilityLayoutProps {
  children: React.ReactNode;
  activeTab: FacilityTabLayout;
  setActiveTab: (tab: FacilityTabLayout) => void;
  showButton?: boolean;
  buttonText?: string;
  onButtonClick?: () => void;
  hideFirstTab?: boolean;
}

export const FacilityLayout: React.FC<FacilityLayoutProps> = ({
                                                                children,
                                                                activeTab,
                                                                setActiveTab,
                                                                showButton = true,
                                                                buttonText = "시설 추가",
                                                                onButtonClick,
                                                                hideFirstTab = false,
                                                              }) => {
  const getButtonStyle = (tabName: FacilityTabLayout) => {
    return {
      padding: '8px 16px',
      backgroundColor: activeTab === tabName ? '#3b82f6' : '#dbeafe',
      color: activeTab === tabName ? 'white' : 'black',
      border: 'none',
      marginRight: '10px',
      cursor: 'pointer',
      borderRadius: '4px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    };
  };

  return (
    <>
      <div className="flex flex-row items-center justify-between mb-6">
        <div style={{ display: 'flex' }}>
          {!hideFirstTab && (
            <button
              onClick={() => setActiveTab('facilities')}
              style={getButtonStyle('facilities')}
            >
              <Warehouse size={20} /> 시설 전체
            </button>
          )}
          <button
            onClick={() => setActiveTab('buildings')}
            style={getButtonStyle('buildings')}
          >
            <Building size={20} /> 건물
          </button>
          <button
            onClick={() => setActiveTab('stations')}
            style={getButtonStyle('stations')}
          >
            <TrainFront size={20} /> 역사
          </button>
          <button
            onClick={() => setActiveTab('factories')}
            style={getButtonStyle('factories')}
          >
            <Factory size={20} /> 공장
          </button>
        </div>

        {showButton && (
          <div className="flex gap-2">
            <Button
              variant="default"
              onClick={onButtonClick}
              className={`rounded-sm`}
            >
              {buttonText}
            </Button>
          </div>
        )}
      </div>

      <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: '#fff' }}>
        {children}
      </div>
    </>
  );
};