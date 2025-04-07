import { useBuildings } from '@plug/common-services'

export const BuildingInfoSection = () => {
  const { data: buildings, isLoading, error, execute } = useBuildings()

  return (
    <section className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">건물 정보</h2>

      <button
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={() => execute()}
        disabled={isLoading}
      >
        건물 정보 불러오기
      </button>

      {isLoading && <p>로딩 중...</p>}
      {error && <p className="text-red-500">에러 발생: {error.message}</p>}

      {buildings && buildings.length > 0 ? (
        <ul className="space-y-2">
          {buildings.map((building) => (
            <li key={building.id} className="text-gray-700">
              <strong>{building.name}</strong> - {building.description}
            </li>
          ))}
        </ul>
      ) : (
        !isLoading && !error && (
          <p className="text-gray-500">표시할 건물 정보가 없습니다.</p>
        )
      )}
    </section>
  )
}
