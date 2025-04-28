import { useState } from 'react';
import { api, setTokenGetter } from '@plug/api-hooks';

export default function TestApiPage() {
  const [result, setResult] = useState<string | object | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const reset = () => {
    setResult(null);
    setError(null);
  };

  const callGet = async () => {
    reset();
    setLoading(true);

    try {
      const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0dXNlcjEyMyIsImlhdCI6MTc0NTM4OTM5OSwiZXhwIjoxNzQ1MzkyOTk5fQ.BlLiogeTnPe0dB83e3Y-qkM8oaIb2iynHYLQ4oOtigM";
      setTokenGetter(() => token);

      const data = await api.get('users/me');
      setResult(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };


  const callPost = async () => {
    reset();
    setLoading(true);
    try {
      const signUpPayload = {
        username: 'testuser123',
        password: '12345678!',
        name: '테스터',
        code: 'abc123',
      };
      const response = await api.post<object>('auth/sign-up', signUpPayload);
      setResult(response);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const callCreateFacility = async () => {
    reset();
    setLoading(true);

    try {
      const payload = {
        "name": "string"
      };

      const res = await api.post<object>('facilities', payload);
      setResult(res);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const callFacilityGet = async () => {
    reset();
    setLoading(true);

    try {
      const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0dXNlcjEyMyIsImlhdCI6MTc0NTM4OTM5OSwiZXhwIjoxNzQ1MzkyOTk5fQ.BlLiogeTnPe0dB83e3Y-qkM8oaIb2iynHYLQ4oOtigM";
      setTokenGetter(() => token);

      const data = await api.get('facilities/14');
      setResult(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };


  const callDeleteFacility = async () => {
    reset();
    setLoading(true);

    try {
      const facilityId = 9;
      await api.delete(`facilities/${facilityId}`);
      setResult(`시설 ID ${facilityId} 삭제 성공`);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };


  return (
      <div style={styles.wrapper}>
        <h1 style={styles.heading}>🧪 API 테스트 페이지</h1>

        <div style={styles.buttonGroup}>
          <button style={styles.button} onClick={callPost}>POST 회원가입</button>
          <button style={styles.button} onClick={callGet}>GET 내정보</button>
          <button style={styles.button} onClick={callCreateFacility}>POST 시설 생성</button>
          <button style={styles.button} onClick={callFacilityGet}>GET 시설</button>
          <button style={styles.button} onClick={callDeleteFacility}>DELETE 시설 삭제</button>
        </div>

        {loading && <p style={styles.loading}>요청 중...</p>}

        {result && (
            <div style={styles.resultBox}>
              <h3>✅ 결과</h3>
              <pre>{typeof result === 'string' ? result : JSON.stringify(result, null, 2)}</pre>
            </div>
        )}

        {error && (
            <div style={styles.errorBox}>
              <h3>❌ 에러</h3>
              <pre>{error}</pre>
            </div>
        )}
      </div>
  );
}

const styles = {
  wrapper: {
    padding: '32px',
    fontFamily: 'system-ui, sans-serif',
    maxWidth: 800,
    margin: '0 auto',
  },
  heading: {
    fontSize: '24px',
    marginBottom: '24px',
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    marginBottom: '20px',
  },
  button: {
    padding: '10px 16px',
    fontSize: '16px',
    cursor: 'pointer',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
  },
  loading: {
    fontSize: '16px',
    color: '#888',
    marginBottom: '12px',
  },
  resultBox: {
    backgroundColor: '#f0f8ff',
    padding: '16px',
    borderRadius: '8px',
    marginTop: '16px',
  },
  errorBox: {
    backgroundColor: '#fff0f0',
    color: '#cc0000',
    padding: '16px',
    borderRadius: '8px',
    marginTop: '16px',
  },
};
