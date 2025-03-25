import { HTMLAttributes, LiHTMLAttributes, AnchorHTMLAttributes } from 'react';

export interface BreadCrumbProps extends HTMLAttributes<HTMLElement> {
    defaultPage?: string;
    page?: string;
    onPageChange?: (page: string) => void;
    currentPage?: string;
    color?: 'primary' | 'secondary';
    size?: 'small' | 'medium' | 'large';
    separator?: 'line' | 'arrow';
    className?: string;
}

export interface BreadCrumbItemProps extends LiHTMLAttributes<HTMLLIElement> {
    isLastItem?: boolean;
    className?: string;
}

export interface BreadCrumbLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    href?: string;
    className?: string;
}
