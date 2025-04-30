import React from 'react';
import mockEquipments from "@plug/v1/service/modules/model/mock/facility/mockEquipment";

const EquipmentPanel = () => {
    return (
        <div className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold mb-2">장비 카테고리</h2>
            <ul className="space-y-2">
                {mockEquipments.map((item) => (
                    <li
                        key={item.category}
                        className="flex justify-between items-center px-3 py-2 border rounded bg-gray-50 hover:bg-gray-100"
                    >
                        <span>{item.category}</span>
                        <span className="text-sm font-medium text-gray-500">{item.count}개</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EquipmentPanel;
