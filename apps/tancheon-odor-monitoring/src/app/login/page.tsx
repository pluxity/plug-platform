// apps/tancheon-odor-monitoring/src/app/login/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@plug/ui/src/components/Button';
import { useUserStore } from '@/stores/userStore';

const LoginPage = () => {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // Zustand 스토어에서 setUser 함수 가져오기
  const setUser = useUserStore((state) => state.setUser);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    try {
      console.log('로그인 시도:', userName);

      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_name: userName, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('로그인 성공:', data);
        // 쿠키 설정
        document.cookie = `token=${data.token}; path=/;`;
        
        // localStorage 대신 Zustand 스토어 사용
        setUser(data.user);
        
        router.push('/'); // 메인 페이지로 이동
      } else {
        const data = await response.json();
        setError(data.message || '로그인에 실패했습니다.');
        console.error('로그인 실패:', data);
      }
    } catch (err) {
      console.error('로그인 오류:', err);
      setError('로그인 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">로그인</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="user_name" className="block text-gray-700">
              아이디
            </label>
            <input
              type="text"
              id="user_name"
              className="w-full border border-gray-300 p-2 rounded-md"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              className="w-full border border-gray-300 p-2 rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" color="primary">
              로그인
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
