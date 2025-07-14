import { useUserMe, useUserMeSWR, useUsers, useUsersSWR } from '@plug/common-services';

const UserTest = () => {
  const { execute: fetchUserMe, data: userData, isLoading: userLoading, error: userError } = useUserMe();
  const { data: usersList, execute: fetchUsers, isLoading: usersLoading, error: usersError } = useUsers();
  const { data: userDataSWR, isLoading: userLoadingSWR, error: userErrorSWR, refresh: refreshUserSWR } = useUserMeSWR();
  const { data: usersListSWR, isLoading: usersLoadingSWR, error: usersErrorSWR, refresh: refreshUsersSWR } = useUsersSWR();

  return (
    <div>
      <h2>사용자 API 테스트</h2>

      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ flex: 1, border: '1px solid #eee', padding: '10px', borderRadius: '4px' }}>
          <h3>useApi 기반 훅</h3>

          <div style={{ marginBottom: '20px' }}>
            <h4>내 정보 가져오기</h4>
            <button
              onClick={() => fetchUserMe()}
              disabled={userLoading}
              style={{ padding: '8px 16px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              {userLoading ? '로딩 중...' : '내 정보 가져오기'}
            </button>

            {userError && (
              <div style={{ color: 'red', marginTop: '10px' }}>
                에러: {userError.message}
              </div>
            )}

            {userData && (
              <pre style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px', overflow: 'auto' }}>
                {JSON.stringify(userData, null, 2)}
              </pre>
            )}
          </div>

          <div>
            <h4>모든 사용자 가져오기</h4>
            <button
              onClick={() => fetchUsers()}
              disabled={usersLoading}
              style={{ padding: '8px 16px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              {usersLoading ? '로딩 중...' : '사용자 목록 가져오기'}
            </button>

            {usersError && (
              <div style={{ color: 'red', marginTop: '10px' }}>
                에러: {usersError.message}
              </div>
            )}

            {usersList && (
              <div style={{ marginTop: '10px', maxHeight: '300px', overflow: 'auto' }}>
                <pre style={{ padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                  {JSON.stringify(usersList, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

        <div style={{ flex: 1, border: '1px solid #eee', padding: '10px', borderRadius: '4px' }}>
          <h3>useSWRApi 기반 훅</h3>

          <div style={{ marginBottom: '20px' }}>
            <h4>내 정보 가져오기 (SWR)</h4>
            <button
              onClick={() => refreshUserSWR()}
              disabled={userLoadingSWR}
              style={{ padding: '8px 16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              {userLoadingSWR ? '로딩 중...' : '새로고침'}
            </button>

            {userErrorSWR && (
              <div style={{ color: 'red', marginTop: '10px' }}>
                에러: {userErrorSWR.message}
              </div>
            )}

            {userLoadingSWR && <div>로딩 중...</div>}

            {userDataSWR && (
              <pre style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px', overflow: 'auto' }}>
                {JSON.stringify(userDataSWR, null, 2)}
              </pre>
            )}
          </div>

          <div>
            <h4>모든 사용자 가져오기 (SWR)</h4>
            <button
              onClick={() => refreshUsersSWR()}
              disabled={usersLoadingSWR}
              style={{ padding: '8px 16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              {usersLoadingSWR ? '로딩 중...' : '새로고침'}
            </button>

            {usersErrorSWR && (
              <div style={{ color: 'red', marginTop: '10px' }}>
                에러: {usersErrorSWR.message}
              </div>
            )}

            {usersLoadingSWR && <div>로딩 중...</div>}

            {usersListSWR && (
              <div style={{ marginTop: '10px', maxHeight: '300px', overflow: 'auto' }}>
                <pre style={{ padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                  {JSON.stringify(usersListSWR, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTest;