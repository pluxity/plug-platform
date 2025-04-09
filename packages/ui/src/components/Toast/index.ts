import {
    Toast as ToastComponent,
    ToastTitle,
    ToastDescription,
} from './Toast';

import type { ToastContainerProps, ToastContextProps, ToastProps } from './Toast.types';

const Toast = Object.assign(ToastComponent, {
    Title: ToastTitle,
    Description: ToastDescription,
});

export { Toast };

export type {ToastProps};