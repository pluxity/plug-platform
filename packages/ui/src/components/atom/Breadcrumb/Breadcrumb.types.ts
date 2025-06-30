export interface BreadcrumbProps extends React.ComponentProps<"nav"> {
    className?: string;
    children?: React.ReactNode;
}

export interface BreadcrumbListProps extends React.ComponentProps<"ol"> {
    className?: string;
    children?: React.ReactNode;
}   

export interface BreadcrumbItemProps extends React.ComponentProps<"li"> {
    className?: string;
    children?: React.ReactNode;
}

export interface BreadcrumbLinkProps extends React.ComponentProps<"a"> {
    className?: string;
    children?: React.ReactNode;
    asChild?: boolean;
}

export interface BreadcrumbPageProps extends React.ComponentProps<"span"> {
    className?: string;
    children?: React.ReactNode;
}   

export interface BreadcrumbSeparatorProps extends React.ComponentProps<"li"> {
    className?: string;
    children?: React.ReactNode;
}

export interface BreadcrumbEllipsisProps extends React.ComponentProps<"span"> {
    className?: string;
    children?: React.ReactNode;
}









