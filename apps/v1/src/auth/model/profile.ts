import { UserProfile } from "@plug/common-services";

export interface AuthUserProfile extends UserProfile {
    id: number;
    name: string;
    username: string;
    roles: string[];
}