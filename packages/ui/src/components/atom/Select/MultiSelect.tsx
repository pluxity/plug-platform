import * as Popover from "@radix-ui/react-popover";
import { cn } from "../../../utils/utils";
import { MultiSelectProps } from "./MultiSelect.types";

const ChevronDownArrow = ({ className }: { className?: string }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M10.2848 5L11 5.75836L7 10L3 5.75836L3.71515 5L7 8.48329L10.2848 5Z"
      fill="currentColor"
    />
  </svg>
);

export const DeleteIcon = ({ onClick }: { onClick?: (e: React.MouseEvent) => void }) => (
  <div 
    data-property-1="delete" 
    className="w-3.5 h-3.5 relative cursor-pointer"
    onClick={onClick}
  >
    <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="7" cy="7.5" r="5" fill="#A9CBF6"/>
      <path d="M8.74264 5L9.44975 5.70711L5.20711 9.94975L4.5 9.24264L8.74264 5Z" fill="#6B7280"/>
      <path d="M9.44975 9.24264L8.74264 9.94975L4.5 5.70711L5.20711 5L9.44975 9.24264Z" fill="#6B7280"/>
    </svg>
  </div>
);

function MultiSelect ({ 
  options, 
  value, 
  onChange, 
  placeholder = "선택하세요", 
  className,
  disabled = false,
  invalid = false
}: MultiSelectProps) {
  const toggleValue = (v: string) => {
    if (value.includes(v)) {
      onChange(value.filter((item) => item !== v))
    } else {
      onChange([...value, v])
    }
  }

  const selectedOptions = options.filter((o) => value.includes(o.value))

  return (
    <Popover.Root>
      <Popover.Trigger asChild disabled={disabled}>
        <button
          className={cn(
            "w-full h-auto min-h-9 min-w-16 px-2.5 py-2 bg-white rounded-sm inline-flex justify-between items-center group border",
            "focus:outline-slate-400 focus:text-zinc-700",
            "data-[state=open]:border-slate-400",
            invalid && "border-red-700 text-red-700",
            disabled && "bg-gray-200 border-neutral-300 text-neutral-300 cursor-not-allowed",
            className
          )}
          aria-label="Select multiple"
        >
          <div className="flex flex-wrap gap-1">
            {selectedOptions.length === 0 ? (
              <span className={cn(
                "text-neutral-300 text-sm font-medium",
                invalid && "text-red-700",
                disabled && "text-neutral-300"
              )}>
                {placeholder}
              </span>
            ) : (
              <div className="flex flex-wrap gap-1">
                {selectedOptions.map((o) => (
                  <div 
                    key={o.value} 
                    className="px-1.5 py-1 bg-primary-200 inline-flex justify-center items-center gap-1 rounded-sm"
                  >
                    <div className="justify-start text-zinc-700 text-xs font-medium font-['SUIT']">
                      {o.label}
                    </div>
                    {!disabled && (
                      <DeleteIcon 
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleValue(o.value)
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          <ChevronDownArrow className={cn(
            "text-neutral-300 ml-2 shrink-0",
            "group-focus:text-zinc-700",
            invalid && "text-red-700", 
            disabled && "text-neutral-300"
          )} />
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content 
          className={cn(
            "min-w-[var(--radix-popover-trigger-width)] p-2.5 bg-white rounded-sm border inline-flex flex-col justify-center items-start gap-3",
            "z-50 max-h-60 overflow-y-auto"
          )} 
          align="start"
        >
          {options.map((option) => {
            const checked = value.includes(option.value)
            return (
              <label 
                key={option.value} 
                className="flex items-center gap-2 cursor-pointer w-full"
              >
                <span
                  onClick={() => toggleValue(option.value)}
                  className={cn(
                  "text-gray-500 text-sm font-medium w-full",
                  checked && "text-blue-600",
                  "data-[highlighted]:text-zinc-700"
                )}>
                  {option.label}
                </span>
              </label>
            )
          })}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}

MultiSelect.displayName = "MultiSelect";

export { MultiSelect };