import { InputHTMLAttributes } from 'react';
import clsx from 'clsx';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: 'small' | 'medium' | 'large';
  error?: boolean;
  className?: string;
}

const Input = ({ size = 'medium', error = false, className, ...props }: InputProps) => {
  const baseStyle = 'border rounded px-3 py-2 outline-none';
  const sizeStyle = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  }[size];

  const errorStyle = error ? 'border-red-500' : 'border-gray-300';

  return (
    <input
      className={clsx(baseStyle, sizeStyle, errorStyle, className)}
      {...props}
    />
  );
};

export default Input;
