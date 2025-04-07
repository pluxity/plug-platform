import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const [isStationOpen, setIsStationOpen] = useState(false);
  const location = useLocation();

  const handleStationClick = () => {
    setIsStationOpen(!isStationOpen);
  };

  return (
    <div className="w-64 h-screen bg-gray-800 text-white fixed left-0 top-0">
      <div className="p-4">
        <h1 className="text-xl font-bold mb-6">부산 지하철 관리</h1>
        <nav>
          <ul className="space-y-2">
            <li>
              <Link 
                to="/admin/users" 
                className={`block p-2 rounded hover:bg-gray-700 ${location.pathname === '/admin/users' ? 'bg-gray-700' : ''}`}
              >
                사용자 관리
              </Link>
            </li>
            <li>
              <div>
                <button
                  onClick={handleStationClick}
                  className={`w-full text-left p-2 rounded hover:bg-gray-700 ${location.pathname.includes('/admin/station') ? 'bg-gray-700' : ''}`}
                >
                  역사 관리
                </button>
                {isStationOpen && (
                  <ul className="ml-4 mt-2 space-y-2">
                    <li>
                      <Link 
                        to="/admin/station/categories"
                        className={`block p-2 rounded hover:bg-gray-700 ${location.pathname === '/admin/station/categories' ? 'bg-gray-700' : ''}`}
                      >
                        카테고리 관리
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/admin/station/drawings"
                        className={`block p-2 rounded hover:bg-gray-700 ${location.pathname === '/admin/station/drawings' ? 'bg-gray-700' : ''}`}
                      >
                        도면 관리
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
            </li>
            <li>
              <Link 
                to="/admin/objects"
                className={`block p-2 rounded hover:bg-gray-700 ${location.pathname === '/admin/objects' ? 'bg-gray-700' : ''}`}
              >
                오브젝트 관리
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar; 