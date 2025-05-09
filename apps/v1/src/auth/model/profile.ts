import { UserProfile } from "@plug/common-services";

export interface AuthUserProfile extends UserProfile {
    id: number;
    username: string;
    roles: string[];
}