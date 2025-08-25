import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Profile } from '@plug/ui';
import { useSignOut } from '@plug/common-services/services';
import { useAuthStore } from '@/global/store';
import UserProfileModal from '../components/UserProfileModal';

const BackofficeHeader: React.FC = () => {
  const navigate = useNavigate();
  const { execute: signOut, isLoading: isSigningOut } = useSignOut();
  const { user, clearAuth } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const result = await signOut();
      if (result.response?.ok) {
        clearAuth();
        navigate('/login');
      } else {
        console.error('로그아웃에 실패했습니다.');
        clearAuth();
        navigate('/login');
      }
    } catch {
      console.error('로그아웃 중 오류가 발생했습니다.');
      clearAuth();
      navigate('/login');
    }
  };

  const handleProfileClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="flex items-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  aria-label="홈으로 이동"
                >
                  <img
                    src="/logo.svg"
                    alt="Plug Platform"
                    className="h-8 w-auto select-none"
                    draggable={false}
                  />
                </button>
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Profile
                profileTitle={user?.name || "사용자"}
                profileDescription={user?.code || ""}
                profileItems={[
                  { title: '내 정보', onClick: handleProfileClick },
                ]}
                profileButton={{
                  title: isSigningOut ? "로그아웃 중..." : "로그아웃",
                  onClick: handleLogout
                }}
              />
            </div>
          </div>
        </div>
      </header>
      <UserProfileModal show={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default BackofficeHeader;