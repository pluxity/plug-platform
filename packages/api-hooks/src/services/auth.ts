type TokenStorage = {
  getToken: () => string | null;
  setToken: (token: string) => void;
  removeToken: () => void;
};

type TokenRefresher = {
  shouldRefresh: (error: any) => boolean;
  refresh: () => Promise<string>;
};

const LocalStorageTokenStorage: TokenStorage = {
  getToken: () => localStorage.getItem('accessToken'),
  setToken: (token) => localStorage.setItem('accessToken', token),
  removeToken: () => localStorage.removeItem('accessToken')
};

let currentTokenStorage: TokenStorage = LocalStorageTokenStorage;
let tokenRefresher: TokenRefresher | null = null;

export const TokenProvider = {
  setTokenStorage: (storage: TokenStorage) => {
    currentTokenStorage = storage;
  },
  
  setTokenRefresher: (refresher: TokenRefresher) => {
    tokenRefresher = refresher;
  },
  
  getToken: () => currentTokenStorage.getToken(),
  
  setToken: (token: string) => currentTokenStorage.setToken(token),
  
  removeToken: () => currentTokenStorage.removeToken(),
  
  shouldRefreshToken: (error: any) => {
    return tokenRefresher ? tokenRefresher.shouldRefresh(error) : false;
  },
  
  refreshToken: async () => {
    if (!tokenRefresher) {
      throw new Error('토큰 리프레셔가 설정되지 않았습니다.');
    }
    
    try {
      const newToken = await tokenRefresher.refresh();
      currentTokenStorage.setToken(newToken);
      return newToken;
    } catch (error) {
      currentTokenStorage.removeToken();
      throw error;
    }
  }
}; 