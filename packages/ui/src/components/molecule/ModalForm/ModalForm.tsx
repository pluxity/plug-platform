
import { FormProvider} from "react-hook-form";
import { cn } from "../../../utils/utils"; 
import { ModalFormContainerProps, ModalFormItemProps } from "./ModalForm.types";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "../Form/Form";

const ModalForm = FormProvider
const ModalFormField = FormField
function ModalFormContainer({ 
  children,
  className
}: ModalFormContainerProps) {
  return (
    <div className={cn("min-w-lg divide-y divide-gray-300 border-y border-gray-300", className)}>
      {children}
    </div>
  )
}

function ModalFormItem({ 
  label, 
  children, 
  className,
  description,
  message,
}: ModalFormItemProps) {
  return (
    <FormItem className={cn(`flex flex-col ${className ?? ""}`)}>
      <div className="flex">
        <div className="flex items-center justify-center w-40 px-3 py-2 bg-muted-light-gray">
          <FormLabel className="text-foreground data-[error=true]:text-foreground">
            {label}
          </FormLabel>
        </div>
        <div className={cn("flex-1 px-3 py-3")}>
          <FormControl>
            {children}
          </FormControl>
          {message && (<FormMessage className="pt-1">{message}</FormMessage>)}
          {description && !message && (<FormDescription className="pt-1">{description}</FormDescription>)}
        </div>
      </div>
    </FormItem>
  )
}

ModalFormItem.displayName = "ModalFormItem";
ModalFormContainer.displayName = "ModalFormContainer";

export {
  ModalForm,
  ModalFormItem,
  ModalFormField,
  ModalFormContainer,
};