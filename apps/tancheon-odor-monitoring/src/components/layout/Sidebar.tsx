'use client';

interface SidebarProps {
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarCollapsed, toggleSidebar }) => {
  return (
    <aside 
      className={`bg-gray-100 transition-all duration-300 relative ${
        isSidebarCollapsed ? 'w-16' : 'w-80'
      }`}
    >
      <button 
        onClick={toggleSidebar}
        className="absolute -right-3 top-1/2 transform -translate-y-1/2 bg-gray-200 rounded-full p-1 shadow-md z-10 hover:bg-gray-300"
      >
        {isSidebarCollapsed ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        )}
      </button>
      
      {!isSidebarCollapsed && (
        <div className="mt-6 px-4">
          <div className="bg-white rounded-lg shadow p-4 h-64">
            <h3 className="text-sm font-semibold mb-2">악취 지수 추이</h3>
            <div className="h-52 bg-gray-50 rounded flex items-center justify-center">
              <p className="text-gray-400 text-sm">차트가 이곳에 표시됩니다</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4 h-64 mt-4">
            <h3 className="text-sm font-semibold mb-2">측정소별 현황</h3>
            <div className="h-52 bg-gray-50 rounded flex items-center justify-center">
              <p className="text-gray-400 text-sm">차트가 이곳에 표시됩니다</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar; 