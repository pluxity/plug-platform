import React, { useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { ModalFormItem } from "@plug/ui";
import {
  BuildingUpdateRequest,
  useBuildingDetailSWR,
  useBuildingHistory,
  useDeleteBuilding,
  useUpdateBuilding,
  useUpdateFacilitiesDrawing,
  FacilityDrawingUpdateRequest,
  FacilityUpdateRequest,
} from "@plug/common-services";
import { parseInt } from "lodash";
import { FacilityDetailLayout } from "../components/FacilityDetailLayout";

const BuildingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const buildingId = parseInt(id || "0");
  const searchParams = new URLSearchParams(location.search);
  const urlMode = searchParams.get('mode');

  const { data: building, isLoading, error, mutate } = useBuildingDetailSWR(buildingId);
  const { data: buildingHistory, mutate: historyMutate } = useBuildingHistory(buildingId);
  const { execute: deleteBuilding } = useDeleteBuilding(buildingId);
  const { execute: updateBuilding } = useUpdateBuilding(buildingId);
  const { execute: updateDrawing } = useUpdateFacilitiesDrawing(buildingId);

  const [formData, setFormData] = useState<BuildingUpdateRequest>({
    facility: {
      name: "",
      description: "",
      code: "",
    },
    floors: []
  });

  const handleSetFormData = (data: FacilityUpdateRequest) => {
    setFormData({
      ...formData,
      ...data,
      floors: formData.floors
    });
  };

  const handleDelete = async (): Promise<void> => {
    await deleteBuilding();
  };

  const handleUpdate = async (data: FacilityUpdateRequest): Promise<void> => {
    const buildingData: BuildingUpdateRequest = {
      ...data,
      floors: formData.floors
    };
    await updateBuilding(buildingData);
  };

  const handleDrawingUpdate = async (data: FacilityDrawingUpdateRequest): Promise<void> => {
    await updateDrawing(data);
  };

  const handleMutate = async (): Promise<void> => {
    await mutate();
  };

  const handleHistoryMutate = async (): Promise<void> => {
    await historyMutate();
  };


  return (
    <FacilityDetailLayout
      title={`${building?.facility.name} 상세 정보`}
      itemId={buildingId}
      data={building}
      isLoading={isLoading}
      error={error}
      urlMode={urlMode}
      formData={formData}
      setFormData={handleSetFormData}
      onDelete={handleDelete}
      onUpdate={handleUpdate}
      onDrawingUpdate={handleDrawingUpdate}
      onMutate={handleMutate}
      onHistoryMutate={handleHistoryMutate}
      history={buildingHistory}
      detailUrl="/admin/building"
    >
      <ModalFormItem label="층 정보" className="col-span-2 border-b">
        {building?.floors && building.floors.length > 0 ? (
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
    </FacilityDetailLayout>
  );
};

export default BuildingDetailPage;