import { Input } from './Input';
import { InputProps } from "./Input.types";
import { forwardRef } from 'react';

const InputText = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  return (
    <Input type="text" ref={ref} {...props} />
  );
});

InputText.displayName = 'InputText';

export { InputText };