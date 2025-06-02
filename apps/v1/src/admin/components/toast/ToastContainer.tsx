import {useToastStore} from "@plug/v1/admin/components/hook/useToastStore";
import {Toast} from "@plug/ui";
import {ToastTitle} from "../../../../../../packages/ui/src/components/Toast/Toast";
import { ToastDescription } from "../../../../../../packages/ui/src/components/Toast/Toast";

export const ToastContainer = () => {
  const { toasts, removeToast } = useToastStore();

  return (
    <>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          isOpen={true}
          variant={toast.variant}
          onClose={() => removeToast(toast.id)}
          autoCloseDuration={toast.duration || 3000}
        >
          {toast.title && <ToastTitle>{toast.title}</ToastTitle>}
          <ToastDescription>{toast.description}</ToastDescription>
        </Toast>
      ))}
    </>
  );
};