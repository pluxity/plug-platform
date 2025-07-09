export interface SelectOption {
  label: string;
  value: string;
}

export interface FilterSelect {
  key: string;
  placeholder?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
}

export interface FilterBarProps {
  selects: FilterSelect[];
  showSearchInput?: boolean;
  searchValue?: string;
  onSearch?: (value: string) => void;
  searchPlaceholder?: string;
  onSubmit?: () => void;
  className?: string;
}
