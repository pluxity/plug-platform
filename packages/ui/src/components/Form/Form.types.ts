import { ReactNode } from 'react';

export interface FormProps {
  children: ReactNode;
  onSubmit: (values: Record<string, string>) => void;
}

export interface FormContextType {
  values: Record<string, string>;
  setFieldValue: (name: string, value: string) => void;
}

export interface FormItemProps {
  name: string;
  validate?: (value: string) => boolean;
  label?: string; 
  required?: boolean;
  children: ReactNode;
}