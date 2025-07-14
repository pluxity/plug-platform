import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@plug/ui";
import { Button } from "@plug/ui";
import { PageContainer } from "@/backoffice/common/view/layouts";
import { useBuildingDetailSWR } from "@plug/common-services";
import { ModalForm, ModalFormItem } from "@plug/ui";

const BuildingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const buildingId = parseInt(id || "0");
  
  const { data: building, isLoading, error } = useBuildingDetailSWR(buildingId);

  const handleBack = () => {
    navigate("/admin/buildings");
  };

  const handleEdit = () => {
    navigate(`/admin/buildings/${buildingId}/edit`);
  };

  return (
    <PageContainer title="빌딩 상세 정보">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleBack}>
            목록으로
          </Button>
          <h1 className="text-2xl font-bold">빌딩 상세 정보</h1>
        </div>
        {building && (
          <Button variant="default" onClick={handleEdit}>
            수정
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">데이터를 불러오는 중...</div>
      ) : error ? (
        <div className="text-center text-red-500 p-8">
          데이터를 불러오는 중 오류가 발생했습니다.
        </div>
      ) : building ? (
        <Card>
          <CardHeader>
            <CardTitle>{building.facility.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <ModalForm>
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
                <div className="py-2">{building.facility.description || '-'}</div>
              </ModalFormItem>
              
              <ModalFormItem label="생성일">
                <div className="py-2">
                  {building.facility.createdAt 
                    ? new Date(building.facility.createdAt).toLocaleDateString('ko-KR')
                    : '-'}
                </div>
              </ModalFormItem>
              
              <ModalFormItem label="생성자">
                <div className="py-2">{building.facility.createdBy || '-'}</div>
              </ModalFormItem>
              
              <ModalFormItem label="수정일">
                <div className="py-2">
                  {building.facility.updatedAt 
                    ? new Date(building.facility.updatedAt).toLocaleDateString('ko-KR')
                    : '-'}
                </div>
              </ModalFormItem>
              
              <ModalFormItem label="수정자">
                <div className="py-2">{building.facility.updatedBy || '-'}</div>
              </ModalFormItem>
              
              <ModalFormItem label="층 정보">
                <div className="py-2">
                  {building.floors && building.floors.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2">
                      {building.floors.map((floor, index) => (
                        <div key={index} className="p-2 border rounded">
                          <div><strong>ID:</strong> {floor.floorId}</div>
                          <div><strong>이름:</strong> {floor.name}</div>
                        </div>
                      ))}
                    </div>
                  ) : '등록된 층 정보가 없습니다.'}
                </div>
              </ModalFormItem>
            </ModalForm>
          </CardContent>
        </Card>
      ) : (
        <div className="text-center p-8">빌딩 정보가 없습니다.</div>
      )}
    </PageContainer>
  );
};

export default BuildingDetail;