export interface SearchInputProps {
    buttonClassName?: string;
    className?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: () => void;
    placeholder?: string;
}