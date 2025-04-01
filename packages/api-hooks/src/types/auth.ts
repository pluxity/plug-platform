
export interface SignUpRequest {
    username: string;
    password: string;
    name: string;
    code: string;
}

export interface SignInRequest {
    username: string;
    password: string;
}

export interface SignInResponse {
    accessToken: string;
    name: string;
    code: string;
}



    