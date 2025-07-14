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

  const { execute:signin, error:signinError, isLoading:signinLoading, isSuccess:signinSuccess } = signIn();
  const { execute:signup, error:signUpError, isLoading:signUpLoading, isSuccess:signUpSuccess } = signUp();
  const { execute:signout, error:signOutError, isLoading:signOutLoading, isSuccess:signOutSuccess } = signOut();
  const { execute:getprofile, error:getprofileError, isLoading:getprofileLoading, isSuccess:getprofileSuccess, data:getprofiledata } = getUserProfile();

  return (
    <div>
      <h2>🔐 인증 API 테스트</h2>

      {(signinError || signUpError || signOutError || getprofileError) && (
        <div style={{ padding: "10px", backgroundColor: "#f8d7da", color: "#721c24", borderRadius: "4px", marginBottom: "20px" }}>
          {signinError?.message || signUpError?.message || signOutError?.message || getprofileError?.message || "오류가 발생했습니다."}
        </div>
      )}
      {(signinSuccess || signUpSuccess || signOutSuccess || getprofileSuccess) && (
        <div style={{ padding: "10px", backgroundColor: "#d4edda", color: "#155724", borderRadius: "4px", marginBottom: "20px" }}>
          성공적으로 처리되었습니다.
        </div>
      )}

      <div style={{ display: "flex", gap: "20px" }}>
        <div
          style={{
            flex: 1,
            border: "1px solid #eee",
            padding: "10px",
            borderRadius: "4px",
          }}
        >
          <h3>로그인</h3>
          <div style={{ marginBottom: "10px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              이메일:
            </label>
            <input
              type="text"
              value={signInData.username}
              onChange={(e) =>
                setSignInData({ ...signInData, username: e.target.value })
              }
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ddd",
                boxSizing: "border-box",
              }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              비밀번호:
            </label>
            <input
              type="password"
              value={signInData.password}
              onChange={(e) =>
                setSignInData({ ...signInData, password: e.target.value })
              }
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ddd",
                boxSizing: "border-box",
              }}
            />
          </div>
          <button
            onClick={async () => {
              signin(signInData);
                getprofile();
            }}
            disabled={signinLoading}
            style={{
              padding: "8px 16px",
              backgroundColor: "#007BFF",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              width: "100%",
            }}
          >
            {signinLoading ? "처리 중..." : "로그인"}
          </button>
        </div>

        <div
          style={{
            flex: 1,
            border: "1px solid #eee",
            padding: "10px",
            borderRadius: "4px",
          }}
        >
          <h3>회원가입</h3>
          <div style={{ marginBottom: "10px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              아이디:
            </label>
            <input
              type="text"
              value={signUpData.username}
              onChange={(e) =>
                setSignUpData({ ...signUpData, username: e.target.value })
              }
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ddd",
                boxSizing: "border-box",
              }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              비밀번호:
            </label>
            <input
              type="password"
              value={signUpData.password}
              onChange={(e) =>
                setSignUpData({ ...signUpData, password: e.target.value })
              }
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ddd",
                boxSizing: "border-box",
              }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              이름:
            </label>
            <input
              type="text"
              value={signUpData.name}
              onChange={(e) =>
                setSignUpData({ ...signUpData, name: e.target.value })
              }
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ddd",
                boxSizing: "border-box",
              }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              code:
            </label>
            <input
              type="text"
              value={signUpData.code}
              onChange={(e) =>
                setSignUpData({ ...signUpData, code: e.target.value })
              }
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ddd",
                boxSizing: "border-box",
              }}
            />
          </div>
          <button
            onClick={()=> {
              signup(signUpData);
            }}
            disabled={signUpLoading}
            style={{
              padding: "8px 16px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              width: "100%",
            }}
          >
            {signUpLoading ? "처리 중..." : "회원가입"}
          </button>
        </div>

        <div
          style={{
            flex: 1,
            border: "1px solid #eee",
            padding: "10px",
            borderRadius: "4px",
          }}
        >
          <h3>사용자 정보 / 로그아웃</h3>
          <button
            onClick={getprofile}
            disabled={getprofileLoading}
            style={{
              padding: "8px 16px",
              backgroundColor: "#007BFF",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              width: "100%",
              marginBottom: "10px",
            }}
          >
            {getprofileLoading ? "처리 중..." : "내 프로필 가져오기"}
          </button>

          <button
            onClick={signout}
            disabled={signOutLoading}
            style={{
              padding: "8px 16px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              width: "100%",
            }}
          >
            {signOutLoading ? "처리 중..." : "로그아웃"}
          </button>

          {getprofiledata && (
            <div style={{ marginTop: "20px" }}>
              <h4>프로필 정보:</h4>
              <pre
                style={{
                  padding: "10px",
                  backgroundColor: "#f5f5f5",
                  borderRadius: "4px",
                  overflow: "auto",
                }}
              >
                {getprofiledata && JSON.stringify(getprofiledata, null, 2) || "없음"}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthTest;