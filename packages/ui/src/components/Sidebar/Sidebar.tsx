import { cn } from "../../utils/classname";
import React, { useState, useContext, createContext } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarArrowIcon from "../../assets/icons/sidebar_arrow.svg";
import type {
    SidebarProps,
    SidebarMenuButtonProps,
    SidebarMenuProps,
    SidebarMenuItemProps,
    SidebarSubMenuProps,
    SidebarSubMenuItemProps,
} from "./Sidebar.types";

interface SidebarContextType {
    isOpen: boolean;
    toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

const Sidebar = ({
    isOpen = true,
    onChange,
    className,
    children,
    ...props
}: SidebarProps) => {
    const isControlled = isOpen !== undefined;
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const currentState = isControlled ? isOpen : sidebarOpen;

    const toggleSidebar = () => {
        if(!isControlled){
            setSidebarOpen(currentState);
        }
        if(onChange){
            onChange(currentState);
        }
    }
    
    return (
        <SidebarContext.Provider value={{ isOpen:currentState, toggleSidebar }}>
            <aside
                aria-hidden={!currentState}
                className={cn(
                    'h-screen bg-white shadow-[0_0_15px_-3px_rgba(0,_0,_0,_0.2)] flex flex-col',
                    currentState ? 'w-60' : 'w-20',
                    'transition-all duration-300 ease-in-out',
                    className
                )}
                {...props}
            >
                <div className="flex-1 overflow-y-auto p-3 flex flex-col">
                    {children}
                </div>
            </aside>
        </SidebarContext.Provider>
    );
}

const SidebarHeader = ({
    className,
    children,
    ...props
}: React.ComponentProps<"div">) => {
    const { isOpen } = useContext(SidebarContext)!;
    if (!isOpen) return null;

    return(
        <div
            className={cn("p-3 mb-2", className)}
            {...props}
        >
            {children}
        </div>
    )
}

const SidebarFooter = ({
    className,
    children,
    ...props
}: React.ComponentProps<"div">) => {
    const { isOpen } = useContext(SidebarContext)!;
    if (!isOpen) return null;
    
    return(
        <div
            className={cn("p-3 mt-2", className)}
            {...props}
        >
            {children}
        </div>
    )
}

const SidebarMenu = ({
    className,
    children,
    items = [],
    ...props
}: SidebarMenuProps) => {
    return(
        <ul
            className={cn(
                `flex-1 overflow-y-auto px-2 py-4 flex flex-col gap-2 
                [&::-webkit-scrollbar]:w-[6px] 
                [&::-webkit-scrollbar-track]:bg-transparent 
                [&::-webkit-scrollbar-thumb]:bg-gray-200 
                [&::-webkit-scrollbar-thumb]:rounded-full 
                hover:[&::-webkit-scrollbar-thumb]:bg-gray-200`, 
                className
            )}
            {...props}
        >
            {items.map((item, index) => (
                <SidebarMenuItem key={index} toggleable={item.toggleable}>
                    <SidebarMenuButton link={item.link} className={item.className}>
                        {item.icon}
                        {item.title}
                    </SidebarMenuButton>
                    {item.submenu && (
                        <SidebarSubMenu>
                            {item.submenu.map((subItem, subIndex) => (
                                <li key={subIndex}>
                                    <SidebarSubMenuItem link={subItem.link} className={subItem.className}>
                                        {subItem.title}
                                    </SidebarSubMenuItem>
                                </li>
                            ))}
                        </SidebarSubMenu>
                    )}
                </SidebarMenuItem>
            ))}
        </ul>
    )
}

const SidebarMenuItem = ({
    toggleable = true,
    className,
    children,
    ...props
}: SidebarMenuItemProps) => {
    const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
    
    const handleClick = () => {
        if (toggleable) {
            setIsSubMenuOpen(prev => !prev);
        }
    };

    const ChildrenElement = React.Children.map(children, child => {
        if (React.isValidElement(child)) {
            if (child.type === SidebarMenuButton) {
                return React.cloneElement(child, {
                    isSubMenuOpen,
                    onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
                        e.stopPropagation();
                        handleClick();
                        (child.props as SidebarMenuButtonProps).onClick?.(e);
                    },
                } as SidebarMenuButtonProps);
            }
            if (child.type === SidebarSubMenu) {
                return React.cloneElement(child, {
                    isSubMenuOpen,
                } as SidebarSubMenuProps);
            }
        }
        return child;
    });

    return(
        <li
            className={cn(className)}
            {...props}
        >   
            {ChildrenElement}
        </li>
    )
}

const SidebarMenuButton = ({
    className,
    children,
    isSubMenuOpen = false,
    onClick,
    link,
    ...props
}: SidebarMenuButtonProps) => {
    const { isOpen } = useContext(SidebarContext)!;
    const ArrowIcon = SidebarArrowIcon as unknown as React.FC<React.SVGProps<SVGSVGElement>>;
    const navigate = useNavigate(); 

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (link) {
            navigate(link);
        }
        onClick?.(e);
    };

    const SubChildrenElement = React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {return child;}
        if (typeof child === 'string') {return isOpen ? child : null;}
        return null;
    });

    return(
        <button 
            aria-expanded={isSubMenuOpen}
            type="button"
            onClick={handleClick}
            className={cn(
                `flex items-center w-full gap-2  ${isOpen ? "" : "justify-center"}`,
                className,
            )}
            {...props}
        >
            {SubChildrenElement}
            {isOpen && (
                <ArrowIcon className={cn(
                    "ml-auto transition-transform duration-200",
                    isSubMenuOpen ? "rotate-90" : "rotate-0"
                )} />
            )}
        </button>
    )
}

const SidebarSubMenu = ({
    className,
    children,
    isSubMenuOpen = false,
    ...props
}: SidebarSubMenuProps) => {
    return(
        <ul
            role="menu"
            aria-hidden={!isSubMenuOpen}
            className={cn(
                `flex flex-col gap-1 my-2 pl-6 ${isSubMenuOpen ? "block" : "hidden"}`,
                className
            )}
            {...props}
        >   
            {children}
        </ul>
    )
}

const SidebarSubMenuItem = ({ 
    className,
    children,
    onClick,
    link,
    ...props
}: SidebarSubMenuItemProps) => {
    const navigate = useNavigate(); 
    
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (link) {
            navigate(link);
        }
        onClick?.(e);
    };

    return(
        <button
            type="button"
            onClick={handleClick}
            className={cn(
                "w-full text-left px-2 py-1 text-sm cursor-pointer",
                className
            )}
            {...props}
        >
            {children}
        </button>
    )
}

export { Sidebar, SidebarHeader, SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarSubMenu, SidebarSubMenuItem };