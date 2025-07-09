import { useState } from 'react';
import { signIn, signUp, signOut, getUserProfile } from '@plug/common-services';
import type { SignInRequest, SignUpRequest } from '@plug/common-services';

const AuthTest = () => {
  const [signInData, setSignInData] = useState<SignInRequest>({
    username: '',
    password: ''
  });

  const [signUpData, setSignUpData] = useState<SignUpRequest>({
    username: '',
    password: '',
    name: '',
    code: ''
  });

  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSignIn = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await signIn(signInData, {
        onSuccess: (response) => {
          setSuccess('로그인 성공!');
          console.log('로그인 응답:', response);
          alert('로그인 성공!');
        },
        onError: (errorData) => {
          setError(errorData.message || '로그인 중 오류가 발생했습니다.');
          alert(errorData.message || '로그인 중 오류가 발생했습니다.');
        }
      });
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };


  const handleSignUp = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await signUp(signUpData);
      setSuccess('회원가입 성공!');
      console.log('회원가입 응답:', response);
    } catch (err) {
      setError(err instanceof Error ? err.message : '회원가입 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await signOut();
      setSuccess('로그아웃 성공!');
      setUserProfile(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '로그아웃 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleGetProfile = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await getUserProfile();
      setUserProfile(response.data);
      setSuccess('프로필 가져오기 성공!');
    } catch (err) {
      setError(err instanceof Error ? err.message : '프로필 조회 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>인증 API 테스트</h2>

      {error && (
        <div style={{ padding: '10px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{ padding: '10px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '4px', marginBottom: '20px' }}>
          {success}
        </div>
      )}

      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ flex: 1, border: '1px solid #eee', padding: '10px', borderRadius: '4px' }}>
          <h3>로그인</h3>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>이메일:</label>
            <input
              type="text"
              value={signInData.username}
              onChange={(e) => setSignInData({ ...signInData, username: e.target.value })}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>비밀번호:</label>
            <input
              type="password"
              value={signInData.password}
              onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' }}
            />
          </div>
          <button
            onClick={handleSignIn}
            disabled={loading}
            style={{ padding: '8px 16px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', width: '100%' }}
          >
            {loading ? '처리 중...' : '로그인'}
          </button>
        </div>

        <div style={{ flex: 1, border: '1px solid #eee', padding: '10px', borderRadius: '4px' }}>
          <h3>회원가입</h3>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>이메일:</label>
            <input
              type="text"
              value={signUpData.username}
              onChange={(e) => setSignUpData({ ...signUpData, username: e.target.value })}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>비밀번호:</label>
            <input
              type="password"
              value={signUpData.password}
              onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>이름:</label>
            <input
              type="text"
              value={signUpData.name}
              onChange={(e) => setSignUpData({ ...signUpData, name: e.target.value })}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>code:</label>
            <input
              type="text"
              value={signUpData.code}
              onChange={(e) => setSignUpData({ ...signUpData, code: e.target.value })}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' }}
            />
          </div>
          <button
            onClick={handleSignUp}
            disabled={loading}
            style={{ padding: '8px 16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', width: '100%' }}
          >
            {loading ? '처리 중...' : '회원가입'}
          </button>
        </div>

        <div style={{ flex: 1, border: '1px solid #eee', padding: '10px', borderRadius: '4px' }}>
          <h3>사용자 정보 / 로그아웃</h3>
          <button
            onClick={handleGetProfile}
            disabled={loading}
            style={{ padding: '8px 16px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', width: '100%', marginBottom: '10px' }}
          >
            {loading ? '처리 중...' : '내 프로필 가져오기'}
          </button>

          <button
            onClick={handleSignOut}
            disabled={loading}
            style={{ padding: '8px 16px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', width: '100%' }}
          >
            {loading ? '처리 중...' : '로그아웃'}
          </button>

          {userProfile && (
            <div style={{ marginTop: '20px' }}>
              <h4>프로필 정보:</h4>
              <pre style={{ padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px', overflow: 'auto' }}>
                {JSON.stringify(userProfile, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthTest;