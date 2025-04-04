import { api } from '../core/client';
import { SignInRequest, SignInResponse } from '../types/auth';

export const login = (data: SignInRequest) => {
  return api.post<SignInResponse>(
    '/auth/login', 
    data, 
    { requireAuth: false }
  );
};

export const logout = () => {
  return api.post('/auth/logout', {}, { requireAuth: true });
};

export const getUserProfile = () => {
  return api.get<{ name: string; code: string }>(
    '/auth/user', 
    { requireAuth: true }
  );
}; 