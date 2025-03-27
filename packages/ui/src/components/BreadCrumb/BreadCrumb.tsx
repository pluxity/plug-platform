import { createContext, useContext } from 'react';
import React from 'react';
import { cn } from '../../utils/classname';
import type{
    BreadCrumbProps,
    BreadCrumbItemProps,
} from './BreadCrumb.types';

interface BreadCrumbContextProps {
    color: 'primary' | 'secondary';
    size: 'small' | 'medium' | 'large';
    separator: 'line' | 'arrow';
}

const BreadCrumbContext = createContext<BreadCrumbContextProps | undefined>(undefined);

const BreadCrumb = ({
    color = 'primary',
    size = 'small',
    separator = 'line',
    className,
    children,
    ref,
    ...props
}: BreadCrumbProps) => {
    
    const BreadCrumbListStyle = 'flex flex-wrap items-center break-words';
    const BreadCrumbListSize = {
        small: 'text-sm gap-1.5',
        medium: 'text-base gap-2',
        large: 'text-lg gap-2.5',
    }[size];


    const BreadCrumbElement = React.Children.map(children,(child, index) => {
        if(React.isValidElement(child) && child.type === BreadCrumbItem){
            return React.cloneElement(child, {
                isLastItem: index === React.Children.count(children) - 1
            } as BreadCrumbItemProps)
        }
    })
    
    return (
        <BreadCrumbContext.Provider value={{color, size, separator}}>
            <nav
                ref={ref}
                aria-label='breadcrumb'
                {...props}
            >
                <ol 
                    className={cn(
                        BreadCrumbListStyle,
                        BreadCrumbListSize,
                        className,
                    )}
                >
                    {BreadCrumbElement}
                </ol>
            </nav>
        </BreadCrumbContext.Provider>
    )};

BreadCrumb.displayName = 'BreadCrumb';

const BreadCrumbItem = React.memo(({
    className,
    children,
    isLastItem,
    ...props
}: BreadCrumbItemProps) => {
    const context = useContext(BreadCrumbContext);

    if (!context) {
        throw new Error("BreadCrumbItem는 BreadCrumb 구성 요소 내에서 사용해야 합니다. <BreadCrumb.Item>이 <BreadCrumb> 구성 요소 내부에 중첩되어 있는지 확인하세요.");
    }
    const { color, separator } = context;

    const BreadCrumbItemStyle = 'inline-flex items-center cursor-pointer';

    const BreadcrumbListColor = {
        primary: 'text-primary-500',
        secondary: 'text-secondary-500',
    }[color];
        
    return (
        <>
            <li 
                className={cn(
                    BreadCrumbItemStyle,
                    BreadcrumbListColor,
                    className
                )}
                {...props}
            >
                {children}

            </li>
            {!isLastItem && separator && (
                <li
                    role="presentation"
                    aria-hidden="true"
                    className={cn(`transform mx-1 mt-1 border-gray-300 mr-1.5
                        ${separator === 'line'? 'border-r-1 h-3 rotate-25' : 'rotate-45 border-t-1 border-r-1 w-2 h-2'}
                    `)}
                >
                </li>
            )}
        </>
    )
});

BreadCrumbItem.displayName = 'BreadCrumbItem';

const BreadCrumbLink = ({
    href,
    className,
    children,
    ref,
    ...props
}: React.ComponentProps<'a'>) => {
    const context = useContext(BreadCrumbContext);

    if (!context) {
        throw new Error("BreadCrumbLink는 BreadCrumb 구성 요소 내에서 사용해야 합니다. <BreadCrumb.Link>가 <BreadCrumb> 구성 요소 내부에 중첩되어 있는지 확인하세요.");
      }

    const { size, color } = context;

    const BreadCrumbLinkStyle = 'inline-flex items-center gap-1.5 overflow-hidden text-ellipsis whitespace-nowrap text-gray-400';
    const BreadcrumbLinkColor = {
        primary: 'hover:text-primary-500',
        secondary: 'hover:text-secondary-500',
    }[color];
    const BreadcrumbLinkSize = {
        small: 'max-w-40',
        medium: 'max-w-50',
        large: 'max-w-60',
    }[size];

    return (
        <a
            ref={ref}
            href={href}
            className={cn(
                BreadCrumbLinkStyle,
                BreadcrumbLinkColor,
                BreadcrumbLinkSize,
                className
            )}
            {...props}
        >
            {children}
        </a>
    )
};

BreadCrumbLink.displayName = 'BreadCrumbLink';
    
export { BreadCrumb, BreadCrumbItem, BreadCrumbLink };
