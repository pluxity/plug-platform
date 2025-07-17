import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@plug/api-hooks";
import { useFacilitiesAllSWR } from "@plug/common-services";
import { CardList } from "@/backoffice/domains/facility/components/cardList/CardList";
import { FacilityItem, SortOptions } from "@/backoffice/domains/facility/components/cardList/CardListType";

export const FacilityCardList: React.FC = () => {
  const navigate = useNavigate();
  const facilitiesResponse = useFacilitiesAllSWR();
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const [sortOptions, setSortOptions] = useState<SortOptions>({
    field: 'createdBy',
    direction: 'asc'
  });
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const standardizedData = useMemo(() => {
    if (!facilitiesResponse.data) {
      return {
        data: [],
        isLoading: facilitiesResponse.isLoading,
        error: facilitiesResponse.error,
        mutate: async () => await facilitiesResponse.mutate()
      };
    }

    let allFacilities: FacilityItem[] = [];

    if (facilitiesResponse.data.building) {
      const buildingItems = facilitiesResponse.data.building.map(facility => ({
        id: facility.id,
        name: facility.name,
        code: facility.code,
        description: facility.description,
        thumbnail: facility.thumbnail,
        type: 'building',
        createdAt: facility.createdAt,
        createdBy: facility.createdBy,
        updatedAt: facility.updatedAt,
        updatedBy: facility.updatedBy
      }));
      allFacilities = [...allFacilities, ...buildingItems];
    }

    if (facilitiesResponse.data.panorama) {
      const panoramaItems = facilitiesResponse.data.panorama.map(facility => ({
        id: facility.id,
        name: facility.name,
        code: facility.code,
        description: facility.description,
        thumbnail: facility.thumbnail,
        type: 'panorama',
        createdAt: facility.createdAt,
        createdBy: facility.createdBy,
        updatedAt: facility.updatedAt,
        updatedBy: facility.updatedBy
      }));
      allFacilities = [...allFacilities, ...panoramaItems];
    }

    if (facilitiesResponse.data.station) {
      const stationItems = facilitiesResponse.data.station.map(facility => ({
        id: facility.id,
        name: facility.name,
        code: facility.code,
        description: facility.description,
        thumbnail: facility.thumbnail,
        type: 'station',
        createdAt: facility.createdAt,
        createdBy: facility.createdBy,
        updatedAt: facility.updatedAt,
        updatedBy: facility.updatedBy
      }));
      allFacilities = [...allFacilities, ...stationItems];
    }

    let filteredData = allFacilities;

    if (typeFilter !== 'all') {
      filteredData = filteredData.filter(item => item.type === typeFilter);
    }

    filteredData.sort((a, b) => {
      const fieldA = a[sortOptions.field] || '';
      const fieldB = b[sortOptions.field] || '';
      

      if (sortOptions.field === 'createdAt' || sortOptions.field === 'updatedAt') {
        const dateA = fieldA ? new Date(fieldA as string).getTime() : 0;
        const dateB = fieldB ? new Date(fieldB as string).getTime() : 0;
        return sortOptions.direction === 'asc' ? dateA - dateB : dateB - dateA;
      }

      if (fieldA < fieldB) return sortOptions.direction === 'asc' ? -1 : 1;
      if (fieldA > fieldB) return sortOptions.direction === 'asc' ? 1 : -1;
      return 0;
    });
    
    return {
      data: filteredData,
      isLoading: facilitiesResponse.isLoading,
      error: facilitiesResponse.error,
      mutate: async () => await facilitiesResponse.mutate()
    };
  }, [facilitiesResponse.data, facilitiesResponse.isLoading, facilitiesResponse.error, sortOptions, typeFilter]);

  const handleViewFacility = (item: FacilityItem) => {
    switch (item.type) {
      case 'building':
        navigate(`/admin/building/${item.id}`);
        break;
      case 'panorama':
        navigate(`/admin/panorama/${item.id}`);
        break;
      case 'station':
        navigate(`/admin/station/${item.id}`);
        break;
      default:
        navigate(`/admin/facility/${item.id}`);
    }
  };

  const handleEditFacility = (item: FacilityItem) => {
    switch (item.type) {
      case 'building':
        navigate(`/admin/building/${item.id}?mode=edit`);
        break;
      case 'panorama':
        navigate(`/admin/panorama/${item.id}?mode=edit`);
        break;
      case 'station':
        navigate(`/admin/station/${item.id}?mode=edit`);
        break;
      default:
        navigate(`/admin/facility/${item.id}?mode=edit`);
    }
  };

  const handleDeleteFacility = async (item: FacilityItem) => {
    let endpoint = '';
    let confirmMessage = '';
    
    switch (item.type) {
      case 'building':
        endpoint = `building/${item.id}`;
        confirmMessage = "해당 빌딩을 삭제하시겠습니까?";
        break;
      case 'panorama':
        endpoint = `panorama/${item.id}`;
        confirmMessage = "해당 파노라마를 삭제하시겠습니까?";
        break;
      case 'station':
        endpoint = `station/${item.id}`;
        confirmMessage = "해당 역사를 삭제하시겠습니까?";
        break;
      default:
        endpoint = `facility/${item.id}`;
        confirmMessage = "해당 시설을 삭제하시겠습니까?";
    }

    if (confirm(confirmMessage)) {
      try {
        await api.delete(endpoint);
        await facilitiesResponse.mutate();
      } catch (err) {
        console.error(`${item.type} 삭제 오류:`, err);
        alert(`${item.type} 삭제 중 오류가 발생했습니다.`);
      }
    }
  };

  const handleAddFacility = () => {
    switch (typeFilter) {
      case 'building':
        navigate("/admin/building/add");
        break;
      case 'panorama':
        navigate("/admin/panorama/add");
        break;
      case 'station':
        navigate("/admin/station/add");
        break;
      default:
        navigate("/admin/facility/select-type");
    }
  };

  const filterFacilities = (items: FacilityItem[], query: string) => {
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
      
      const createdByMatch = item.createdBy && 
        item.createdBy.toLowerCase().normalize('NFC').includes(normalizedQuery);
      
      return nameMatch || codeMatch || descriptionMatch || createdByMatch;
    });
  };

  const handleSearchChange = (query: string) => {
    setLocalSearchQuery(query);
  };
  
  const handleSortOptionChange = (value: string) => {
    const [field, direction] = value.split('_');
    setSortOptions({
      field: field as keyof FacilityItem,
      direction: direction as 'asc' | 'desc'
    });
  };

  const typeFilterOptions = [
    { label: '전체', value: 'all' },
    { label: '건물', value: 'building' },
    { label: '파노라마', value: 'panorama' },
    { label: '역사', value: 'station' }
  ];
  
  const sortOptionsList = [
    { label: '생성자 (오름차순)', value: 'createdBy_asc' },
    { label: '생성자 (내림차순)', value: 'createdBy_desc' },
    { label: '생성일 (최신순)', value: 'createdAt_desc' },
    { label: '생성일 (오래된순)', value: 'createdAt_asc' },
    { label: '이름 (가나다순)', value: 'name_asc' },
    { label: '이름 (역순)', value: 'name_desc' }
  ];

  const getAddButtonLabel = () => {
    switch (typeFilter) {
      case 'building':
        return '새 건물 추가';
      case 'panorama':
        return '새 파노라마 추가';
      case 'station':
        return '새 역사 추가';
      default:
        return '새 시설 추가';
    }
  };

  return (
      <CardList<FacilityItem>
        dataResponse={standardizedData}
        filterData={filterFacilities}
        actions={{
          onView: handleViewFacility,
          onEdit: handleEditFacility,
          onDelete: handleDeleteFacility
        }}
        filterOptions={{
          searchPlaceholder: "시설 이름, 코드, 설명 또는 생성자로 검색",
          searchFields: ["name", "code", "description", "createdBy"],
          onSearchChange: handleSearchChange,
          searchValue: localSearchQuery,
          additionalFilters: [
            {
              key: "facilityType",
              placeholder: "시설 유형",
              value: typeFilter,
              onChange: setTypeFilter,
              options: typeFilterOptions
            },
            {
              key: "sortOption",
              placeholder: "정렬 방식",
              value: `${sortOptions.field}_${sortOptions.direction}`,
              onChange: handleSortOptionChange,
              options: sortOptionsList
            }
          ]
        }}
        emptyStateAction={{
          label: getAddButtonLabel(),
          onClick: handleAddFacility
        }}
        pageSize={8}
        renderOptions={{
          getCardColor: (item) => {
            switch (item.type) {
              case 'building':
                return 'bg-blue-700';
              case 'panorama':
                return 'bg-purple-700';
              case 'station':
                return 'bg-emerald-700';
              default:
                return 'bg-gray-700';
            }
          },
          getCardContent: (item) => (
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold truncate">
                  {item.name}
                </h3>
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  {item.code}
                </span>
                {item.type && (
                  <span className={`px-2 py-1 text-white text-xs rounded-full ${
                    item.type === 'building' ? 'bg-blue-500' : 
                    item.type === 'panorama' ? 'bg-purple-500' : 
                    item.type === 'station' ? 'bg-emerald-500' : 'bg-gray-500'
                  }`}>
                    {item.type === 'building' ? '건물' : 
                    item.type === 'panorama' ? '파노라마' : 
                    item.type === 'station' ? '역사' : '시설'}
                  </span>
                )}
              </div>
              <p className="text-gray-600 text-sm line-clamp-2 mt-2">
                {item.description || "-"}
              </p>
            </div>
          )
        }}
      />
  );
};