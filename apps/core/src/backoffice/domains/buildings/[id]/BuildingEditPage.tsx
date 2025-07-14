import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@plug/ui";
import { Button } from "@plug/ui";
import { Input } from "@plug/ui";
import { Label } from "@plug/ui";
import { PageContainer } from "@/backoffice/common/view/layouts";
import { useBuildingDetailSWR, useUpdateBuilding } from "@plug/common-services";
import { ModalForm, ModalFormItem } from "@plug/ui";
import type { FacilityUpdateRequest, Floors } from "@plug/common-services";

const BuildingEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const buildingId = parseInt(id || "0");
  
  const { data: building, isLoading, error, mutate } = useBuildingDetailSWR(buildingId);
  const { execute } = useUpdateBuilding(buildingId);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<FacilityUpdateRequest>({
    name: "",
    description: "",
  });
  
  const [floors, setFloors] = useState<Floors[]>([]);
  useEffect(() => {
    if (building) {
      setFormData({
        name: building.facility.name,
        description: building.facility.description || "",
      });
      
      setFloors(building.floors || []);
    }
  }, [building]);
  
  const handleInputChange = (field: keyof FacilityUpdateRequest, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleFloorNameChange = (index: number, name: string) => {
    const newFloors = [...floors];
    newFloors[index] = { ...newFloors[index], name };
    setFloors(newFloors);
  };

  const handleBack = () => {
    navigate(`/admin/buildings/${buildingId}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);
    
    try {
      await execute(formData);
      
      // 층 정보 업데이트 로직 (API가 있다고 가정)
      // 실제로는 이 부분은 API에 맞게 구현해야 함
      
      await mutate(); // 상세 정보 갱신
      navigate(`/admin/buildings/${buildingId}`); // 상세 페이지로 이동
    } catch (err) {
      console.error("빌딩 정보 업데이트 오류:", err);
      setFormError("빌딩 정보를 업데이트하는 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer title="빌딩 정보 수정">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleBack}>
            뒤로 가기
          </Button>
          <h1 className="text-2xl font-bold">빌딩 정보 수정</h1>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">데이터를 불러오는 중...</div>
      ) : error ? (
        <div className="text-center text-red-500 p-8">
          데이터를 불러오는 중 오류가 발생했습니다.
        </div>
      ) : building ? (
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>{building.facility.name} 수정</CardTitle>
            </CardHeader>
            <CardContent>
              <ModalForm>
                <ModalFormItem label="ID">
                  <div className="py-2">{building.facility.id}</div>
                </ModalFormItem>
                
                <ModalFormItem label="건물명">
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="건물명을 입력하세요"
                    required
                  />
                </ModalFormItem>
                
                <ModalFormItem label="코드">
                  <Input
                    type="text"
                    value={building.facility.code}
                    placeholder="건물 코드를 입력하세요"
                    required
                  />
                </ModalFormItem>
                
                <ModalFormItem label="설명">
                  <Input
                    type="text"
                    value={formData.description || ""}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="건물에 대한 설명을 입력하세요"
                  />
                </ModalFormItem>
                
                <ModalFormItem label="층 정보">
                  <div className="grid grid-cols-2 gap-2">
                    {floors.map((floor, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Label>{index + 1}층: </Label>
                        <Input
                          type="text"
                          value={floor.name}
                          onChange={(e) => handleFloorNameChange(index, e.target.value)}
                          placeholder={`${index + 1}층 이름`}
                        />
                      </div>
                    ))}
                  </div>
                </ModalFormItem>
                
                <ModalFormItem label="생성 정보">
                  <div className="grid grid-cols-2 gap-2 py-2">
                    <div><strong>생성일:</strong> {new Date(building.facility.createdAt).toLocaleDateString("ko-KR")}</div>
                    <div><strong>생성자:</strong> {building.facility.createdBy}</div>
                  </div>
                </ModalFormItem>
              </ModalForm>
              
              {formError && (
                <div className="text-red-500 mt-4 text-center">{formError}</div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleBack}
                disabled={isSubmitting}
              >
                취소
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "처리 중..." : "저장"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      ) : (
        <div className="text-center p-8">빌딩 정보가 없습니다.</div>
      )}
    </PageContainer>
  );
};

export default BuildingEdit;