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
    className
 }: ProfileProps) {

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className={cn("flex items-center space-x-2 cursor-pointer", className)}>
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={profileImage} />
                    </Avatar>
                    <div className="flex flex-col items-start text-sm">
                        <p className="text-gray-600">{profileDescription}</p>
                        <p>{profileTitle}</p>
                    </div>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
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