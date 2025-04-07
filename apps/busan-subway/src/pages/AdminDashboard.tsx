import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const recentActivities = [
    { id: 1, activity: '사용자 로그인', user: 'user123', time: '10분 전' },
    { id: 2, activity: '데이터 업데이트', user: 'admin', time: '30분 전' },
    { id: 3, activity: '새 사용자 등록', user: 'system', time: '1시간 전' },
    { id: 4, activity: '설정 변경', user: 'admin', time: '2시간 전' },
    { id: 5, activity: '백업 완료', user: 'system', time: '3시간 전' },
  ];
  
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">관리자 대시보드</h1>
            <p className="text-gray-600">안녕하세요, {user?.name || '관리자'}님</p>
          </div>
          <nav>
            <button
              onClick={handleLogout}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              로그아웃
            </button>
          </nav>
        </div>
      </header>
      
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* 통계 카드 섹션 */}
        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="text-lg font-semibold text-gray-700">총 사용자</h2>
            <p className="mt-2 text-3xl font-bold">1,234</p>
            <p className="mt-2 text-sm text-green-600">+5% 지난 주 대비</p>
          </div>
          
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="text-lg font-semibold text-gray-700">일일 방문자</h2>
            <p className="mt-2 text-3xl font-bold">567</p>
            <p className="mt-2 text-sm text-red-600">-2% 어제 대비</p>
          </div>
          
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="text-lg font-semibold text-gray-700">시스템 상태</h2>
            <p className="mt-2 text-3xl font-bold text-green-600">정상</p>
            <p className="mt-2 text-sm text-gray-600">모든 서비스 작동 중</p>
          </div>
          
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="text-lg font-semibold text-gray-700">시스템 리소스</h2>
            <p className="mt-2 text-3xl font-bold">65%</p>
            <p className="mt-2 text-sm text-gray-600">CPU 사용량</p>
          </div>
        </section>
        
        {/* 최근 활동 섹션 */}
        <section className="mb-8">
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-xl font-bold text-gray-900">최근 활동</h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      활동
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      사용자
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      시간
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentActivities.map((activity) => (
                    <tr key={activity.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {activity.activity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {activity.user}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {activity.time}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
        
        {/* 빠른 액션 버튼 */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            사용자 관리
          </button>
          <button className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700">
            데이터 백업
          </button>
          <button className="rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700">
            시스템 설정
          </button>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard; 