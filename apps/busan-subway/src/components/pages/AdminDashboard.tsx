import React from 'react';
import useAuthStore from '../../stores/authStore';

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">{user?.name} 님</span>
            <button
              onClick={logout}
              className="px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              로그아웃
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 대시보드 카드 1 */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">사용자 통계</h2>
              <span className="text-3xl font-bold text-blue-600">157</span>
            </div>
            <p className="mt-2 text-sm text-gray-500">총 등록 사용자 수</p>
          </div>

          {/* 대시보드 카드 2 */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">일일 방문자</h2>
              <span className="text-3xl font-bold text-green-600">34</span>
            </div>
            <p className="mt-2 text-sm text-gray-500">오늘 방문한 사용자 수</p>
          </div>

          {/* 대시보드 카드 3 */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">시스템 상태</h2>
              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">정상</span>
            </div>
            <p className="mt-2 text-sm text-gray-500">모든 서비스가 정상 작동 중입니다</p>
          </div>
        </div>

        {/* 최근 활동 섹션 */}
        <div className="mt-8 bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">최근 활동</h2>
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
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상태
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    로그인
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    김철수
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    5분 전
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">성공</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    데이터 업데이트
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    이영희
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    30분 전
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">성공</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    로그인 시도
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    unknown_user
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    1시간 전
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">실패</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard; 