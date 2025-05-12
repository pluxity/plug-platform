import { UserProfile } from "@plug/common-services";

export interface AuthUserProfile extends UserProfile {
    code: string;
    id: number;
    name: string;
    username: string;
    roles: string[];
}