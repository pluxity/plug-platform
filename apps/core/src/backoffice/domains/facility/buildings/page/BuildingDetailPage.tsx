import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@plug/ui";
import { Button } from "@plug/ui";
import { PageContainer } from "@/backoffice/common/view/layouts";
import { useBuildingDetailSWR, useDeleteBuilding } from "@plug/common-services";
import { ModalForm, ModalFormItem } from "@plug/ui";
// import { api } from "@plug/api-hooks";

const BuildingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const buildingId = parseInt(id || "0");
  
  const { data: building, isLoading, error } = useBuildingDetailSWR(buildingId);
  const { execute: deleteBuilding } = useDeleteBuilding(buildingId);

  const handleDelete = async () => {
    if (confirm("해당 빌딩을 삭제하시겠습니까?")) {
      try {
        await deleteBuilding();
        // await api.delete(`buildings/${buildingId}`);
        navigate("/admin/facility");
      } catch (err) {
        console.error("빌딩 삭제 오류:", err);
        alert("빌딩을 삭제하는 중 오류가 발생했습니다.");
      }
    }
  };
  const handleBack = () => {
    navigate(-1);
  };

  const handleEdit = () => {
    navigate(`/admin/building/${buildingId}/edit`);
  };

  return (
    <PageContainer title="빌딩 상세 정보">
      {isLoading ? (
        <div className="flex justify-center p-8">데이터를 불러오는 중...</div>
      ) : error ? (
        <div className="text-center text-red-500 p-8">
          데이터를 불러오는 중 오류가 발생했습니다.
        </div>
      ) : building ? (
        <Card>
          <CardContent>
            <ModalForm className="grid grid-cols-2 py-5">
              <ModalFormItem label="ID">
                <div className="py-2">{building.facility.id}</div>
              </ModalFormItem>

              <ModalFormItem label="건물명">
                <div className="py-2">{building.facility.name}</div>
              </ModalFormItem>

              <ModalFormItem label="코드">
                <div className="py-2">{building.facility.code}</div>
              </ModalFormItem>

              <ModalFormItem label="설명">
                <div className="py-2">
                  {building.facility.description || "-"}
                </div>
              </ModalFormItem>

              <ModalFormItem label="생성일">
                <div className="py-2">
                  {building.facility.createdAt
                    ? new Date(building.facility.createdAt).toLocaleDateString(
                        "ko-KR",
                      )
                    : "-"}
                </div>
              </ModalFormItem>

              <ModalFormItem label="생성자">
                <div className="py-2">{building.facility.createdBy || "-"}</div>
              </ModalFormItem>

              <ModalFormItem label="수정일">
                <div className="py-2">
                  {building.facility.updatedAt
                    ? new Date(building.facility.updatedAt).toLocaleDateString(
                        "ko-KR",
                      )
                    : "-"}
                </div>
              </ModalFormItem>

              <ModalFormItem label="수정자">
                <div className="py-2">{building.facility.updatedBy || "-"}</div>
              </ModalFormItem>

              <ModalFormItem label="층 정보" className="col-span-2">
                {building.floors && building.floors.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {building.floors.map((floor, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-sm bg-gray-50 px-3 py-2 text-sm text-gray-700 min-w-[120px]"
                      >
                        <div>
                          <span className="text-gray-500 mr-1">ID</span>
                          <span className="font-medium text-gray-800">{floor.floorId}</span>
                        </div>
                        <div className="mt-1">
                          <span className="text-gray-500 mr-1">이름</span>
                          <span className="font-medium text-gray-800">{floor.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">등록된 층 정보가 없습니다.</div>
                )}
              </ModalFormItem>
              <ModalFormItem label="썸네일 이미지">
                <div className="py-2">
                  {building.facility.thumbnail.url ? (
                    <img
                      src={building.facility.thumbnail.url}
                      alt="썸네일 이미지"
                    />
                  ) : (
                    "썸네일 이미지가 없습니다."
                  )}
                </div>
              </ModalFormItem>
              <ModalFormItem label="드로잉 이미지">
                <div className="py-2">
                  {building.facility.drawing.url ? (
                    <img
                      src={building.facility.drawing.url}
                      alt="드로잉 이미지"
                    />
                  ) : (
                    "드로잉 이미지가 없습니다."
                  )}
                </div>
              </ModalFormItem>
            </ModalForm>
          </CardContent>
        </Card>
      ) : (
        <div className="text-center p-8">빌딩 정보가 없습니다.</div>
      )}
      <div className="flex items-center justify-end gap-2 mb-6">
        <Button variant="outline" onClick={handleDelete}>
          삭제
        </Button>
        <Button variant="outline" onClick={handleBack}>
          돌아가기
        </Button>
        <Button variant="default" onClick={handleEdit}>
          수정
        </Button>
      </div>
    </PageContainer>
  );
};

export default BuildingDetailPage;