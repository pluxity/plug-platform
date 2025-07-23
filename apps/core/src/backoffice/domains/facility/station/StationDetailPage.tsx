
import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { ModalFormItem, Button, MultiSelect, Input } from "@plug/ui";
import {
  StationUpdateRequest,
  useStationDetailSWR,
  useStationHistorySWR,
  useDeleteStation,
  useUpdateStation,
  useUpdateFacilitiesDrawing,
  FacilityUpdateRequest,
  FacilityDrawingUpdateRequest,
  useLinesSWR
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
  const { data: lines } = useLinesSWR();

  const [formData, setFormData] = useState<StationUpdateRequest>({
    facility: {
      name: "",
      description: "",
      code: "",
    },
    lineIds: [],
    stationCodes: [],
  });

  useEffect(() => {
    if (station) {
      setFormData(() => ({
        facility: {
          name: station.facility.name,
          description: station.facility.description || "",
          code: station.facility.code,
          thumbnailFileId: station.facility.thumbnail.id,
        },
        lineIds: station.lineIds || [],
        stationCodes: station.stationCodes || [],
      }));
    }
  }, [station]);

  const handleSetFormData = (data: FacilityUpdateRequest) => {
    setFormData(prev => ({
      ...prev,
      facility: {
        ...prev.facility,
        ...data.facility
      },
    }));
  };

  const handleDelete = async (): Promise<void> => {
    await deleteStation();
  };

  const handleUpdate = async (data: FacilityUpdateRequest): Promise<void> => {
    const stationData: StationUpdateRequest = {
      ...formData,
      facility: {
        ...formData.facility,
        ...data.facility
      }
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
      <ModalFormItem label="층 정보" className="col-span-3">
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

      <ModalFormItem label="호선 정보">
        {urlMode === 'edit' ? (
          <MultiSelect
            options={lines?.map((line) => ({
              label: line.name,
              value: String(line.id),
            })) || []}
            value={formData.lineIds.map(id => String(id))}
            onChange={(value: string[]) => {
              setFormData(prev => ({
                ...prev,
                lineIds: value.map(v => parseInt(v)),
              }));
            }}
          />
        ) : (
          station?.lineIds && station.lineIds.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {station.lineIds.map((lineId, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-sm bg-gray-50 px-3 py-2 text-sm text-gray-700 min-w-[120px]"
                >
                  {lineId} 호선
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-500">
              등록된 선 정보가 없습니다.
            </div>
          )
        )}
      </ModalFormItem>

      <ModalFormItem label="역사 코드" className="border-b">
        {urlMode === 'edit' ? (
          <div className='w-full flex justify-between'>
            {formData.stationCodes?.map((code, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input type="text" value={code}
                  onChange={(e) => {
                    const newCodes = [...(formData.stationCodes || [])];
                    newCodes[index] = e.target.value;
                    setFormData(prev => ({
                      ...prev,
                      stationCodes: newCodes
                    }));
                  }}
                  placeholder={`역사 코드 ${index + 1}`}
                />
                <Button
                  type="button"
                  onClick={() => {
                    const newCodes = [...(formData.stationCodes || [])];
                    newCodes.splice(index, 1);
                    setFormData(prev => ({
                      ...prev,
                      stationCodes: newCodes
                    }));
                  }}
                  className='w-12'
                >
                  삭제
                </Button>
              </div>
            ))}
            <Button
              type="button"
              onClick={() => {
                setFormData(prev => ({
                  ...prev,
                  stationCodes: [...(prev.stationCodes || []), '']
                }));
              }}
              className='w-12'
            >
              추가
            </Button>
          </div>
        ) : (
          station?.stationCodes && station.stationCodes.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {station.stationCodes.map((stationCode, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-sm bg-gray-50 px-3 py-2 text-sm text-gray-700 min-w-[120px]"
                >
                  {stationCode}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-500">
              등록된 역사 코드가 없습니다.
            </div>
          )
        )}
      </ModalFormItem>
    </FacilityDetailLayout>
  );
};