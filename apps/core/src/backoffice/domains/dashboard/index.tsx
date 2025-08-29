import React, { useMemo, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, Badge } from '@plug/ui'
import { useUsersWithIsLoggedIn, useFacilities, domainUtils } from '@plug/common-services'

const Dashboard: React.FC = () => {
  const { data: users, isLoading: isUsersLoading, execute: loadUsers } = useUsersWithIsLoggedIn();
  const activeUserCount = useMemo(() => {
    if (!users) return 0;
    return users.filter(u => u.isLoggedIn).length;
  }, [users]);

  const { data: facilities, isLoading: isFacilitiesLoading, execute: loadFacilities } = useFacilities();

  // 최초 로드시 데이터 조회
  useEffect(() => {
    loadUsers();
    loadFacilities();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const facilityTypeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    if (facilities) {
      facilities.forEach(f => {
        const t = f.type || 'UNKNOWN';
        counts[t] = (counts[t] || 0) + 1;
      });
    }
    return counts;
  }, [facilities]);

  const allFacilityTypes = domainUtils.getAllDomains();
  const totalFacilities = facilities?.length || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">대시보드</h2>
        <div className="flex gap-2">
          <Badge variant="secondary">사용자 {isUsersLoading ? '...' : `${activeUserCount}/${users?.length ?? 0}`}</Badge>
          <Badge variant="default" className="bg-blue-600 text-white">시설 {isFacilitiesLoading ? '...' : totalFacilities}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 사용자/시설 요약 */}
        <Card className="lg:col-span-2 p-4">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              실시간 현황
              <Badge variant="default" className="bg-green-600 text-white">업데이트</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{isUsersLoading ? '...' : activeUserCount}</div>
                <div className="text-sm text-gray-600">로그인 사용자</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{isFacilitiesLoading ? '...' : totalFacilities}</div>
                <div className="text-sm text-gray-600">총 시설 수</div>
              </div>
              {allFacilityTypes.slice(0,2).map(ft => (
                <div key={ft} className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{facilityTypeCounts[ft] || 0}</div>
                  <div className="text-sm text-gray-600">{domainUtils.getConfig(ft).displayName}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 시설 타입별 분포 */}
        <Card className="p-4">
          <CardHeader>
            <CardTitle>시설 타입별</CardTitle>
          </CardHeader>
            <CardContent className="space-y-3 p-4">
              {allFacilityTypes.map(ft => {
                const count = facilityTypeCounts[ft] || 0;
                const percentage = totalFacilities ? Math.round((count / totalFacilities) * 100) : 0;
                return (
                  <div key={ft}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{domainUtils.getConfig(ft).displayName}</span>
                      <span>{isFacilitiesLoading ? '...' : `${count} (${percentage}%)`}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard
