import { toast } from "sonner";
export { toast };

export type { ExternalToast, ToastT } from "sonner";

const PLUG_TOAST_STYLES = {
  base: {
    fontFamily: 'var(--font-sans)',
    borderRadius: '8px',
    boxShadow: '0 4px 12px -4px rgba(0, 0, 0, 0.1)',
  },
  success: {
    backgroundColor: 'hsl(142.1 70% 90%)', // 밝은 녹색 배경
    color: 'hsl(142.1 85% 25%)', // 진한 녹색 텍스트
    border: '1px solid hsl(142.1 70% 75%)', // 중간 톤 테두리
  },
  error: {
    backgroundColor: 'hsl(0 70% 92%)', // 밝은 빨간색 배경
    color: 'hsl(0 85% 30%)', // 진한 빨간색 텍스트
    border: '1px solid hsl(0 70% 75%)', // 중간 톤 테두리
  },
  warning: {
    backgroundColor: 'hsl(47.9 85% 88%)', // 밝은 노란색 배경
    color: 'hsl(47.9 85% 25%)', // 진한 노란색 텍스트
    border: '1px solid hsl(47.9 85% 70%)', // 중간 톤 테두리
  },
  info: {
    backgroundColor: 'hsl(221.2 70% 90%)', // 밝은 파란색 배경
    color: 'hsl(221.2 85% 25%)', // 진한 파란색 텍스트
    border: '1px solid hsl(221.2 70% 75%)', // 중간 톤 테두리
  },
  loading: {
    backgroundColor: 'var(--muted)', // 밝은 회색 배경
    color: 'var(--muted-foreground)', // 진한 회색 텍스트
    border: '1px solid var(--border)',
  }
};

export const showSuccess = (message: string, options?: import("sonner").ExternalToast) => 
  toast.success(message, {
    style: { 
      ...PLUG_TOAST_STYLES.base,
      ...PLUG_TOAST_STYLES.success 
    },
    duration: 4000,
    ...options,
  }
);

export const showError = (message: string, options?: import("sonner").ExternalToast) => 
  toast.error(message, {
    style: { 
      ...PLUG_TOAST_STYLES.base,
      ...PLUG_TOAST_STYLES.error 
    },
    duration: 5000,
    ...options,
  }
);

export const showInfo = (message: string, options?: import("sonner").ExternalToast) => 
  toast.info(message, {
    style: { 
      ...PLUG_TOAST_STYLES.base,
      ...PLUG_TOAST_STYLES.info 
    },
    duration: 4000,
    ...options,
  }
);

export const showWarning = (message: string, options?: import("sonner").ExternalToast) => 
  toast.warning(message, {
    style: { 
      ...PLUG_TOAST_STYLES.base,
      ...PLUG_TOAST_STYLES.warning 
    },
    duration: 4500,
    ...options,
  }
);

export const showLoading = (message: string, options?: import("sonner").ExternalToast) => 
  toast.loading(message, {
    style: { 
      ...PLUG_TOAST_STYLES.base,
      ...PLUG_TOAST_STYLES.loading 
    },
    ...options,
  }
);

export const showMessage = (message: string, options?: import("sonner").ExternalToast) => 
  toast(message, {
    style: { 
      ...PLUG_TOAST_STYLES.base,
      backgroundColor: 'var(--background)',
      color: 'var(--foreground)',
      border: '1px solid var(--border)',
    },
    duration: 4000,
    ...options,
  }
);

export const showActionToast = (
  message: string, 
  actionLabel: string, 
  onAction: () => void,
  options?: import("sonner").ExternalToast
) => 
  toast(message, {
    style: { 
      ...PLUG_TOAST_STYLES.base,
      backgroundColor: 'var(--background)',
      color: 'var(--foreground)',
      border: '1px solid var(--border)',
    },
    action: {
      label: actionLabel,
      onClick: onAction,
    },
    duration: 6000,
    ...options,
  }
);


export default toast;
