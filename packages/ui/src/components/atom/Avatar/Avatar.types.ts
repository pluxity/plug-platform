import * as AvatarPrimitive from "@radix-ui/react-avatar";

export interface AvatarProps extends React.ComponentProps<typeof AvatarPrimitive.Root> {
    className?: string;
    children?: React.ReactNode;
}

export interface AvatarImageProps extends React.ComponentProps<typeof AvatarPrimitive.Image> {
    src?: string;
    alt?: string;
    className?: string;
    children?: React.ReactNode;
}

export interface AvatarFallbackProps extends React.ComponentProps<typeof AvatarPrimitive.Fallback> {
    className?: string;
    children?: React.ReactNode;
}



