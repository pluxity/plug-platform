import { FormProvider} from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@plug/ui";
import { twMerge } from "tailwind-merge";
import { ModalFormContainerProps, ModalFormItemProps } from "@plug/ui";

const FacilityForm = FormProvider
const FacilityFormField = FormField
function FacilityFormContainer({ children, className }: ModalFormContainerProps) {
  return (
    <div className={twMerge("min-w-lg divide-y divide-gray-300 border-y border-gray-300", className)}>
      {children}
    </div>
  )
}

function FacilityFormItem({ label, children, className, description, message, }: ModalFormItemProps) {
  return (
    <FormItem className={twMerge(`flex flex-col ${className ?? ""}`)}>
      <div className="flex h-full">
        <div className="flex items-center justify-center w-40 px-3 py-2 bg-muted-light-gray">
          <FormLabel className="text-foreground data-[error=true]:text-foreground">
            {label}
          </FormLabel>
        </div>
        <div className={twMerge("flex-1 px-3 py-2 flex items-center")}>
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

FacilityFormItem.displayName = "FacilityFormItem";
FacilityFormContainer.displayName = "FacilityFormContainer";

export {
  FacilityForm,
  FacilityFormItem,
  FacilityFormField,
  FacilityFormContainer,
};