import React from 'react';

// 임시 타입 정의
interface SubwayStation {
  id: string;
  name: string;
  line: string;
  location: {
    lat: number;
    lng: number;
  };
}

const HomePage: React.FC = () => {
  const [popularStations] = React.useState<SubwayStation[]>([
    { id: '1', name: '서면역', line: '1호선', location: { lat: 35.157, lng: 129.059 } },
    { id: '2', name: '해운대역', line: '2호선', location: { lat: 35.163, lng: 129.159 } },
    { id: '3', name: '부산역', line: '1호선', location: { lat: 35.115, lng: 129.042 } },
    { id: '4', name: '동래역', line: '1호선', location: { lat: 35.204, lng: 129.078 } },
  ]);

  return (
    <div className="space-y-8">
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">부산 지하철 정보</h2>
        <p className="text-gray-700">
          부산 지하철은 총 5개 노선으로 운영되며, 도시의 주요 지역을 연결하고 있습니다.
          실시간 열차 정보와 역 주변 정보를 확인하실 수 있습니다.
        </p>
      </section>

      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">인기 역</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {popularStations.map(station => (
            <div key={station.id} className="border border-gray-200 rounded p-4 hover:border-primary-500 transition-colors">
              <h3 className="font-bold text-lg">{station.name}</h3>
              <p className="text-sm text-gray-600">{station.line}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">운행 정보</h2>
        <div className="border-l-4 border-primary-500 pl-4">
          <p className="text-gray-700">평일: 오전 5:30 - 자정</p>
          <p className="text-gray-700">주말 및 공휴일: 오전 5:30 - 오후 11:30</p>
        </div>
      </section>

      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">지하철 노선도</h2>
        <div className="w-full h-[calc(100vh-400px)] bg-gray-100 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">지하철 노선도가 여기에 표시됩니다.</p>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 