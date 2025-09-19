import { cn } from "../../../utils/utils";
import{
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@plug/ui";
import { Avatar, AvatarImage } from "../../atom/Avatar/AdminAvatar";
import { ProfileProps } from "@plug/ui";


function AdminProfile({
                   profileTitle,
                   profileDescription,
                   profileButton,
                   profileImage,
                   type = "list",
                   profileItems = [],
                   children,
                   className
                 }: ProfileProps) {

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className={cn(
          "flex w-32 h-16 items-center justify-between p-2 cursor-pointer rounded-lg",
          "transition-all duration-200 ease-in-out hover:bg-secondary-300",
          "relative group",
          className
        )}>
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={profileImage} />
            </Avatar>
            <div className="flex flex-col items-start min-w-0 mr-2.5">
              <p className={cn("text-sm font-medium text-gray-900 truncate max-w-[140px]",)}>
                {profileTitle}
              </p>
              <p className={cn("text-xs text-gray-600 text-right truncate max-w-[140px]",)}>
                {profileDescription}
              </p>
            </div>
          </div>
          <svg>
          </svg>
        </div>
      </DropdownMenuTrigger>

        <DropdownMenuContent className="testing mr-3">
          {type === "custom" ? (
            children
          ) : (
            <>
              {profileItems.map((item, index) => (
                <DropdownMenuItem
                  key={index}
                  onClick={item.onClick}
                >
                  <span>{item.title}</span>
                </DropdownMenuItem>
              ))}

              {profileButton && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant={profileButton.variant || "destructive"}
                    onClick={profileButton.onClick}
                  >
                    {profileButton.title}
                  </DropdownMenuItem>
                </>
              )}
            </>
          )}
        </DropdownMenuContent>

    </DropdownMenu>
  )
}

AdminProfile.displayName = "Profile";

export { AdminProfile };