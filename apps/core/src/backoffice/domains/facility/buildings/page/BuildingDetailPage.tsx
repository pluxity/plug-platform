import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@plug/ui";
import { Button } from "@plug/ui";
import { PageContainer } from "@/backoffice/common/view/layouts";
import { useBuildingDetailSWR, useBuildingHistory, useDeleteBuilding } from "@plug/common-services";
import { ModalForm, ModalFormItem } from "@plug/ui";

const BuildingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const buildingId = parseInt(id || "0");
  
  const { data: building, isLoading, error } = useBuildingDetailSWR(buildingId);
  const { data: buildingHistory } = useBuildingHistory(buildingId);
  const { execute: deleteBuilding } = useDeleteBuilding(buildingId);

  const handleDelete = async () => {
    if (confirm("해당 빌딩을 삭제하시겠습니까?")) {
      try {
        await deleteBuilding();
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
    <PageContainer title={`${building?.facility.name} 상세 정보`}>
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
                          <span className="font-medium text-gray-800">
                            {floor.floorId}
                          </span>
                        </div>
                        <div className="mt-1">
                          <span className="text-gray-500 mr-1">이름</span>
                          <span className="font-medium text-gray-800">
                            {floor.name}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">
                    등록된 층 정보가 없습니다.
                  </div>
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
                    <p>{building.facility.drawing.originalFileName}</p>
                  ) : (
                    "드로잉 이미지가 없습니다."
                  )}
                </div>
              </ModalFormItem>
              <ModalFormItem
                label="드로잉 변경 이력"
                className="col-span-2 border-b"
              >
                <div className="py-2">
                  {!buildingHistory ? (
                    <p>데이터를 불러오는 중...</p>
                  ) : buildingHistory.length === 0 ? (
                    <p>변경 이력이 없습니다.</p>
                  ) : (
                    <ul className="grid grid-cols-4 gap-2">
                      {buildingHistory?.map((history, index) => (
                        <div
                          key={index}
                          className="border border-gray-200 rounded-sm bg-gray-50 px-3 py-2 text-sm text-gray-700 min-w-[120px] flex flex-col gap-1"
                        >
                          <div className="flex justify-between items-center gap-2">
                            <div>
                              <span className="text-gray-500 mr-1">날짜</span>
                              <span className="font-medium text-gray-800">
                                {history.createdAt
                                  ? new Date(history.createdAt).toLocaleString(
                                      "ko-KR",
                                    )
                                  : "-"}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500 mr-1">수정자</span>
                              <span className="font-medium text-gray-800">
                                {history.createdBy || "-"}
                              </span>
                            </div>
                          </div>
                          <div className="col-span-2 flex">
                            <span className="text-gray-500 mr-1">파일명</span>
                            <a href={history.file.url}>
                              <p className="font-bold text-blue-600">
                                {history.file.originalFileName}
                              </p>
                            </a>
                          </div>
                          <div className="col-span-2">
                            <span className="text-gray-500 mr-1">설명</span>
                            <span className="font-medium text-gray-800">
                              {history.description || "-"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </ul>
                  )}
                </div>
              </ModalFormItem>

              <ModalFormItem label="생성">
                <div className="grid grid-cols-2 gap-2">
                  <div className="border border-gray-200 rounded-sm bg-gray-50 px-3 py-2">
                    <span className="text-gray-500 mr-1">생성일</span>
                    <span className="font-medium text-gray-800">
                      {building.facility.createdAt
                        ? new Date(
                            building.facility.createdAt,
                          ).toLocaleDateString("ko-KR")
                        : "-"}
                    </span>
                  </div>
                  <div className="border border-gray-200 rounded-sm bg-gray-50 px-3 py-2">
                    <span className="text-gray-500 mr-1">생성인</span>
                    <span className="font-medium text-gray-800">
                      {building.facility.createdBy || "-"}
                    </span>
                  </div>
                </div>
              </ModalFormItem>

              <ModalFormItem label="수정">
                <div className="grid grid-cols-2 gap-2">
                  <div className="border border-gray-200 rounded-sm bg-gray-50 px-3 py-2">
                    <span className="text-gray-500 mr-1">마지막 수정일</span>
                    <span className="font-medium text-gray-800">
                      {building.facility.updatedAt
                        ? new Date(
                            building.facility.updatedAt,
                          ).toLocaleDateString("ko-KR")
                        : "-"}
                    </span>
                  </div>
                  <div className="border border-gray-200 rounded-sm bg-gray-50 px-3 py-2">
                    <span className="text-gray-500 mr-1">수정인</span>
                    <span className="font-medium text-gray-800">
                      {building.facility.updatedBy || "-"}
                    </span>
                  </div>
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