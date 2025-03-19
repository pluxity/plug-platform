export interface SwitchProps {
    size?: 'small' | 'medium' | 'large';
    color?: 'primary' | 'secondary';
    label?: string;
    disabled?: boolean;
    defaultChecked?: boolean;
    onChange?: (checked: boolean) => void;
    checked?: boolean;
    className?: string;
}