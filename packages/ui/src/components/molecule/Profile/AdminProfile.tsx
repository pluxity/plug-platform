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
          "flex w-42 items-center justify-between p-2 cursor-pointer rounded-lg",
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
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="transition-transform duration-200 group-hover:rotate-180"
          >
            <path d="M10 0.900391C15.0258 0.900391 19.0996 4.97421 19.0996 10C19.0996 15.0258 15.0258 19.0996 10 19.0996C4.97421 19.0996 0.900391 15.0258 0.900391 10C0.900391 4.97421 4.97421 0.900391 10 0.900391Z" stroke="#5C5C5C" strokeWidth="0.2"/>
            <path d="M10 10.7929L7.73162 8.14645C7.56425 7.95118 7.29289 7.95118 7.12553 8.14645C6.95816 8.34171 6.95816 8.65829 7.12553 8.85355L9.69695 11.8536C9.86432 12.0488 10.1357 12.0488 10.303 11.8536L12.8745 8.85355C13.0418 8.65829 13.0418 8.34171 12.8745 8.14645C12.7071 7.95118 12.4358 7.95118 12.2684 8.14645L10 10.7929Z" fill="#565656"/>
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