import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminProfile from "@/backoffice/common/view/components/AdminProfile";

const BackofficeHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b z-10 shadow-xs">
      <div className="px-2 pl-6 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">
              <button
                type="button"
                onClick={() => navigate('/admin')}
                className="flex items-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                aria-label="홈으로 이동"
              >
                <img
                  src="logo.svg"
                  alt="Plug Platform"
                  className="h-8 w-auto select-none"
                  draggable={false}
                />
              </button>
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <AdminProfile showAdminPortal={false} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default BackofficeHeader;