export interface InputProps extends React.ComponentProps<'input'> {
    ariaLabel?: string;
    invalid?: boolean;
    iconPosition?: 'leading' | 'trailing';
    iconSvg?: string | React.ComponentType<React.SVGProps<SVGSVGElement>>;
    renderIcon?: (props: {iconColor: string, isFocused: boolean}) => React.ReactNode;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

  export interface InputHelperTextProps extends React.ComponentProps<'p'> {
    error?: boolean;
  }
