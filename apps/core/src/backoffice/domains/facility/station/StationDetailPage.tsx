import React, { useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { ModalFormItem } from "@plug/ui";
import {
  StationUpdateRequest,
  useStationDetailSWR,
  useStationHistorySWR,
  useDeleteStation,
  useUpdateStation,
  useUpdateFacilitiesDrawing,
  FacilityUpdateRequest, FacilityDrawingUpdateRequest
} from "@plug/common-services";
import { parseInt } from "lodash";
import { FacilityDetailLayout } from "../components/FacilityDetailLayout";

export const StationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const stationId = parseInt(id || "0");
  const searchParams = new URLSearchParams(location.search);
  const urlMode = searchParams.get('mode');

  const { data: station, isLoading, error, mutate } = useStationDetailSWR(stationId);
  const { data: stationHistory, mutate: historyMutate } = useStationHistorySWR(stationId);
  const { execute: deleteStation } = useDeleteStation(stationId);
  const { execute: updateStation } = useUpdateStation(stationId);
  const { execute: updateDrawing } = useUpdateFacilitiesDrawing(stationId);

  const [formData, setFormData] = useState<StationUpdateRequest>({
    facility: {
      name: "",
      description: "",
      code: "",
    },
    floors: [],
    lineIds: [],
    stationCodes: [],
  });

  const handleSetFormData = (data: FacilityUpdateRequest) => {
    setFormData({
      ...formData,
      ...data,
      floors: formData.floors,
      lineIds: formData.lineIds
    });
  };

  const handleDelete = async (): Promise<void> => {
    await deleteStation();
  };

  const handleUpdate = async (data: FacilityUpdateRequest): Promise<void> => {
    const stationData: StationUpdateRequest = {
      ...data,
      floors: formData.floors,
      lineIds: formData.lineIds,
      stationCodes: formData.stationCodes
    };
    await updateStation(stationData);
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
      title={`${station?.facility.name} 상세 정보`}
      itemId={stationId}
      data={station}
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
      history={stationHistory}
      detailUrl="/admin/station"
    >
      <ModalFormItem label="층 정보" className="col-span-2">
        {station?.floors && station.floors.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {station.floors.map((floor, index) => (
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