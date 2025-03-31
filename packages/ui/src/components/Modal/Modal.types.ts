import React from 'react';
import { DialogProps } from '../Dialog/Dialog.types';

export interface ModalProps extends Omit<DialogProps, 'contentClassName'> {
  title?: React.ReactNode;
  footer?: React.ReactNode;
  width?: string | number;
  height?: string | number;
  closable?: boolean;
  contentClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  ref?: React.Ref<HTMLDivElement>;
} 