import Cookies from 'js-cookie';

const CookieStorageBuilder = (cookies: typeof Cookies) => ({
  setCookie: (key: string, value: string, options?: Cookies.CookieAttributes) =>
    cookies.set(key, value, {
      path: '/',
      domain: '',
      secure: process.env.NODE_ENV === 'production' ? true : false,
      httpOnly: false,
      sameSite: 'Lax',
      ...options
    }),
  getCookie: (key: string) => cookies.get(key),
  removeCookie: (key: string) => cookies.remove(key),
  clearAllCookies: () => {
    const allCookies = cookies.get();

    Object.keys(allCookies).forEach((cookieName) => {
      cookies.remove(cookieName);
    });
  },
});

export const cookieStorage = CookieStorageBuilder(Cookies);

const COOKIE_BASE_NAME = 'pluxity';

export const ACCESS_TOKEN_NAME = `${COOKIE_BASE_NAME}_accesstoken`;
export const REFRESH_TOKEN_NAME = `${COOKIE_BASE_NAME}_refreshtoken`;
