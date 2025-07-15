import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@plug/ui";
import { Button } from "@plug/ui";
import { useNavigate } from "react-router-dom";

const Factories: React.FC = () => {
  const navigate = useNavigate();

  const factories = [{
    id: 1,
    name: "공장1",
    description: "공장 설명",
    code: "123456",
    createdAt: "today"
  }];
  const isLoading = false;
  const error = null;

  const handleDeleteFactory = async (factoryId: number) => {
    if (confirm("해당 공장을 삭제하시겠습니까?")) {
      try {
        // TODO: 공장 삭제 API 호출 구현 필요
        alert(`${factoryId}공장이 삭제되었습니다.`);
      } catch (err) {
        console.error("공장 삭제 오류:", err);
        alert("공장을 삭제하는 중 오류가 발생했습니다.");
      }
    }
  };

  const handleAddFactory = () => {
    navigate("/admin/facility/factories/add");
  };

  const handleViewFactory = (factoryId: number) => {
    navigate(`/admin/facility/factories/${factoryId}`);
  };

  const handleEditFactory = (factoryId: number) => {
    navigate(`/admin/facility/factories/${factoryId}/edit`);
  };

  const handleRefresh = () => {
    // TODO: 데이터 갱신 로직 구현 필요
  };

  return (
    <>
      <div className="flex flex-row items-center justify-between mb-6">
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh}>
            새로고침
          </Button>
          <Button variant="default" onClick={handleAddFactory}>
            새 공장 추가
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">데이터를 불러오는 중...</div>
      ) : error ? (
        <div className="text-center text-red-500 p-8">
          데이터를 불러오는 중 오류가 발생했습니다.
        </div>
      ) : factories && factories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {factories.map((factory) => (
            <Card key={factory.id} className="h-full">
              <CardHeader>
                <CardTitle>{factory.name}</CardTitle>
                <CardDescription>코드: {factory.code}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">설명</p>
                    <p>{factory.description || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">생성일</p>
                    <p>
                      {factory.createdAt
                        ? new Date(factory.createdAt).toLocaleDateString("ko-KR")
                        : "-"}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewFactory(factory.id)}
                >
                  상세 보기
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditFactory(factory.id)}
                  >
                    수정
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteFactory(factory.id)}
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
            <p className="mb-4 text-gray-500">등록된 공장이 없습니다.</p>
            <Button variant="default" onClick={handleAddFactory}>
              새 공장 추가
            </Button>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default Factories;