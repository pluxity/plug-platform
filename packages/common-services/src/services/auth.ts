import { useGet, usePost, useSWRApi } from "@plug/api-hooks";
import type { DataResponseBody } from '@plug/api-hooks';
import {SignInRequest, SignUpRequest, UserProfile} from "@plug/common-services/types";

export const signUp = () => {
  return usePost<SignUpRequest>("auth/sign-up", { requireAuth: false } );
};

export const signIn = ()=> {
  return usePost<SignInRequest>("auth/sign-in", { requireAuth: false});
};

export const signOut = () => {
  return usePost("auth/sign-out", { requireAuth: true });
};

export const getUserProfile = () => {
  return useGet<DataResponseBody<UserProfile>>("users/me", { requireAuth: true });
};

export const getUserProfileSWR = () => {
  return useSWRApi<UserProfile>("users/me", 'GET', { requireAuth: true });
};
