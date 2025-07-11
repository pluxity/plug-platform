import { useState } from 'react';
import { useBuildings, useBuildingDetail, useBuildingsSWR } from '@plug/common-services';

const BuildingTest = () => {
  const [buildingId, setBuildingId] = useState<number>(1);

  const { execute: fetchBuildings, data: buildingsData, isLoading: buildingsLoading, error: buildingsError } = useBuildings();
  const { execute: fetchBuildingDetail, data: buildingDetail, isLoading: buildingDetailLoading, error: buildingDetailError } = useBuildingDetail(buildingId);

  const { data: buildingsSWR, isLoading: buildingsSWRLoading, error: buildingsSWRError, refresh: refreshBuildingsSWR } = useBuildingsSWR();

  return (
    <div>
      <h2>건물 API 테스트</h2>

      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ flex: 1, border: '1px solid #eee', padding: '10px', borderRadius: '4px' }}>
          <h3>useApi 기반 훅</h3>

          <div style={{ marginBottom: '20px' }}>
            <h4>모든 건물 가져오기</h4>
            <button
              onClick={() => fetchBuildings()}
              disabled={buildingsLoading}
              style={{ padding: '8px 16px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              {buildingsLoading ? '로딩 중...' : '건물 목록 가져오기'}
            </button>

            {buildingsError && (
              <div style={{ color: 'red', marginTop: '10px' }}>
                에러: {buildingsError.message}
              </div>
            )}

            {buildingsData && (
              <pre style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px', overflow: 'auto', maxHeight: '200px' }}>
                {JSON.stringify(buildingsData, null, 2)}
              </pre>
            )}
          </div>

          <div>
            <h4>건물 상세 정보 가져오기</h4>
            <div style={{ marginBottom: '10px' }}>
              <label>
                건물 ID:
                <input
                  type="number"
                  value={buildingId}
                  onChange={(e) => setBuildingId(Number(e.target.value))}
                  style={{ marginLeft: '10px', padding: '5px' }}
                />
              </label>
            </div>
            <button
              onClick={() => fetchBuildingDetail()}
              disabled={buildingDetailLoading}
              style={{ padding: '8px 16px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              {buildingDetailLoading ? '로딩 중...' : '건물 상세 정보 가져오기'}
            </button>

            {buildingDetailError && (
              <div style={{ color: 'red', marginTop: '10px' }}>
                에러: {buildingDetailError.message}
              </div>
            )}

            {buildingDetail && (
              <pre style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px', overflow: 'auto' }}>
                {JSON.stringify(buildingDetail, null, 2)}
              </pre>
            )}
          </div>
        </div>

        <div style={{ flex: 1, border: '1px solid #eee', padding: '10px', borderRadius: '4px' }}>
          <h3>useSWRApi 기반 훅</h3>

          <div>
            <h4>모든 건물 가져오기 (SWR)</h4>
            <button
              onClick={() => refreshBuildingsSWR()}
              disabled={buildingsSWRLoading}
              style={{ padding: '8px 16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              {buildingsSWRLoading ? '로딩 중...' : '새로고침'}
            </button>

            {buildingsSWRError && (
              <div style={{ color: 'red', marginTop: '10px' }}>
                에러: {buildingsSWRError.message}
              </div>
            )}

            {buildingsSWRLoading && <div>로딩 중...</div>}

            {buildingsSWR && (
              <pre style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px', overflow: 'auto', maxHeight: '400px' }}>
                {JSON.stringify(buildingsSWR, null, 2)}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuildingTest;