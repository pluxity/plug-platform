import { usePost } from "@plug/api-hooks";
import { SignInRequest, SignUpRequest } from "@plug/common-services/types";

export const useSignUp = () => {
  return usePost<SignUpRequest>("auth/sign-up", { requireAuth: false });
};

export const useSignIn = () => {
  return usePost<SignInRequest>("auth/sign-in", { requireAuth: false });
};

export const useSignOut = () => {
  return usePost("auth/sign-out", { requireAuth: true });
};