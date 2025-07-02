import { Button } from "../Button/Button";

export interface PaginationProps extends React.ComponentProps<"nav"> {
    children?: React.ReactNode;
    className?: string;
}

export interface PaginationContentProps extends React.ComponentProps<"ul"> {
    children?: React.ReactNode;
    className?: string;
}

export interface PaginationItemProps extends React.ComponentProps<"li"> {
    children?: React.ReactNode;
}

export type PaginationLinkProps = {
    isActive?: boolean;
} & Pick<React.ComponentProps<typeof Button>, "size"> & React.ComponentProps<"a">;

export interface PaginationPreviousProps extends PaginationLinkProps {
    children?: React.ReactNode;
    className?: string;
}

export interface PaginationNextProps extends PaginationLinkProps {
    children?: React.ReactNode;
    className?: string;
}

export interface PaginationEllipsisProps extends React.ComponentProps<"span"> {
    className?: string;
}
