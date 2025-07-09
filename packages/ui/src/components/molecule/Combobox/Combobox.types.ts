export interface ComboboxOption {
  value: string;
  label: string;
}

export interface ComboboxProps {
  options: ComboboxOption[];
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}
