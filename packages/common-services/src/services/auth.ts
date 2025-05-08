import { api } from '@plug/api-hooks';
import type { DataResponseBody } from '@plug/api-hooks';
import type {
  SignUpRequest,
  SignInRequest,
  SignInResponse,
  UserProfile
} from '../types';

export const signUp = (data: SignUpRequest) => {
  return api.post<void>('auth/sign-up', data, {
    requireAuth: false
  });
};

export const signIn = (data: SignInRequest): Promise<DataResponseBody<SignInResponse>> => {
  return api.post<DataResponseBody<SignInResponse>>('auth/sign-in', data, {
    requireAuth: false
  });
};

export const signOut = (): Promise<void> => {
  return api.post<void>('auth/sign-out', {}, { requireAuth: true });
};

export const getUserProfile = (): Promise<DataResponseBody<UserProfile>> => {
  return api.get<UserProfile>('auth/users/me', { requireAuth: true });
};
