import { Textarea } from "./Textarea";
import { TextareaHelperText } from "./TextareaHelperText";
import { TextareaBox } from "./TextareaBox";
import * as React from "react";

interface TextareaComponentType extends React.ForwardRefExoticComponent<any> {
  HelperText: typeof TextareaHelperText;
  Box: typeof TextareaBox;
}

const TextareaComponent = Textarea as unknown as TextareaComponentType;
TextareaComponent.HelperText = TextareaHelperText;
TextareaComponent.Box = TextareaBox;

export default TextareaComponent;