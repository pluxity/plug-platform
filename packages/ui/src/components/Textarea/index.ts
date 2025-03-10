import { Textarea as TextareaComponent } from "./Textarea";
import { TextareaHelperText } from "./TextareaHelperText";
import { TextareaBox } from "./TextareaBox";

type TextareaType = typeof TextareaComponent & {
  HelperText: typeof TextareaHelperText;
  Box: typeof TextareaBox;
};

const Textarea = TextareaComponent as TextareaType;
Textarea.HelperText = TextareaHelperText;
Textarea.Box = TextareaBox;

export default Textarea;