import { create } from "zustand";
import { cookieStorage, ACCESS_TOKEN_NAME } from "../utils/cookies";

type AuthStore = {
  accessToken: string | null;
  isAuthenticated: boolean;
  userName: string | null;
  userCode: string | null;
  login: (token: string, name: string, code: string) => void;
  logout: () => void;
  initialize: () => void;
};

const useAuthStore = create<AuthStore>((set) => ({
  accessToken: null,
  isAuthenticated: false,
  userName: null,
  userCode: null,
  login: (token: string, name: string, code: string) => {
    // 상태 업데이트 먼저 실행
    set({
      accessToken: token,
      isAuthenticated: true,
      userName: name,
      userCode: code,
    });
    
    // 쿠키 저장은 상태 업데이트 후에 비동기적으로 처리
    setTimeout(() => {
      try {
        cookieStorage.setCookie(ACCESS_TOKEN_NAME, token);
        cookieStorage.setCookie('userName', name);
        cookieStorage.setCookie('userCode', code);
        
        // 저장 확인 (디버깅용)
        console.log('쿠키 저장 후 모든 쿠키 목록:', cookieStorage.getAllCookies());
      } catch (error) {
        console.error("쿠키 저장 중 오류 발생:", error);
      }
    }, 0);
  },
  logout: () => {
    // 상태 업데이트 먼저 실행
    set({
      accessToken: null,
      isAuthenticated: false,
      userName: null,
      userCode: null,
    });
    
    // 쿠키 삭제
    setTimeout(() => {
      try {
        cookieStorage.removeCookie(ACCESS_TOKEN_NAME);
        cookieStorage.removeCookie('userName');
        cookieStorage.removeCookie('userCode');
      } catch (error) {
        console.error("쿠키 삭제 중 오류 발생:", error);
      }
    }, 0);
  },
  initialize: () => {
    // 쿠키에서 토큰 및 사용자 정보 복원
    const token = cookieStorage.getCookie(ACCESS_TOKEN_NAME);
    const name = cookieStorage.getCookie('userName');
    const code = cookieStorage.getCookie('userCode');
    
    if (token) {
      set({
        accessToken: token,
        isAuthenticated: true,
        userName: name || null,
        userCode: code || null,
      });
    }
  },
}));

export default useAuthStore;
