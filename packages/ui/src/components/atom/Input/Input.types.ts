export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: boolean;
    icon?: 'info' | 'none';
    type?: string;
    ariaLabel?: string;
    disabled?: boolean;
    placeholder?: string;
    className?: string;
}