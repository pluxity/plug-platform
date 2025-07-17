import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@plug/api-hooks";
import { useBuildingsSWR } from "@plug/common-services";
import { CardList } from "@/backoffice/domains/facility/components/cardList/CardList";
import { FacilityItem } from "@/backoffice/domains/facility/components/cardList/CardListType";

export const BuildingCardList: React.FC = () => {
  const navigate = useNavigate();
  const buildingsResponse = useBuildingsSWR();
  const [localSearchQuery, setLocalSearchQuery] = useState("");

  const standardizedData = useMemo(() => {
    return {
      data: buildingsResponse.data?.map(building => ({
        id: building.facility.id,
        name: building.facility.name,
        code: building.facility.code,
        description: building.facility.description,
        thumbnail: building.facility.thumbnail
      } as FacilityItem)) || [],
      isLoading: buildingsResponse.isLoading,
      error: buildingsResponse.error,
      mutate: async () => {
        return await buildingsResponse.mutate();
      }
    };
  }, [buildingsResponse.data, buildingsResponse.isLoading, buildingsResponse.error]);

  const handleViewBuilding = (item: FacilityItem) => {
    navigate(`/admin/building/${item.id}`);
  };

  const handleEditBuilding = (item: FacilityItem) => {
    navigate(`/admin/building/${item.id}?mode=edit`);
  };

  const handleDeleteBuilding = async (item: FacilityItem) => {
    if (confirm("해당 빌딩을 삭제하시겠습니까?")) {
      try {
        await api.delete(`buildings/${item.id}`);
        await buildingsResponse.mutate();
      } catch (err) {
        console.error("빌딩 삭제 오류:", err);
        alert("빌딩을 삭제하는 중 오류가 발생했습니다.");
      }
    }
  };

  const handleAddBuilding = () => {
    navigate("/admin/building/add");
  };

  const filterBuildings = (items: FacilityItem[], query: string) => {
    if (!query || !items || items.length === 0) return items || [];

    const normalizedQuery = query
      .toLowerCase()
      .normalize('NFC')
      .trim();
    
    if (normalizedQuery === '') return items;

    return items.filter((item) => {

      const nameMatch = item.name && 
        item.name.toLowerCase().normalize('NFC').includes(normalizedQuery);

      const codeMatch = item.code && 
        item.code.toLowerCase().normalize('NFC').includes(normalizedQuery);

      const descriptionMatch = item.description && 
        item.description.toLowerCase().normalize('NFC').includes(normalizedQuery);
      
      return nameMatch || codeMatch || descriptionMatch;
    });
  };

  const handleSearchChange = (query: string) => {
    setLocalSearchQuery(query);
  };
  
  return (
    <CardList<FacilityItem>
      dataResponse={standardizedData}
      filterData={filterBuildings}
      actions={{
        onView: handleViewBuilding,
        onEdit: handleEditBuilding,
        onDelete: handleDeleteBuilding
      }}
      filterOptions={{
        searchPlaceholder: "건물 이름, 코드 또는 설명으로 검색",
        searchFields: ["name", "code", "description"],
        onSearchChange: handleSearchChange,
        searchValue: localSearchQuery
      }}
      emptyStateAction={{
        label: "새 건물 추가",
        onClick: handleAddBuilding
      }}
      pageSize={8}
    />
  );
};