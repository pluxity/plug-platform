import * as React from "react";
import {useState} from "react";
import {InputText} from "./InputText";
import { cn } from "../../utils/classname";

export interface ListProps extends React.ComponentProps<'ul'> {
    invalid?: boolean;
    disabled?: boolean;
    className?: string;
}

const InputList = React.forwardRef<HTMLUListElement, ListProps>(({
    invalid = false,
    disabled = false,
    className,
    children,
    ...props
  }, ref) => {
    
    const [selected, setSelected] = useState("");
    const handleClick = (value: string) => {
      setSelected(prev => (prev === value ? "" : value));
    }

    const listStyle = 'inline-flex flex-col gap-1 p-0.5 border border-1 rounded-xs overflow-y-auto min-h-41 max-h-41 min-w-55';
    const invalidStyle = invalid === true ? 'border-red-600 text-red-500' : 'border-gray-400';
    const disabledStyle = disabled === true ? 'cursor-not-allowed text-gray-300 border-gray-300 bg-gray-200' : '';

    const listItemControl = React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        const element = child as React.ReactElement<ListItemsProps>;
        const value = element.props.value || "";

        return React.cloneElement(element, {
          ...(element.props as any),
          disabled: disabled,
          invalid: invalid,
          selected: selected === value,
          onClick: () => handleClick(value),
          } as any);
      }
      return child;
    });

    return (
      <ul 
        className={cn(
        listStyle,
        invalidStyle,
        disabledStyle,
        className,
      )} 
        role="listbox"
        ref={ref}
        {...props}
      >        
        {listItemControl}
      </ul>
    );
  });

export interface ListItemsProps extends React.ComponentProps<'li'> {
  selected?: boolean;
  invalid?: boolean;
  disabled?: boolean;
  value?: string;
  className?: string;
}

const InputListItem = React.forwardRef<HTMLLIElement, ListItemsProps>(({
  selected = false,
  invalid = false,
  disabled = false,
  value,
  className,
  children,
  onClick,
  ...props
}, ref) => {

  const listItemStyle = "px-2 py-0.5";
  const selectedStyle = selected ? "bg-blue-200" : "hover:bg-gray-200";
  const listTextStyle = invalid && selected ? "text-red-600" : selected ? "text-blue-500" : "";

return (
    <li
        className={cn(
            listItemStyle,
            selectedStyle,
            className,
        )} 
        onClick={onClick}
        aria-selected={selected}
        aria-disabled={disabled}
        role="option"
        ref={ref}
        {...props}
        >        
        
        <InputText 
          type="text" 
          value={value} 
          invalid={invalid} 
          disabled={disabled} 
          readOnly
          className={listTextStyle}
          />
    </li>
);
});

export {InputList, InputListItem};


