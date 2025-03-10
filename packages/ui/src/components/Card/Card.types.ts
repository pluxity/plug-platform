import { HTMLAttributes } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  closable?: boolean;
  onClose?: () => void;
}

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  className?: string;
}

export interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  className?: string;
}

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
} 