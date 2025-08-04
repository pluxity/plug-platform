import { FacilityType, FACILITY_TYPE_LABELS } from "@/backoffice/domains/facility/store/FacilityListStore";
import { FacilityItem, SortOptions } from "@/backoffice/domains/facility/list/CardListType";

const FACILITY_COLORS: Record<string, string> = {
  'buildings': 'bg-blue-700',
  'stations': 'bg-emerald-500',
  'facilities': 'bg-gray-700'
};

export const mapFacilityData = (
  facilities: FacilityItem[],
  type: FacilityType
): FacilityItem[] => {
  if (!facilities) return [];

  return facilities.map((facility) => ({
    id: facility.id,
    name: facility.name,
    code: facility.code,
    description: facility.description,
    thumbnail: facility.thumbnail,
    type,
    createdAt: facility.createdAt,
    createdBy: facility.createdBy,
    updatedAt: facility.updatedAt,
    updatedBy: facility.updatedBy
  }));
};

export const sortFacilities = (
  facilities: FacilityItem[],
  sortOptions: SortOptions
): FacilityItem[] => {
  const { field, direction } = sortOptions;
  const directionMultiplier = direction === 'asc' ? 1 : -1;

  return [...facilities].sort((a, b) => {
    const fieldA = a[field] || '';
    const fieldB = b[field] || '';

    if (field === 'createdAt' || field === 'updatedAt') {
      const dateA = fieldA ? new Date(fieldA as string).getTime() : 0;
      const dateB = fieldB ? new Date(fieldB as string).getTime() : 0;
      return (dateA - dateB) * directionMultiplier;
    }

    if (typeof fieldA === 'string' && typeof fieldB === 'string') {
      return fieldA.localeCompare(fieldB) * directionMultiplier;
    }

    if (fieldA < fieldB) return -1 * directionMultiplier;
    if (fieldA > fieldB) return 1 * directionMultiplier;
    return 0;
  });
};

export const filterFacilities = (items: FacilityItem[], query: string): FacilityItem[] => {
  if (!query || !items?.length) return items || [];

  const normalizedQuery = query
    .toLowerCase()
    .normalize('NFC')
    .trim();

  if (normalizedQuery === '') return items;

  const searchFields = ["name", "code", "description", "createdBy"];

  return items.filter((item) => {
    return searchFields.some(field => {
      const value = item[field as keyof FacilityItem];
      return value && String(value).toLowerCase().normalize('NFC').includes(normalizedQuery);
    });
  });
};


export const getCardContentUtils = {
  getCardColor: (item: FacilityItem): string => {
    return FACILITY_COLORS[item.type || 'facilities'] || FACILITY_COLORS.facilities;
  },

  getInitial: (item: FacilityItem): string => {
    return item.name ? item.name.charAt(0) : "?";
  },

  renderCardContent: (item: FacilityItem) => (
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-lg font-semibold truncate">{item.name}</h3>
          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">{item.code}</span>
          {item.type && (
            <span className={`px-2 py-1 text-white text-xs rounded-full ${
              item.type === 'buildings' ? 'bg-blue-500' :
                item.type === 'stations' ? 'bg-emerald-500' : 'bg-gray-500'
            }`}>
            {FACILITY_TYPE_LABELS[item.type as FacilityType] || item.type}
            </span>
          )}
        </div>
      <p className="text-gray-600 text-sm line-clamp-2 mt-2">
        {item.description || "-"}
      </p>
    </div>
  )
};