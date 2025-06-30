import * as AvatarPrimitive from "@radix-ui/react-avatar";

export interface AvatarProps extends AvatarPrimitive.AvatarProps {
    className?: string;
    children?: React.ReactNode;
}

export interface AvatarImageProps extends AvatarPrimitive.AvatarImageProps {
    src?: string;
    alt?: string;
    className?: string;
    children?: React.ReactNode;
}

export interface AvatarFallbackProps extends AvatarPrimitive.AvatarFallbackProps {
    className?: string;
    children?: React.ReactNode;
}



