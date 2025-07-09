export interface Option {
    label: string;
    value: string;
}

export interface MultiSelectProps {
    options: Option[];
    value: string[];
    onChange: (value: string[]) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
    invalid?: boolean;
}
