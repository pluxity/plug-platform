import React from "react";
import { FacilityItem, StandardizedResponse } from "@/backoffice/domains/facility/components/CardListType";
import { FacilityType } from "@/backoffice/domains/facility/store/FacilityListStore";

export interface FacilityAction {
  onView: (item: FacilityItem) => void;
  onEdit: (item: FacilityItem) => void;
  onDelete: (item: FacilityItem) => void;
}

export interface FilterOption {
  key: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ label: string; value: string }>;
}

export interface FilterOptions {
  searchPlaceholder: string;
  searchFields: string[];
  searchValue: string;
  onSearchChange: (value: string) => void;
  additionalFilters: FilterOption[];
}

export interface RenderOptions {
  getCardColor: (item: FacilityItem) => string;
  getInitial: (item: FacilityItem) => string;
  getCardContent: (item: FacilityItem) => React.ReactNode;
  getCardImage?: (item: FacilityItem) => React.ReactNode;
}

export interface EmptyStateAction {
  label: string;
  onClick: () => void;
}

export interface AdapterChildrenProps {
  standardizedData: StandardizedResponse<FacilityItem>;
  filterFacilities: (items: FacilityItem[], query: string) => FacilityItem[];
  actions: FacilityAction;
  filterOptions: FilterOptions;
  emptyStateAction: EmptyStateAction;
  renderOptions: RenderOptions;
}

export interface FacilityCardListProps {
  initialType: FacilityType;
  children: (props: AdapterChildrenProps) => React.ReactNode;
}