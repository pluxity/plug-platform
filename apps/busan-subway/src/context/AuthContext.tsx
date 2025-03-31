import { createContext, useState, useEffect, ReactNode } from 'react';
import { fetchClient, TokenProvider } from '@plug/api-hooks';

/* eslint-disable no-unused-vars */
interface AuthContextType {
  isAuthenticated: boolean;
  userName: string | null;
  userCode: string | null;
  login: (token: string, name: string, code: string) => void;
  logout: () => void;
}
/* eslint-enable no-unused-vars */

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

// api-hooks에서 사용할 세션 스토리지 기반 토큰 저장소 설정
const SessionStorageTokenStorage = {
  getToken: () => sessionStorage.getItem('accessToken'),
  setToken: (token: string) => sessionStorage.setItem('accessToken', token),
  removeToken: () => sessionStorage.removeItem('accessToken')
};

// api-hooks의 TokenProvider 설정
TokenProvider.setTokenStorage(SessionStorageTokenStorage);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [userCode, setUserCode] = useState<string | null>(null);

  useEffect(() => {
    // 페이지 로드 시 인증 상태 확인 
    const name = sessionStorage.getItem('userName');
    const code = sessionStorage.getItem('userCode');
    const token = TokenProvider.getToken();

    if (name && code && token) {
      setIsAuthenticated(true);
      setUserName(name);
      setUserCode(code);
    }
  }, []);

  const login = (token: string, name: string, code: string) => {
    // Access Token 저장 - TokenProvider를 통해 저장
    TokenProvider.setToken(token);
    sessionStorage.setItem('userName', name);
    sessionStorage.setItem('userCode', code);
    setIsAuthenticated(true);
    setUserName(name);
    setUserCode(code);
  };

  const logout = async () => {
    try {
      // 로그아웃 API 호출 (서버에서 Refresh Token 쿠키 제거)
      await fetchClient('/api/auth/signout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
    }

    // 프론트엔드 상태 및 세션 스토리지 정리
    TokenProvider.removeToken();
    sessionStorage.removeItem('userName');
    sessionStorage.removeItem('userCode');
    setIsAuthenticated(false);
    setUserName(null);
    setUserCode(null);
  };

  const value = {
    isAuthenticated,
    userName,
    userCode,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext; 