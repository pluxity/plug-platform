import { cn } from "../../../utils/utils";

type ModalFormProps = {
    children: React.ReactNode;
    className?: string;
};

type ModalFormItemProps = {
    label: string;
    children: React.ReactNode;
    className?: string;
};

const ModalForm = ({ 
                    children,
                    className
}: ModalFormProps) => {
    return(
        <div className={cn("divide-y divide-gray-200", className)}>
            {children}
        </div>
    )
};

ModalForm.displayName = "ModalForm";

export { ModalForm };

const ModalFormItem = ({ 
                        label, 
                        children, 
                        className 
}: ModalFormItemProps) => (
  <div className={cn(`flex ${className ?? ""}`)}>
    <div className="flex items-center justify-center w-40 px-3 py-2 bg-muted-light-gray">{label}</div>
    <div className="flex-1 px-3 py-2 bg-white">{children}</div>
  </div>
);

ModalFormItem.displayName = "ModalFormItem";

export { ModalFormItem };