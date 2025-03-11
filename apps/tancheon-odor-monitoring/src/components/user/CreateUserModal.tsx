// apps/tancheon-odor-monitoring/src/app/components/CreateUserModal.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '@plug/ui/src/components/Button';

interface User {
  id: number;
  user_name: string;
  password?: string; // password는 선택적
  role: string;
}

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserCreated: () => void; // 사용자 생성 후 목록 갱신을 위한 콜백
  user?: User; // 수정할 사용자 정보 (선택적)
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({ isOpen, onClose, onUserCreated, user }) => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setUserName(user.user_name);
      setPassword(user.password || '');
      setRole(user.role);
    } else {
        setUserName("")
        setPassword("")
        setRole("")
    }
  }, [user]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
      setError("")
    try {
      const response = await fetch(user ? `/api/users` : '/api/users', {
        method: user ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user ? { id: user.id, user_name: userName, password, role } : { user_name: userName, password, role }),
      });

      if (response.ok) {
        alert(user? '사용자가 수정되었습니다.' : '사용자가 등록되었습니다.');
        onUserCreated(); // 목록 갱신 콜백 호출
        onClose(); // 모달 닫기
      } else {
          const data = await response.json();
          setError(data.message || (user? '사용자 수정에 실패했습니다.' : '사용자 생성에 실패했습니다.'));
      }
    } catch (error) {
      console.error('사용자 등록 오류:', error);
        setError("사용자 등록에 실패했습니다.")
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">{user ? '사용자 수정' : '사용자 생성'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="user_name" className="block text-gray-700">
              사용자 이름
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
            />
          </div>
          <div className="mb-4">
            <label htmlFor="role" className="block text-gray-700">
              Role
            </label>
            <input
              type="text"
              id="role"
              className="w-full border border-gray-300 p-2 rounded-md"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            />
          </div>
            {error && <div className='text-red-500 mb-4'>{error}</div>}
          <div className="flex justify-end">
            <Button
              type="button"
              onClick={onClose}
              className="mr-2"
            >
              닫기
            </Button>
            <Button type="submit" color="primary">
              {user ? '수정' : '생성'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserModal;
