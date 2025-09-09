import { cn } from "../../../utils/utils";
import { TextareaProps } from "./Textarea.types";

function Textarea({ className, error, placeholder = "텍스트를 입력하세요", ...props }: TextareaProps) {
  return (
    <div className={cn(
      "w-56 h-20 min-w-24 p-2.5 bg-white rounded-sm outline outline-1 outline-offset-[-1px] outline-secondary-500 inline-flex justify-start items-start",
      error && "outline-red-700",
      props.disabled && "bg-gray-200 outline-neutral-300",
      className
    )}>
      <textarea
        data-slot="textarea"
        placeholder={placeholder}
        className={cn(
          "w-full h-full bg-transparent resize-none outline-none text-sm font-medium font-['SUIT']",
          "placeholder:text-neutral-300",
          error && "text-red-700 placeholder:text-red-700",
          !error && !props.disabled && "focus:text-zinc-700",
          props.disabled && "text-neutral-300 cursor-not-allowed"
        )}
        {...props}
      />
    </div>
  )
}

Textarea.displayName = "Textarea";
export { Textarea }