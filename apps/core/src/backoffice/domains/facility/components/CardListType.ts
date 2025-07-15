import { ReactNode } from "react";

export interface FacilityItem {
  id: number;
  name: string;
  code: string;
  description?: string;
  thumbnail?: {
    url?: string;
  };
  type?: string;
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface SortOptions {
  field: keyof FacilityItem;
  direction: 'asc' | 'desc';
}

export interface StandardizedResponse<T extends FacilityItem> {
  data: T[];
  isLoading: boolean;
  error: Error | null;
  //eslint-disable-next-line
  mutate: () => Promise<any>;
}

export interface FacilityCardActions<T extends FacilityItem> {
  onView: (item: T) => void;
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
}

export interface FacilityCardRenderOptions<T extends FacilityItem> {
  getCardImage?: (item: T) => ReactNode;
  getCardContent?: (item: T) => ReactNode;
  getCardColor?: (item: T) => string;
  getInitial?: (item: T) => string;
}

export interface FacilityFilterOptions {
  searchPlaceholder?: string;
  searchFields?: string[];
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  sortOptions?: SortOptions;
  onSortChange?: (options: SortOptions) => void;
  typeFilter?: string;
  onTypeFilterChange?: (type: string) => void;
  additionalFilters?: Array<{
    key: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    options: Array<{ label: string; value: string }>;
  }>;
}

export interface FacilityCardListProps<T extends FacilityItem> {
  dataResponse: StandardizedResponse<T>;
  filterData?: (items: T[], searchQuery: string) => T[];
  refreshData?: () => Promise<void>;
  renderOptions?: FacilityCardRenderOptions<T>;
  pageSize?: number;
  actions: FacilityCardActions<T>;
  filterOptions?: FacilityFilterOptions;
  emptyStateAction?: {
    label: string;
    onClick: () => void;
  };
}