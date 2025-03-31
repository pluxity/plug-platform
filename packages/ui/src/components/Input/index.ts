import { InputPassword } from "./InputPassword";
import { InputText } from "./InputText";
import { InputLabel } from "./InputLabel";
import { InputHelperText } from "./InputHelperText";
import { InputBox } from "./InputBox";

const Input = () => null;
Input.Text = InputText;
Input.Password = InputPassword;
Input.Label = InputLabel;
Input.HelperText = InputHelperText;
Input.Box = InputBox;

export default Input;
export type { InputProps } from './Input';