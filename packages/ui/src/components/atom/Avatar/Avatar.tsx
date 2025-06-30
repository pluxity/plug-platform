import * as AvatarPrimitive from "@radix-ui/react-avatar";
import ProfileSvg from "../../../assets/icons/Avatar/profile.svg";
import { AvatarProps, AvatarImageProps, AvatarFallbackProps } from "./Avatar.types";

import { cn } from "../../../utils/utils";

function Avatar({
  className,
  ...props
}: AvatarProps) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    />
  )
}

function AvatarImage({
  className,
  src,
  ...props
}: AvatarImageProps) {
  if (!src) {
    return (
      <div
        data-slot="avatar-image"
        className={cn("aspect-square size-full bg-muted-blue-gray flex items-center justify-center", className)}
      >
        <ProfileSvg />
      </div>
    )
  }

  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full bg-muted-blue-gray", className)}
      src={src}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  ...props
}: AvatarFallbackProps) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className
      )}
      {...props}
    />
  )
}

export { Avatar, AvatarImage, AvatarFallback }
