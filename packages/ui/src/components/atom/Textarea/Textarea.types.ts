export interface TextareaProps extends React.ComponentProps<"textarea"> {
  className?: string;
  error?: boolean;
  placeholder?: string;
  disabled?: boolean;
}
