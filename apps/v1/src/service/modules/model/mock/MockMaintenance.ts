import { MaintenanceRecord } from "@plug/v1/service/modules/model/types/maintenance/Maintenance.type";

export const mockMaintenanceData: MaintenanceRecord[] = [
    {
        category: '승강설비',
        taskName: '정기점검',
        department: '설비팀',
        personInCharge: '최승은',
        contact: '010-1234-5678',
    },
    {
        category: 'PSD',
        taskName: '센서 교체',
        department: 'PSD팀',
        personInCharge: '윤지선',
        contact: '010-2345-6789',
    },
    {
        category: '셔터',
        taskName: '셔터 수리',
        department: '수리팀',
        personInCharge: '나동규',
        contact: '010-3456-7890',
    },
]
