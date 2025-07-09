import { useState } from 'react';
import { useRoles, useRoleDetail, useRolesSWR } from '@plug/common-services';

const RoleTest = () => {
  const [roleId, setRoleId] = useState<number>(1);

  const { execute: fetchRoles, data: rolesData, isLoading: rolesLoading, error: rolesError } = useRoles();
  const { execute: fetchRoleDetail, data: roleDetail, isLoading: roleDetailLoading, error: roleDetailError } = useRoleDetail(roleId);
  const { data: rolesSWR, isLoading: rolesSWRLoading, error: rolesSWRError, refresh: refreshRolesSWR } = useRolesSWR();

  return (
    <div>
      <h2>역할 API 테스트</h2>
      
      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ flex: 1, border: '1px solid #eee', padding: '10px', borderRadius: '4px' }}>
          <h3>useApi 기반 훅</h3>
          
          <div style={{ marginBottom: '20px' }}>
            <h4>모든 역할 가져오기</h4>
            <button 
              onClick={() => fetchRoles()} 
              disabled={rolesLoading}
              style={{ padding: '8px 16px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              {rolesLoading ? '로딩 중...' : '역할 목록 가져오기'}
            </button>
            
            {rolesError && (
              <div style={{ color: 'red', marginTop: '10px' }}>
                에러: {rolesError.message}
              </div>
            )}
            
            {rolesData && (
              <pre style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px', overflow: 'auto', maxHeight: '200px' }}>
                {JSON.stringify(rolesData, null, 2)}
              </pre>
            )}
          </div>
          
          <div>
            <h4>역할 상세 정보 가져오기</h4>
            <div style={{ marginBottom: '10px' }}>
              <label>
                역할 ID:
                <input 
                  type="number" 
                  value={roleId} 
                  onChange={(e) => setRoleId(Number(e.target.value))} 
                  style={{ marginLeft: '10px', padding: '5px' }}
                />
              </label>
            </div>
            <button 
              onClick={() => fetchRoleDetail()} 
              disabled={roleDetailLoading}
              style={{ padding: '8px 16px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              {roleDetailLoading ? '로딩 중...' : '역할 상세 정보 가져오기'}
            </button>
            
            {roleDetailError && (
              <div style={{ color: 'red', marginTop: '10px' }}>
                에러: {roleDetailError.message}
              </div>
            )}
            
            {roleDetail && (
              <pre style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px', overflow: 'auto' }}>
                {JSON.stringify(roleDetail, null, 2)}
              </pre>
            )}
          </div>
        </div>
        
        <div style={{ flex: 1, border: '1px solid #eee', padding: '10px', borderRadius: '4px' }}>
          <h3>useSWRApi 기반 훅</h3>
          
          <div>
            <h4>모든 역할 가져오기 (SWR)</h4>
            <button 
              onClick={() => refreshRolesSWR()} 
              disabled={rolesSWRLoading}
              style={{ padding: '8px 16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              {rolesSWRLoading ? '로딩 중...' : '새로고침'}
            </button>
            
            {rolesSWRError && (
              <div style={{ color: 'red', marginTop: '10px' }}>
                에러: {rolesSWRError.message}
              </div>
            )}
            
            {rolesSWRLoading && <div>로딩 중...</div>}
            
            {rolesSWR && (
              <pre style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px', overflow: 'auto', maxHeight: '400px' }}>
                {JSON.stringify(rolesSWR, null, 2)}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleTest;