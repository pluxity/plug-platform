import {MaintenanceRecord} from "@plug/v1/service/modules/model/types/maintenance/Maintenance.type";
import {Column} from "../../../../../../../../packages/ui/src/components/DataTable/DataTable.types";

export const maintenanceColumns: Column<MaintenanceRecord>[] = [
    { key: 'taskName', label: '유지보수명' },
    { key: 'department', label: '소속' },
    { key: 'personInCharge', label: '담당자' },
    { key: 'contact', label: '연락처' },
]
