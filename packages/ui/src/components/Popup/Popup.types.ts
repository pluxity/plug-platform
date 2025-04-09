import React from 'react';
import type { Placement } from '../types';
import type { DialogProps } from '../Dialog/Dialog.types';

export type PopupPlacement = Placement;

export interface PopupProps extends Omit<DialogProps, 'contentClassName'> {
  title?: React.ReactNode;
  placement?: PopupPlacement;
  width?: string | number;
  closable?: boolean;
  contentClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
  ref?: React.Ref<HTMLDivElement>;
} 