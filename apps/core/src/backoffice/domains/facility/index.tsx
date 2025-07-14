
import React, { useState } from "react";
import { PageContainer } from "@/backoffice/common/view/layouts";
import Buildings from "@/backoffice/domains/buildings";
import Stations from "@/backoffice/domains/station";
import Factories from "@/backoffice/domains/factory";
import { Button } from "@plug/ui";
import { useNavigate } from "react-router-dom";

const FacilityManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("buildings");
  const navigate = useNavigate();

  const getButtonStyle = (tabName: string) => {
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

  const getAddButtonConfig = () => {
    const config = {
      buildings: {
        path: "/admin/buildings/add",
        text: "건물 추가"
      },
      stations: {
        path: "/admin/stations/add",
        text: "역사 추가"
      },
      factories: {
        path: "/admin/factories/add",
        text: "공장 추가"
      }
    };

    return config[activeTab as keyof typeof config];
  };

  const handleAddClick = () => {
    const config = getAddButtonConfig();
    navigate(config.path);
  };

  const BuildingIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01" />
      <path d="M16 6h.01" />
      <path d="M12 6h.01" />
      <path d="M12 10h.01" />
      <path d="M12 14h.01" />
      <path d="M16 10h.01" />
      <path d="M16 14h.01" />
      <path d="M8 10h.01" />
      <path d="M8 14h.01" />
    </svg>
  );

  const StationIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="16" height="16" x="4" y="3" rx="2" />
      <path d="M4 11h16" />
      <path d="M12 3v8" />
      <path d="m8 19-2 3" />
      <path d="m18 22-2-3" />
      <path d="M8 15h.01" />
      <path d="M16 15h.01" />
    </svg>
  );

  const FactoryIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 16h.01" />
      <path d="M16 16h.01" />
      <path d="M3 19a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5a.5.5 0 0 0-.769-.422l-4.462 2.844A.5.5 0 0 1 15 10.5v-2a.5.5 0 0 0-.769-.422L9.77 10.922A.5.5 0 0 1 9 10.5V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z" />
      <path d="M8 16h.01" />
    </svg>
  );

  return (
    <PageContainer title="시설 관리">
      <div className="flex flex-row items-center justify-between mb-6">
        <div style={{ marginBottom: '20px', display: 'flex' }}>
          <button
            onClick={() => setActiveTab('buildings')}
            style={getButtonStyle('buildings')}
          >
            <BuildingIcon /> 건물
          </button>
          <button
            onClick={() => setActiveTab('stations')}
            style={getButtonStyle('stations')}
          >
            <StationIcon /> 역사
          </button>
          <button
            onClick={() => setActiveTab('factories')}
            style={getButtonStyle('factories')}
          >
            <FactoryIcon /> 공장
          </button>
        </div>

        <div className="flex gap-2">
          <Button
            variant="default"
            onClick={handleAddClick}
            className={`rounded-sm`}
          >
            {getAddButtonConfig().text}
          </Button>
        </div>
      </div>

      <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: '#fff' }}>
        {activeTab === 'buildings' && <Buildings />}
        {activeTab === 'stations' && <Stations />}
        {activeTab === 'factories' && <Factories />}
      </div>
    </PageContainer>
  );
};

export default FacilityManagement;