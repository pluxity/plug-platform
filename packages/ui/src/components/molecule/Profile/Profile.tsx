import { cn } from "../../../utils/utils";
import{
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../../atom/DropdownMenu/DropdownMenu";
import { Avatar, AvatarImage } from "../../atom/Avatar/Avatar";
import { ProfileProps } from "./Profile.types";


function Profile({ 
    profileTitle,
    profileDescription,
    profileButton,
    profileImage,
    type = "list",
    profileItems = [],
    children,
    className,
    profileImageClassName,
    profileTitleClassName,
    profileDescriptionClassName,
    dropdownContentClassName,
}: ProfileProps) {

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className={cn("flex items-center space-x-2 cursor-pointer", className)}>
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={profileImage} className={profileImageClassName} />
                    </Avatar>
                    <div className="flex flex-col items-start text-sm">
                        <p className={cn("text-gray-600", profileDescriptionClassName)}>{profileDescription}</p>
                        <p className={cn("text-gray-600", profileTitleClassName)}>{profileTitle}</p>
                    </div>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
                className={cn(dropdownContentClassName)}
            >
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

Profile.displayName = "Profile";

export { Profile };