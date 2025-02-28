// apps/tancheon-odor-monitoring/src/app/components/LoginForm.tsx
'use client';

import { useState } from 'react';
import { Button } from '@plug/ui/src/components/Button';

const LoginForm = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_name: userName, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const { token } = data;
        // JWT를 쿠키나 로컬 스토리지에 저장 (예시: 로컬 스토리지)
        localStorage.setItem('token', token);
        // 로그인 성공 후 페이지 이동
        window.location.href = '/'; // 원하는 페이지로 이동
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message);
      }
    } catch (error) {
      console.error('로그인 요청 오류:', error);
      setErrorMessage('로그인 요청 오류');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}
      <div className="mb-4">
        <input
          type="text"
          placeholder="User Name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="border p-2 mr-2"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 mr-2"
        />
        <Button color="primary" onClick={handleLogin}>
          Login
        </Button>
      </div>
    </div>
  );
};

export default LoginForm;
