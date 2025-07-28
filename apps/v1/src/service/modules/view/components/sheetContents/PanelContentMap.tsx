import {MenuType} from "@plug/v1/service/modules/model/types/Menu.type";
import React from "react";

export const PanelComponentMap: Record<MenuType, React.LazyExoticComponent<React.FC>> = {
    장비목록: React.lazy(() => import('./variants/EquipmentPanel')),
    감시그룹: React.lazy(() => import('./variants/MonitoringGroupPanel')),
    반경검색: React.lazy(() => import('./variants/RadiusSearchPanel')),
    가상순찰: React.lazy(() => import('./variants/VirtualTrainingPanel')),
    SOP: React.lazy(() => import('./variants/SOPPanel')),
    유지보수: React.lazy(() => import('./variants/MaintenancePanel'))
};
