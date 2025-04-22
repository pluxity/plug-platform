import {
    Toast as ToastComponent,
    ToastTitle,
    ToastDescription,
} from './Toast';

import type { 
    ToastPortalProps,
    ToastProps,
    ToastTitleProps,
    ToastDescriptionProps,
 } from './Toast.types';

const Toast = Object.assign(ToastComponent, {
    Title: ToastTitle,
    Description: ToastDescription,
});

export { Toast };

export type { ToastPortalProps, ToastTitleProps, ToastDescriptionProps, ToastProps};