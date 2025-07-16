import { cn } from "../../../utils/utils";
import { ModalFormProps, ModalFormItemProps } from "./ModalForm.types";

function ModalForm({ 
                    children,
                    className
}: ModalFormProps) {
    return(
        <div className={cn("divide-y divide-gray-200", className)}>
            {children}
        </div>
    )
}

ModalForm.displayName = "ModalForm";

function ModalFormItem({ 
                        label, 
                        children, 
                        className 
}: ModalFormItemProps) {
  return (
    <div className={cn(`flex ${className ?? ""}`)}>
      <div className="flex items-center justify-center w-40 px-3 py-2 bg-muted-light-gray">{label}</div>
      <div className="flex items-center flex-1 px-3 py-2 bg-white">{children}</div>
    </div>
  )
}

ModalFormItem.displayName = "ModalFormItem";

export { ModalForm, ModalFormItem };