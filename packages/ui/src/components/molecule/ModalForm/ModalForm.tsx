import { cn } from "../../../utils/utils";
import { ModalFormProps, ModalFormItemProps } from "./ModalForm.types";
import { FormLabel, FormDescription, FormMessage } from "../Form/Form";

function ModalForm({ 
                    children,
                    className
}: ModalFormProps) {
    return(
        <div className={cn("min-w-lg divide-y divide-gray-300 border-y border-gray-300", className)}>
            {children}
        </div>
    )
}

ModalForm.displayName = "ModalForm";

function ModalFormItem({ 
  label, 
  children, 
  className,
  message,
  description,
}: ModalFormItemProps) {
  return (
    <div className={cn(`flex flex-col ${className ?? ""}`)}>
      <div className="flex">
        <div className="flex items-center justify-center w-40 px-3 py-2 bg-muted-light-gray">
          <FormLabel>
            {label}
          </FormLabel>
        </div>
        <div className={cn("flex-1 px-3 py-3")}>
          {children}
          {message && (<FormMessage  className="pt-1">{message}</FormMessage>)}
          {description && !message && (<FormDescription className="pt-1">{description}</FormDescription>)}
        </div>
      </div>
    </div>
  )
}

ModalFormItem.displayName = "ModalFormItem";

export { ModalForm, ModalFormItem };