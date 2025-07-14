import React from "react";
import { Card, CardContent } from "@plug/ui";
import { Button } from "@plug/ui";
import { useBuildingsSWR } from "@plug/common-services";
import { api } from "@plug/api-hooks";
import { useNavigate } from "react-router-dom";
import type { BuildingResponse } from "@plug/common-services";

const Buildings: React.FC = () => {
  const { data: buildings, isLoading, error, mutate } = useBuildingsSWR();
  const navigate = useNavigate();

  const handleDeleteBuilding = async (buildingId: number) => {
    if (confirm("해당 빌딩을 삭제하시겠습니까?")) {
      try {
        await api.delete(`buildings/${buildingId}`);
        await mutate();
      } catch (err) {
        console.error("빌딩 삭제 오류:", err);
        alert("빌딩을 삭제하는 중 오류가 발생했습니다.");
      }
    }
  };

  const handleAddBuilding = () => {
    navigate("/admin/buildings/add");
  };

  const handleViewBuilding = (buildingId: number) => {
    navigate(`/admin/buildings/${buildingId}`);
  };

  const handleEditBuilding = (buildingId: number) => {
    navigate(`/admin/buildings/${buildingId}/edit`);
  };

  const getRandomColor = (seed: number) => {
    const colors = [
      "bg-gray-700",
      "bg-zinc-700",
      "bg-slate-700",
      "bg-stone-700",
      "bg-neutral-700",
      "bg-rose-800",
      "bg-emerald-800",
      "bg-cyan-800",
      "bg-violet-800",
    ];
    return colors[seed % colors.length];
  };

  const getInitial = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : "B";
  };

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center p-8">데이터를 불러오는 중...</div>
      ) : error ? (
        <div className="text-center text-red-500 p-8">
          데이터를 불러오는 중 오류가 발생했습니다.
        </div>
      ) : buildings && buildings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {buildings.map((building: BuildingResponse) => (
            <Card
              key={building.facility.id}
              className="group overflow-hidden transition-all duration-300 hover:shadow-lg"
              onClick={() => handleViewBuilding(building.facility.id)}
            >
              <div
                className={`relative w-full h-40 ${getRandomColor(building.facility.id)}`}
              >
                {building.facility.thumbnail.url ? (
                  <img
                    src={building.facility.thumbnail.url}
                    alt={building.facility.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-6xl font-bold">
                    {getInitial(building.facility.name)}
                  </div>
                )}

                <div className="absolute inset-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <Button
                      variant="default"
                      size="sm"
                      className="bg-white text-black hover:bg-gray-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewBuilding(building.facility.id);
                      }}
                    >
                      상세 보기
                    </Button>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold truncate">
                    {building.facility.name}
                  </h3>
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    {building.facility.code}
                  </span>
                </div>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {building.facility.description || "-"}
                </p>
              </div>

              <div className="px-4 py-3 border-t flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditBuilding(building.facility.id);
                  }}
                >
                  수정
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteBuilding(building.facility.id);
                  }}
                >
                  삭제
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-8">
            <p className="mb-4 text-gray-500">등록된 건물이 없습니다.</p>
            <Button variant="default" onClick={handleAddBuilding}>
              새 건물 추가
            </Button>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default Buildings;
