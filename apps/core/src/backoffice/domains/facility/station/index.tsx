import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@plug/ui";
import { Button } from "@plug/ui";
import { useNavigate } from "react-router-dom";
import { useStationsSWR } from "@plug/common-services";
import { api } from "@plug/api-hooks";

const Stations: React.FC = () => {
  const { data: stations, isLoading, error, mutate } = useStationsSWR();
  const navigate = useNavigate();

  const handleDeleteStation = async (stationId: number) => {
    if (confirm("해당 역사를 삭제하시겠습니까?")) {
      try {
        await api.delete(`stations/${stationId}`);
        await mutate();
      } catch (err) {
        console.error("역사 삭제 오류:", err);
        alert("역사를 삭제하는 중 오류가 발생했습니다.");
      }
    }
  };

  const handleAddStation = () => {
    navigate("/admin/facility/stations/add");
  };

  const handleViewStation = (stationId: number) => {
    navigate(`/admin/facility/stations/${stationId}`);
  };

  const handleEditStation = (stationId: number) => {
    navigate(`/admin/facility/stations/${stationId}/edit`);
  };

  const handleRefresh = () => {
    mutate();
  };

  return (
    <>
      <div className="flex flex-row items-center justify-between mb-6">
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh}>
            새로고침
          </Button>
          <Button variant="default" onClick={handleAddStation}>
            새 역사 추가
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">데이터를 불러오는 중...</div>
      ) : error ? (
        <div className="text-center text-red-500 p-8">
          데이터를 불러오는 중 오류가 발생했습니다.
        </div>
      ) : stations && stations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stations.map((station) => (
            <Card key={station.facility.id} className="h-full">
              <CardHeader>
                <CardTitle>{station.facility.name}</CardTitle>
                <CardDescription>코드: {station.facility.code}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">설명</p>
                    <p>{station.facility.description || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">생성일</p>
                    <p>
                      {station.facility.createdAt
                        ? new Date(station.facility.createdAt).toLocaleDateString("ko-KR")
                        : "-"}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewStation(station.facility.id)}
                >
                  상세 보기
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditStation(station.facility.id)}
                  >
                    수정
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteStation(station.facility.id)}
                  >
                    삭제
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-8">
            <p className="mb-4 text-gray-500">등록된 역사가 없습니다.</p>
            <Button variant="default" onClick={handleAddStation}>
              새 역사 추가
            </Button>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default Stations;