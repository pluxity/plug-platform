type SelectType = 'single' | 'multiple';
type SelectVariant = 'default' | 'error'; 


export interface SelectProps extends Omit<React.ComponentProps<'div'>, 'onChange'> {
    type?: SelectType;
    variant?: SelectVariant;
    disabled?: boolean;
    selected?: string[];
    onChange?: (values: string[]) => void;
    children? : React.ReactNode;
}

export interface SelectItemProps extends React.ComponentProps<'li'>{
    value: string;
}
