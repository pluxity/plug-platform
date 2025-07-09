import { api, RequestOptions } from "@plug/api-hooks";
import type { DataResponseBody } from '@plug/api-hooks';
import {SignInRequest, SignUpRequest, UserProfile} from "@plug/common-services/types";

export const signUp = async (data: SignUpRequest) => {
  return await api.post("auth/sign-up", data, { requireAuth: false }, );
};

export const signIn = async (data: SignInRequest, options?: RequestOptions): Promise<Response> => {
  return await api.post("auth/sign-in", data, { requireAuth: false, ...options });
};

export const signOut = async (): Promise<Response> => {
  return api.post("auth/sign-out", {}, { requireAuth: true });
};

export const getUserProfile = (): Promise<DataResponseBody<UserProfile>> => {
  return api.get<UserProfile>("auth/users/me", { requireAuth: true });
};
