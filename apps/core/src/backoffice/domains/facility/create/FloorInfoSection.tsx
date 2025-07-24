import React from "react";
import { ModalFormItem } from "@plug/ui";
import { Floors } from "@plug/common-services";

interface FloorInfoSectionProps {
  floors: Floors[];
}

export const FloorInfoSection: React.FC<FloorInfoSectionProps> = ({ floors }) => {
  return (
    <>
      <div className="col-span-2 p-4 bg-gray-50 flex items-center gap-2 border-b">
        <div className="w-1 h-6 bg-blue-600"></div>
        <h3 className="text-lg font-medium">층 정보</h3>
      </div>
      <ModalFormItem label="층 정보" className="border-b col-span-2">
        <div className="flex flex-wrap gap-2">
          {floors && floors.length > 0 ? (
            floors.map((floor, index) => (
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
            ))
          ) : (
            <div className="text-sm text-gray-500">
              등록된 층 정보가 없습니다. 도면 파일을 업로드하면 자동으로 층
              정보가 추출됩니다.
            </div>
          )}
        </div>
      </ModalFormItem>
    </>
  );
};