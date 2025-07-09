export interface ProfileProps {
    className?: string;
    profileTitle?: string;
    profileDescription?: string;
    profileImage?: string;
    profileButton?: {
        title: string;
        onClick?: () => void;
    };
    profileItems?: {
        title: string;
        onClick?: () => void;
    }[];
}