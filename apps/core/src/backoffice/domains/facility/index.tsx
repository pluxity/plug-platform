import React, { useState } from "react";
import { PageContainer } from "@/backoffice/common/view/layouts";
import { Button } from "@plug/ui";
import { useNavigate } from "react-router-dom";
import { Building, TrainFront, Warehouse, Factory } from "lucide-react";
import { BuildingCardList } from "@/backoffice/domains/facility/buildings";

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
        path: "/admin/building/add",
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

  return (
    <PageContainer title="시설 관리">
      <div className="flex flex-row items-center justify-between mb-6">
        <div style={{ display: 'flex' }}>
          <button
            onClick={() => setActiveTab('facility')}
            style={getButtonStyle('facility')}
          >
            <Warehouse size={20} /> 시설 전체
          </button>
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
        {activeTab === 'facility' && <BuildingCardList />}
        {activeTab === 'buildings' && <BuildingCardList />}
        {activeTab === 'stations' && <BuildingCardList />}
        {activeTab === 'factories' && <BuildingCardList />}
      </div>
    </PageContainer>
  );
};

export default FacilityManagement;