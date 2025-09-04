import { UserProfile } from '@/global/components';

import React from 'react';
import { useNavigate } from 'react-router-dom';
const BackofficeHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
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
            <UserProfile showAdminPortal={false} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default BackofficeHeader;