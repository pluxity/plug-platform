import * as React from "react"
import * as Popover from "@radix-ui/react-popover"
import { CheckIcon, ChevronDownIcon, X } from "lucide-react"
import { Checkbox } from "@radix-ui/react-checkbox"

type Option = {
  label: string
  value: string
}

interface MultiSelectProps {
  options: Option[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
}

export const MultiSelect: React.FC<MultiSelectProps> = ({ options, value, onChange, placeholder = "선택해주세요", }) => {
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
      <Popover.Trigger asChild>
        <button
          className="inline-flex items-center justify-between border rounded-md px-3 py-2 text-sm w-64 bg-white shadow-sm hover:bg-gray-50"
          aria-label="Select multiple"
        >
          <div className="flex flex-wrap gap-1 max-w-[180px]">
            {selectedOptions.length === 0 ? (
              <span className="text-gray-400">{placeholder}</span>
            ) : (
              selectedOptions.map((o) => (
                <span key={o.value} className="flex items-center bg-slate-100 px-2 py-0.5 rounded text-xs text-gray-700">
                  {o.label}
                  <X
                    className="w-3 h-3 ml-1 cursor-pointer hover:text-red-500"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleValue(o.value)
                    }}
                  />
                </span>
              ))
            )}
          </div>
          <ChevronDownIcon className="w-4 h-4 text-gray-500 ml-2 shrink-0" />
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content className="z-50 bg-white border rounded-md shadow-md w-64 p-2 max-h-60 overflow-y-auto" align="start">
          {options.map((option) => {
            const checked = value.includes(option.value)
            return (
              <label key={option.value} className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-pointer text-sm">
                <Checkbox
                  checked={checked}
                  onCheckedChange={() => toggleValue(option.value)}
                  className="w-4 h-4 border-gray-300 rounded flex items-center justify-center"
                >
                  {checked && <CheckIcon className="w-3 h-3 text-primary" />}
                </Checkbox>
                {option.label}
              </label>
            )
          })}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
