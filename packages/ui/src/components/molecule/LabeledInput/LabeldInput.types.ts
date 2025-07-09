export interface LabeledInputProps {
    className?: string;
    label: string;
    value: string;
    error?: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
}