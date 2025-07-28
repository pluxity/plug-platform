import { usePost, api } from "@plug/api-hooks";
import { SignInRequest, SignUpRequest, UserProfile } from "@plug/common-services/types";
import { useState } from "react";

export const useSignUp = () => {
  return usePost<SignUpRequest>("auth/sign-up", { requireAuth: false });
};

export const useSignIn = () => {
  return usePost<SignInRequest>("auth/sign-in", { requireAuth: false });
};

export const useSignInWithInfo = () => {
  const [userInfo, setUserInfo] = useState<UserProfile | null>(null);
  const [isLoadingUserInfo, setIsLoadingUserInfo] = useState(false);
  const [userInfoError, setUserInfoError] = useState<Error | null>(null);
  
  const { execute: signIn, isLoading: isSigningIn, error: signInError } = useSignIn();
  
  const executeSignInWithInfo = async (signInData: SignInRequest) => {
    try {
      const signInResult = await signIn(signInData);
      
      if (signInResult.response?.ok) {
        setIsLoadingUserInfo(true);
        setUserInfoError(null);
        
        try {
          const userInfoResponse = await api.get<UserProfile>('users/me', {
            requireAuth: true,
          });
          
          const userData = userInfoResponse.data;
          setUserInfo(userData);
          
          return {
            signInResult,
            userInfo: userData,
            success: true
          };
        } catch (error) {
          const userInfoErr = error instanceof Error ? error : new Error('Unknown error');
          setUserInfoError(userInfoErr);
          
          return {
            signInResult,
            userInfo: null,
            success: false,
            error: userInfoErr
          };
        } finally {
          setIsLoadingUserInfo(false);
        }
      }
      
      return {
        signInResult,
        userInfo: null,
        success: false,
        error: new Error('로그인에 실패했습니다.')
      };
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error');
      throw new Error('로그인 요청 중 오류 발생: ' + err.message);
    }
  };
  
  return {
    execute: executeSignInWithInfo,
    isLoading: isSigningIn || isLoadingUserInfo,
    isSigningIn,
    isLoadingUserInfo,
    error: signInError || userInfoError,
    signInError,
    userInfoError,
    userInfo
  };
}

export const useSignOut = () => {
  return usePost("auth/sign-out", { requireAuth: true });
};