import type { StationDetail } from '../types/facility';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchStationDetail } from '../api/station';

export default function StationDetail() {
    const {id} = useParams<{ id: string }>();
    const [station, setStation] = useState<StationDetail | null>(null);

    useEffect(() => {
        const loadStationDetail = async () => {
            try {
                const response = await fetchStationDetail(Number(id));
                setStation(response.data);
            } catch (error) {
                console.error('역사 정보를 불러오는데 실패했습니다:', error);
            }
        };

        loadStationDetail();
  }, [id]);

  if (!station) return <div>로딩 중...</div>;

  return (
    <div className="p-6">
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">기본 정보</h3>
        <table className="w-full border-collapse border border-gray-300">
          <tbody>
            <tr>
              <th className="border border-gray-300 p-2 bg-gray-50">역사 ID</th>
              <td className="border border-gray-300 p-2">{station.facility.id}</td>
              <th className="border border-gray-300 p-2 bg-gray-50">역사명</th>
              <td className="border border-gray-300 p-2">{station.facility.name}</td>
            </tr>
            <tr>
              <th className="border border-gray-300 p-2 bg-gray-50">설명</th>
              <td className="border border-gray-300 p-2">{station.facility.description}</td>
              <th className="border border-gray-300 p-2 bg-gray-50">코드</th>
              <td className="border border-gray-300 p-2">{station.facility.code || '-'}</td>
            </tr>
            <tr>
              <th className="border border-gray-300 p-2 bg-gray-50">생성일</th>
              <td className="border border-gray-300 p-2">
                {new Date(station.facility.createdAt).toLocaleString()}
              </td>
              <th className="border border-gray-300 p-2 bg-gray-50">생성자</th>
              <td className="border border-gray-300 p-2">{station.facility.createdBy}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">층별 정보</h3>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-300 p-2">층</th>
              <th className="border border-gray-300 p-2">이름</th>
            </tr>
          </thead>
          <tbody>
            {station.floors.map((floor) => (
              <tr key={floor.floorId}>
                <td className="border border-gray-300 p-2 text-center">{floor.floorId}</td>
                <td className="border border-gray-300 p-2">{floor.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">첨부 파일</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium mb-2">썸네일 이미지</h4>
            <img
              src={station.facility.thumbnail.url}
              alt={station.facility.name}
              className="max-w-full h-auto border border-gray-300 rounded"
            />
          </div>
          <div>
            <h4 className="font-medium mb-2">3D 모델 파일</h4>
            <p className="text-sm text-gray-600">
              파일명: {station.facility.drawing.originalFileName}<br />
              형식: {station.facility.drawing.contentType}<br />
              상태: {station.facility.drawing.fileStatus}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}