import { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive';
  size?: 'small' | 'medium' | 'large';
  className?: string;
  isLoading?: boolean;
}

const Button = ({ 
  variant = 'primary',
  size = 'medium',
  className,
  children,
  isLoading = false,
  ...props 
}: ButtonProps) => {

  // 공통 버튼 스타일
  const buttonStyle = 'flex justify-center gap-2 items-center px-4 py-2 rounded font-semibold transition-colors duration-200';

  // variant 스타일 정의
  const variantStyle = {
    primary: 'bg-primary-500 hover:bg-primary-500/90',
    secondary: 'bg-secondary-500 hover:bg-secondary-500/80',
    destructive: 'bg-destructive-500 hover:bg-destructive-700',
  }[variant];

  // size 스타일 정의
  const sizeStyle = {
    small: 'text-sm py-1 px-2',
    medium: 'text-base py-2 px-4',
    large: 'text-lg py-3 px-6',
  }[size];

  return (
    <button
      className={clsx(
        buttonStyle,
        variantStyle,
        sizeStyle,
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          {children}
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
