import React, { createContext, useContext, useState, ChangeEvent } from 'react';
import { FormProps, FormContextType, FormItemProps } from './Form.types';
import { cn } from "../../utils/classname";

const FormContext = createContext<FormContextType | undefined>(undefined);

const Form = ({ 
  children, 
  onSubmit 
}: FormProps) => {

  const [formValues, setFormValues] = useState<Record<string, string>>({});

  const setFieldValue = (name: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(formValues);
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormContext value={{ values: formValues, setFieldValue }}>
        {children}
      </FormContext>
    </form>
  );
};

const FormItem = ({ 
  name, 
  children, 
  label, 
  required = false
}: FormItemProps) => {
  const formContext = useContext(FormContext);
  if (!formContext) {
    throw new Error('Form 컴포넌트 안에 있어야 합니다.');
  }

  const { values, setFieldValue } = formContext;

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFieldValue(name, event.target.value);
  };

  if (!React.isValidElement(children)) {
    throw new Error('children은 유효한 React 엘리먼트여야 합니다.');
  }


  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const childElement = React.cloneElement(children as React.ReactElement<any>, {
    value: values[name] || '',
    onChange: handleChange,
    required: required,
  });

  return (
    <div className={cn('flex items-center mb-4')}>
      {label && (
        <label
          htmlFor={name}
          className={cn('form-label mr-2 block text-sm font-medium text-gray-700')}
        >
          {label}
          {required && <span className={cn('text-red-500')}>*</span>}
        </label>
      )}
      {childElement}
    </div>
  );
};

Form.displayName = 'Form';
FormItem.displayName = 'FormItem';

export { Form, FormItem };