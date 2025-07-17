import React, { useMemo, useState } from "react";
import { useStationsSWR } from "@plug/common-services";
import { useNavigate } from "react-router-dom";
import { FacilityItem } from "@/backoffice/domains/facility/components/cardList/CardListType";
import { api } from "@plug/api-hooks";
import { CardList } from "@/backoffice/domains/facility/components/cardList/CardList";

export const StationCardList: React.FC = () => {
  const navigate = useNavigate();
  const stationsResponse = useStationsSWR();
  const [localSearchQuery, setLocalSearchQuery] = useState("");

  const standardizedData = useMemo(() => {
    return {
      data: stationsResponse.data?.map(station => ({
        id: station.facility.id,
        name: station.facility.name,
        code: station.facility.code,
        description: station.facility.description,
        thumbnail: station.facility.thumbnail
      })) || [],
      isLoading: stationsResponse.isLoading,
      error: stationsResponse.error,
      mutate: async () => {
        return await stationsResponse.mutate();
      }
    }
  }, [stationsResponse.data, stationsResponse.isLoading, stationsResponse.error]);

  const handleViewStation = (item: FacilityItem) => {
    navigate(`/admin/station/${item.id}`);
  }

  const handleEditStation = (item: FacilityItem) => {
    navigate(`/admin/station/${item.id}?mode=edit`);
  }

  const handleDeleteStation = async (item: FacilityItem) => {
    if (confirm("해당 역사를 삭제하시겠습니까?")) {
      try {
        await api.delete(`stations/${item.id}`);
        await stationsResponse.mutate();
      } catch (err) {
        console.error("역사 삭제 오류:", err);
        alert("역사를 삭제하는 중 오류가 발생했습니다.");
      }
    }
  }

  const handleAddStation = () => {
    navigate("/admin/station/add");
  }

  const filterStations = (items: FacilityItem[], query: string) => {
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
    })
  }

  const handleSearchChange = (query: string) => {
    setLocalSearchQuery(query);
  }

  return (
    <CardList<FacilityItem>
      dataResponse={standardizedData}
      filterData={filterStations}
      actions={{
        onView: handleViewStation,
        onEdit: handleEditStation,
        onDelete: handleDeleteStation
      }}
      filterOptions={{
        searchPlaceholder: "역사 이름, 코드 또는 설명으로 검색",
        searchFields: ["name", "code", "description"],
        onSearchChange: handleSearchChange,
        searchValue: localSearchQuery
      }}
      emptyStateAction={{
      label: "새 역사 추가",
      onClick: handleAddStation
      }}
      pageSize={8}
    />
  )
}