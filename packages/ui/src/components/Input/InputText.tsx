import { Input } from './Input';
import { InputProps } from "./Input.types";

const InputText = ({
  ref,
  ...props
}: InputProps) => {
  return (
    <Input type="text" ref={ref} {...props} />
  )
}
  
InputText.displayName = 'InputText';

export { InputText };


