import React from 'react';
import { DialogProps } from '../Dialog/Dialog.types';

export type PopupPlacement = 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'center';

export interface PopupProps extends Omit<DialogProps, 'contentClassName'> {
  title?: React.ReactNode;
  placement?: PopupPlacement;
  width?: string | number;
  closable?: boolean;
  contentClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
} 