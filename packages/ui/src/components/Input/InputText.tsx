import * as React from "react";

import { Input, InputProps } from './Input';

const InputText = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  return <Input type="text" ref={ref} {...props} />;
});

InputText.displayName = 'InputText';

export { InputText };


