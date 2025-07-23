import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDeleteBuilding, useDeleteStation, useFacilitiesAllSWR } from "@plug/common-services";
import { FacilityItem, SortOptions } from "./CardListType";
import { FACILITY_TYPE_LABELS, FacilityType, useFacilityListStore, } from "@/backoffice/domains/facility/store/FacilityListStore";
import { filterFacilities, getCardContentUtils, mapFacilityData, sortFacilities, } from "@/backoffice/domains/facility/facilitiesUtil";
import { FacilityCardListProps } from "@/backoffice/domains/facility/types/facilities";
import { BUTTON_LABELS, CONFIRMATION_MESSAGES, SEARCH_FIELDS } from "@/backoffice/domains/facility/constants/facilities";

export const FacilityCardList: React.FC<FacilityCardListProps> = ({ initialType, children }) => {
  const navigate = useNavigate();
  const facilitiesResponse = useFacilitiesAllSWR();
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const [sortOptions, setSortOptions] = useState<SortOptions>({ field: "createdBy", direction: "asc" });
  const [typeFilter, setTypeFilter] = useState<FacilityType>(initialType);
  const [facilityToDelete, setFacilityToDelete] = useState<{id: number, type: FacilityType} | null>(null);

  const { selectedType, setSelectedType, setSelected, setPreviousRoute } = useFacilityListStore();

  const deleteBuildingHook = useDeleteBuilding(facilityToDelete?.type === "buildings" ? facilityToDelete.id : 0);
  const deleteStationHook = useDeleteStation(facilityToDelete?.type === "stations" ? facilityToDelete.id : 0);

  useEffect(() => {
    setTypeFilter(initialType);
    setSelectedType(initialType);
  }, [initialType, setSelectedType]);

  useEffect(() => {
    if (selectedType !== typeFilter) setTypeFilter(selectedType);
  }, [selectedType, typeFilter]);

  useEffect(() => {
    const performDelete = async () => {
      if (!facilityToDelete) return;
      try {
        if (facilityToDelete.type === "buildings") {
          await deleteBuildingHook.execute();
        } else if (facilityToDelete.type === "stations") {
          await deleteStationHook.execute();
        }
        await facilitiesResponse.mutate();
      } catch (err) {
        console.error(`${facilityToDelete.type} 삭제 오류:`, err);
        alert(`시설 삭제 중 오류가 발생했습니다.`);
      } finally {
        setFacilityToDelete(null);
      }
    };

    if (facilityToDelete) performDelete();
  }, [facilityToDelete, deleteBuildingHook, deleteStationHook, facilitiesResponse]);

  const handleTypeFilterChange = useCallback(
    (value: string) => {
      const type = value as FacilityType;
      setTypeFilter(type);
      setSelectedType(type);
    },
    [setSelectedType],
  );

  const standardizedData = useMemo(() => {
    if (!facilitiesResponse.data) {
      return {
        data: [],
        isLoading: facilitiesResponse.isLoading,
        error: facilitiesResponse.error,
        mutate: async () => await facilitiesResponse.mutate(),
      };
    }

    const buildingItems = mapFacilityData(
      facilitiesResponse.data.buildings || [], "buildings",
    );
    const stationItems = mapFacilityData(
      facilitiesResponse.data.stations || [], "stations",
    );
    let filteredData = [...buildingItems, ...stationItems];
    if (typeFilter !== "facilities") filteredData = filteredData.filter((item) => item.type === typeFilter);

    const sortedData = sortFacilities(filteredData, sortOptions);

    return {
      data: sortedData,
      isLoading: facilitiesResponse.isLoading,
      error: facilitiesResponse.error,
      mutate: async () => await facilitiesResponse.mutate(),
    };
  }, [facilitiesResponse, sortOptions, typeFilter]);

  const handleRouteChange = useCallback(
    (item: FacilityItem, queryParams?: string) => {
      setPreviousRoute("/admin/facility");
      setSelected(item.type as FacilityType, item.id.toString());
      const path = `/admin/facility/${item.id}${queryParams || ""}`;
      navigate(path);
    },
    [navigate, setSelected, setPreviousRoute],
  );

  const handleViewFacility = useCallback(
    (item: FacilityItem) => {
      handleRouteChange(item);
    },
    [handleRouteChange],
  );

  const handleEditFacility = useCallback(
    (item: FacilityItem) => {
      handleRouteChange(item, "?mode=edit");
    },
    [handleRouteChange],
  );

  const handleDeleteFacility = useCallback(
    async (item: FacilityItem) => {
      if (!item.type) return;
      const facilityType = item.type as FacilityType;
      const confirmMessage = CONFIRMATION_MESSAGES[facilityType];
      if (confirm(confirmMessage)) setFacilityToDelete({ id: item.id, type: facilityType });
    },
    [],
  );

  const handleAddFacility = useCallback(() => {
    setPreviousRoute("/admin/facility");
    setSelectedType(typeFilter);
    navigate("/admin/facility/add");
  }, [navigate, typeFilter, setSelectedType, setPreviousRoute]);

  const handleSearchChange = useCallback((query: string) => {
    setLocalSearchQuery(query);
  }, []);

  const handleSortOptionChange = useCallback((value: string) => {
    const [field, direction] = value.split("_");
    setSortOptions({
      field: field as keyof FacilityItem,
      direction: direction as "asc" | "desc",
    });
  }, []);

  const typeFilterOptions = useMemo(() => {
    return Object.entries(FACILITY_TYPE_LABELS).map(([value, label]) => ({ label, value}));
  }, []);

  const sortOptionsList = useMemo(
    () => [
      { label: "생성자 (오름차순)", value: "createdBy_asc" },
      { label: "생성자 (내림차순)", value: "createdBy_desc" },
      { label: "생성일 (최신순)", value: "createdAt_desc" },
      { label: "생성일 (오래된순)", value: "createdAt_asc" },
      { label: "이름 (가나다순)", value: "name_asc" },
      { label: "이름 (역순)", value: "name_desc" },
    ],
    [],
  );

  const getAddButtonLabel = useCallback((): string => {
    return BUTTON_LABELS[typeFilter];
  }, [typeFilter]);

  const getCardColor = useCallback(getCardContentUtils.getCardColor, []);
  const getInitial = useCallback(getCardContentUtils.getInitial, []);
  const renderCardContent = useCallback(getCardContentUtils.renderCardContent, []);

  return children({
    standardizedData,
    filterFacilities,
    actions: {
      onView: handleViewFacility,
      onEdit: handleEditFacility,
      onDelete: handleDeleteFacility,
    },
    filterOptions: {
      searchPlaceholder: "시설 이름, 코드, 설명 또는 생성자로 검색",
      searchFields: SEARCH_FIELDS,
      onSearchChange: handleSearchChange,
      searchValue: localSearchQuery || "",
      additionalFilters: [
        {
          key: "facilityType",
          placeholder: "시설 유형",
          value: typeFilter,
          onChange: handleTypeFilterChange,
          options: typeFilterOptions,
        },
        {
          key: "sortOption",
          placeholder: "정렬 방식",
          value: `${sortOptions.field}_${sortOptions.direction}`,
          onChange: handleSortOptionChange,
          options: sortOptionsList,
        },
      ],
    },
    emptyStateAction: {
      label: getAddButtonLabel(),
      onClick: handleAddFacility,
    },
    renderOptions: {
      getCardColor,
      getInitial,
      getCardContent: renderCardContent,
    },
  });
};