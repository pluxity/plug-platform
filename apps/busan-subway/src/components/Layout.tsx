import React from 'react';
import useAuthStore from '../stores/authStore';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const logout = useAuthStore((state) => state.logout);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header - 보더를 헤더 자체에 추가 */}
      <header className="bg-white border-b border-gray-200 shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">부산 지하철</h1>
            <button
              onClick={logout}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
            >
              로그아웃
            </button>
          </div>
        </div>
      </header>

      {/* Main Content - shadow 제거 */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </div>
      </main>

      {/* Footer - 상단에 보더 추가 */}
      <footer className="bg-gray-800 text-white border-t border-gray-700 shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-center">
            <p className="text-sm">© 2024 부산 지하철. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
