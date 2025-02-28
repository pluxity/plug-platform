// apps/tancheon-odor-monitoring/src/components/SignupModal.tsx
import React, { useState } from 'react';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignupModal: React.FC<SignupModalProps> = ({ isOpen, onClose }) => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_name: userName, password }),
      });

      if (response.ok) {
        alert('회원가입이 완료되었습니다.');
        setUserName('');
        setPassword('');
        onClose(); // 모달 닫기
      } else {
        const data = await response.json()
        alert(data.message || '회원가입에 실패했습니다.');
      }
    } catch (error) {
      console.error('회원가입 오류:', error);
      alert('회원가입 중 오류가 발생했습니다.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">회원가입</h2>
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
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
            >
              닫기
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              가입하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupModal;
