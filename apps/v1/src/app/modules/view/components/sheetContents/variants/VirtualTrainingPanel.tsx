import mockPatrolList from "@plug/v1/app/modules/model/mock/MockPatrolList";

const VirtualTrainingPanel = () => {
    return (
        <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center font-semibold text-base border-b pb-2">
                승강장_생션_가상순찰
                <button className="text-sm text-blue-600 hover:underline">관리자</button>
            </div>

            <div className="flex justify-between items-center text-sm text-gray-700 mb-2">
                B1_대합실_가상순찰
                <button className="text-sm text-blue-600 hover:underline">관리자</button>
            </div>

            <div className="flex gap-4 items-center justify-center my-2">
                <button className="text-xl">▶</button>
                <button className="text-xl">⏸</button>
                <button className="text-xl">■</button>
            </div>

            <div className="max-h-72 overflow-y-auto border rounded p-3 bg-gray-50 space-y-2">
                {mockPatrolList.map((item, index) => (
                    <div key={item.id} className="flex items-start gap-2">
                        <div className="font-bold w-8">{String(index + 1).padStart(2, '0')}</div>
                        <div>
                            <div className="font-medium">{item.title}</div>
                            <div className="text-sm text-gray-600">{item.description}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VirtualTrainingPanel;