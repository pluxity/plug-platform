import { useBuildingsSWR } from '@plug/common-services';

export const BuildingInfoSectionSWR = () => {
  const { data: buildings, error, isLoading } = useBuildingsSWR();

  if (isLoading) return <p>로딩 중...</p>;
  if (error) return <p>에러 발생: {error.message}</p>;

  return (
    <section className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">건물 정보 (SWR)</h2>
      {buildings && buildings.length > 0 ? (
        <ul className="space-y-2">
          {buildings.map((building) => (
            <li key={building.id} className="text-gray-700">
              <strong>{building.name}</strong> - {building.description}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">표시할 건물 정보가 없습니다.</p>
      )}
    </section>
  );
};
