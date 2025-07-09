export interface SearchFormProps {
    value: string;
    onChange: (value: string) => void;
    onSelect: (item: string) => void;
    placeholder?: string;
    className?: string;
    inputClassName?: string;
    listClassName?: string;
    itemClassName?: string;
    clearButtonClassName?: string;
    onSearch?: (search: string) => void;
    searchResult?: string[];
  }