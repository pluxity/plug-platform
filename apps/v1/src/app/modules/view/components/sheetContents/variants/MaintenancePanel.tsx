import {DataTable} from "@plug/ui";
import {mockMaintenanceData} from "@plug/v1/app/modules/model/mock/MockMaintenance";
import {maintenanceColumns} from "@plug/v1/app/modules/model/types/maintenance/Column";

const MaintenancePanel = () => {
    const groupedData = mockMaintenanceData.reduce<Record<string, typeof mockMaintenanceData>>((acc, item) => {
        acc[item.category] = acc[item.category] || []
        acc[item.category].push(item)
        return acc
    }, {})

    return (
        <div className="flex flex-col gap-6">
            {Object.entries(groupedData).map(([category, records]) => (
                <div key={category}>
                    <h3 className="text-md font-semibold mb-2">{category}</h3>
                    <DataTable
                        data={records}
                        columns={maintenanceColumns}
                        pageSize={5}
                        showSearch={false}
                        showPagination={false}
                    />
                </div>
            ))}
        </div>
    )
}

export default MaintenancePanel