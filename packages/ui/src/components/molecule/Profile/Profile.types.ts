export interface ProfileProps {
    className?: string;
    profileTitle?: string;
    profileDescription?: string;
    profileImage?: string;
    profileButton?: {
        title: string;
        onClick?: () => void;
        variant?: "default" | "destructive";
    };
    profileItems?: {
        title: string;
        onClick?: () => void;
    }[];
    type?: "list" | "custom";
    children?: React.ReactNode;
}