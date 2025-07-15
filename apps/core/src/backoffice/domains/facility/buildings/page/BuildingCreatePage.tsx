
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@plug/ui";
import { Button } from "@plug/ui";
import { Input } from "@plug/ui";
import { Label } from "@plug/ui";
import { PageContainer } from "@/backoffice/common/view/layouts";
import { useCreateBuilding } from "@plug/common-services";
import { ModalForm, ModalFormItem } from "@plug/ui";
import type { BuildingCreateRequest, Floors } from "@plug/common-services";

const BuildingCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [buildingData, setBuildingData] = useState<BuildingCreateRequest>({
    facility: {
      name: "",
      code: "",
      description: "",
    },
    floors: []
  });

  const [floorCount, setFloorCount] = useState(1);

  const { execute } = useCreateBuilding();

  const handleInputChange = (field: string, value: string) => {
    setBuildingData(prev => ({
      ...prev,
      facility: {
        ...prev.facility,
        [field]: value
      }
    }));
  };

  const handleFloorCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(e.target.value) || 0;
    setFloorCount(Math.max(1, count));

    const newFloors: Floors[] = [];
    for (let i = 0; i < count; i++) {
      newFloors.push({
        name: `${i + 1}층`,
        floorId: i + 1
      });
    }

    setBuildingData(prev => ({
      ...prev,
      floors: newFloors
    }));
  };

  const handleBack = () => {
    navigate("/admin/buildings");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await execute(buildingData);
      navigate("/admin/buildings");
    } catch (err) {
      console.error("건물 생성 오류:", err);
      setError("건물을 생성하는 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer title="새 건물 추가">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleBack}>
            목록으로
          </Button>
          <h1 className="text-2xl font-bold">새 건물 추가</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>새 건물 정보 입력</CardTitle>
          </CardHeader>
          <CardContent>
            <ModalForm>
              <ModalFormItem label="건물명">
                <Input
                  type="text"
                  value={buildingData.facility.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="건물명을 입력하세요"
                  required
                />
              </ModalFormItem>

              <ModalFormItem label="건물 코드">
                <Input
                  type="text"
                  value={buildingData.facility.code}
                  onChange={(e) => handleInputChange("code", e.target.value)}
                  placeholder="건물 코드를 입력하세요"
                  required
                />
              </ModalFormItem>

              <ModalFormItem label="설명">
                <Input
                  type="text"
                  value={buildingData.facility.description || ""}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="건물에 대한 설명을 입력하세요"
                />
              </ModalFormItem>

              <ModalFormItem label="층 수">
                <Input
                  type="number"
                  min={1}
                  value={floorCount}
                  onChange={handleFloorCountChange}
                  placeholder="층 수를 입력하세요"
                  required
                />
              </ModalFormItem>

              {floorCount > 0 && (
                <ModalFormItem label="층 정보">
                  <div className="grid grid-cols-2 gap-2">
                    {buildingData.floors.map((floor, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Label>{index + 1}층: </Label>
                        <Input
                          type="text"
                          value={floor.name}
                          onChange={(e) => {
                            const newFloors = [...buildingData.floors];
                            newFloors[index] = { ...floor, name: e.target.value };
                            setBuildingData(prev => ({ ...prev, floors: newFloors }));
                          }}
                          placeholder={`${index + 1}층 이름`}
                        />
                      </div>
                    ))}
                  </div>
                </ModalFormItem>
              )}
            </ModalForm>

            {error && (
              <div className="text-red-500 mt-4 text-center">{error}</div>
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
    </PageContainer>
  );
};

export default BuildingCreatePage;