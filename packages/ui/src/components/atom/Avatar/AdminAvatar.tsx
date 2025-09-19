import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { AvatarProps, AvatarImageProps, AvatarFallbackProps } from "@plug/ui";
import { cn } from "../../../utils/utils";
import Profile from "../../../assets/icons/Avatar/Profile";

function Avatar({
                  className,
                  ...props
                }: AvatarProps) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"

      className={cn(
        "relative flex",
        className
      )}
      {...props}
    />
  )
}

Avatar.displayName = "Avatar";

function AvatarImage({
                       className,
                       src,
                       ...props
                     }: AvatarImageProps) {
  if (!src) {
    return (
      <div
        data-slot="avatar-image"
        className={cn(
          "aspect-square size-10 grid place-items-center rounded-full",
          "bg-primary-200 backdrop-blur-[0.5px]",
          className
        )}
      >
        <Profile className="size-6" aria-hidden="true" />
        <span className="sr-only">사용자 프로필</span>
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

AvatarImage.displayName = "AvatarImage";

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

AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback }