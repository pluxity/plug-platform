export type ToastPosition = "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right"
export type ToastTheme = "light" | "dark" | "system";

export interface ToastOptions {
    duration?: number
    dismissible?: boolean
    important?: boolean
    style?: React.CSSProperties
    className?: string
    descriptionClassName?: string
}

export interface ToastProps {
    className?: string
    position?: ToastPosition
    closeButton?: boolean
    duration?: number
    visibleToasts?: number
    richColors?: boolean
    expand?: boolean
    invert?: boolean
    gap?: number
    theme?: ToastTheme
    toastOptions?: ToastOptions
}
