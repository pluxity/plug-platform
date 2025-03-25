import { HTMLAttributes, LiHTMLAttributes, AnchorHTMLAttributes } from 'react';

export interface BreadCrumbProps extends HTMLAttributes<HTMLElement> {
    color?: 'primary' | 'secondary';
    size?: 'small' | 'medium' | 'large';
    separator?: 'line' | 'arrow';
    className?: string;
}

export interface BreadCrumbItemProps extends LiHTMLAttributes<HTMLLIElement> {
    isLastItem?: boolean;
    className?: string;
}

export interface BreadCrumbLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
    href: string;
    className?: string;
}
