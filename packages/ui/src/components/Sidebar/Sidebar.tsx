import { cn } from "../../utils/classname";
import React, { useState, useContext, createContext } from 'react';
import SidebarArrowIcon from "../../assets/icons/sidebar_arrow.svg";
import type {
    SidebarProps,
    SidebarMenuButtonProps,
    SidebarSubMenuProps,
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
                    'h-screen rounded-md bg-white shadow-[0_0_15px_-3px_rgba(0,_0,_0,_0.2)] flex flex-col',
                    currentState ? 'w-[200px]' : 'w-[60px]',
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

const SidebarMenu = ({
    className,
    children,
    ...props
}: React.ComponentProps<"ul">) => {
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
            {children}
        </ul>
    )
}

const SidebarMenuItem = ({
    className,
    children,
    ...props
}: React.ComponentProps<"li">) => {

    const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
    
    const handleClick = () => {
        setIsSubMenuOpen(prev => !prev);
    };

    const ChildrenElement = React.Children.map(children, child => {
        if (React.isValidElement(child)) {
            if (child.type === SidebarMenuButton) {
                return React.cloneElement(child, {
                    isSubMenuOpen,
                    onClick: handleClick,
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
    ...props
}: SidebarMenuButtonProps) => {

    const { isOpen } = useContext(SidebarContext)!;

    const ArrowIcon = SidebarArrowIcon as unknown as React.FC<React.SVGProps<SVGSVGElement>>;

    const SubChildrenElement = React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {return child;}
    
        if (typeof child === 'string') {return isOpen ? child : null;}
    
        return null;
    });
    return(
        <button 
            aria-expanded={isSubMenuOpen}
            type="button"
            onClick={onClick}
            className={cn(
                `flex items-center w-full gap-2 ${isOpen ? "" : "justify-center"}`,
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
    ...props
}: React.ComponentProps<"button">) => {
    return (
        <li>
            <button
                role="menuitem"
                type="button"
                className={cn("px-2 py-2 rounded text-sm w-full text-left", className)}
                {...props}
            >
                {children}
            </button>
        </li>
    );
};

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

export { Sidebar, SidebarHeader, SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarSubMenu, SidebarSubMenuItem };