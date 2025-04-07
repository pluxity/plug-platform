import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';

import type { DataResponseBody } from '@plug/api-hooks';
import { signIn, useUserMe } from '@plug/common-services';
import type { SignInResponse } from '@plug/common-services';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { login, setUser } = useAuthStore();
  const navigate = useNavigate();
      
  const { execute } = useUserMe();
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError('아이디와 비밀번호를 입력해주세요.');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // API 직접 호출로 로그인 처리
      const response: DataResponseBody<SignInResponse> = await signIn({
        username,
        password
      });
      
      if (response.code !== 200) {
        throw new Error('로그인에 실패했습니다.');
      }
      
      const accessToken = response.data.accessToken;
      
      // 액세스 토큰 저장 - 이 시점에 tokenGetter에 값이 설정됨
      login(accessToken, '', '');

      // 잠시 지연 추가
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // 사용자 정보 조회 및 저장
      const userData = await execute();
      
      if (userData) {
        setUser(userData);
        
        // 역할에 따른 리다이렉션
        if (userData.roles.some((role) => role.name === 'ADMIN')) {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        throw new Error('사용자 정보를 가져오는데 실패했습니다.');
      }
      
    } catch (err) {
      console.error('로그인 실패:', err);
      setError('로그인에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <div className="rounded-lg bg-white px-6 py-8 shadow-md">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-6">부산 지하철</h1>
            <h2 className="text-xl font-semibold mb-6">로그인</h2>
          </div>
          
          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}
          
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="username">
                아이디
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="아이디 입력"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
                비밀번호
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="비밀번호 입력"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className={`w-full rounded-md bg-primary-600 py-2 px-4 text-white font-medium ${
                loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primary-700'
              }`}
            >
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <a href="/signup" className="text-sm text-primary-600 hover:text-primary-700">
              계정이 없으신가요? 회원가입
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
