import Cookies from 'js-cookie';

// 쿠키 기본 옵션
const defaultOptions: Cookies.CookieAttributes = {
  path: '/',
  expires: 7, // 7일
  sameSite: 'lax'
};

// 직접 쿠키 조작 함수 정의
export const cookieStorage = {
  // 쿠키 설정
  setCookie: (key: string, value: string, options?: Cookies.CookieAttributes) => {
    try {
      // 쿠키 만료일 정의 (기본 7일)
      const cookieOptions = {
        ...defaultOptions,
        ...options
      };
      
      console.log(`쿠키 설정: ${key} = ${value}`, cookieOptions);
      Cookies.set(key, value, cookieOptions);
      
      // 설정 확인
      const saved = Cookies.get(key);
      console.log(`쿠키 설정 확인: ${key} = ${saved}`);
      
      return !!saved;
    } catch (error) {
      console.error(`쿠키 설정 오류 (${key}):`, error);
      return false;
    }
  },
  
  // 쿠키 조회
  getCookie: (key: string) => {
    try {
      const value = Cookies.get(key);
      console.log(`쿠키 조회: ${key} = ${value || '없음'}`);
      return value;
    } catch (error) {
      console.error(`쿠키 조회 오류 (${key}):`, error);
      return null;
    }
  },
  
  // 쿠키 삭제
  removeCookie: (key: string, options?: Cookies.CookieAttributes) => {
    try {
      console.log(`쿠키 삭제: ${key}`);
      Cookies.remove(key, {
        ...defaultOptions,
        ...options
      });
      return true;
    } catch (error) {
      console.error(`쿠키 삭제 오류 (${key}):`, error);
      return false;
    }
  },
  
  // 모든 쿠키 삭제
  clearAllCookies: () => {
    try {
      const allCookies = Cookies.get();
      console.log('모든 쿠키 삭제:', Object.keys(allCookies));
      
      Object.keys(allCookies).forEach((cookieName) => {
        Cookies.remove(cookieName, { path: '/' });
      });
      return true;
    } catch (error) {
      console.error('모든 쿠키 삭제 오류:', error);
      return false;
    }
  },
  
  // 모든 쿠키 확인 (디버깅용)
  getAllCookies: () => {
    try {
      const allCookies = Cookies.get();
      console.log('모든 쿠키 목록:', allCookies);
      return allCookies;
    } catch (error) {
      console.error('쿠키 목록 조회 오류:', error);
      return {};
    }
  }
};

// 쿠키 이름 상수
const COOKIE_BASE_NAME = 'pluxity';
export const ACCESS_TOKEN_NAME = `${COOKIE_BASE_NAME}_accesstoken`;
export const REFRESH_TOKEN_NAME = `${COOKIE_BASE_NAME}_refreshtoken`;

// 테스트 쿠키 설정 (개발용)
export const testCookies = () => {
  try {
    console.log('테스트 쿠키 설정 시작');
    cookieStorage.setCookie('test_cookie', 'test_value');
    const value = cookieStorage.getCookie('test_cookie');
    console.log('테스트 쿠키 값:', value);
    console.log('모든 쿠키 확인:', cookieStorage.getAllCookies());
    return !!value;
  } catch (error) {
    console.error('테스트 쿠키 오류:', error);
    return false;
  }
};
