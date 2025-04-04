import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { signIn, type SignInRequest } from '@plug/api-hooks';
import { Button, Input } from '@plug/ui';
import useAuthStore from '../stores/authStore';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const login = useAuthStore((state) => state.login);

  const [formData, setFormData] = useState<SignInRequest>({
    username: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 회원가입 후 리디렉션된 경우 메시지 표시
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
    }
  }, [location]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      const response = await signIn(formData);

      if (!response?.accessToken) {
        throw new Error('액세스 토큰이 없습니다');
      }

      // zustand 상태에 토큰 + 사용자 정보 저장
      login(response.accessToken, response.name, response.code);

      // 로그인 후 홈으로 이동
      navigate('/');
    } catch (err) {
      console.error('로그인 오류:', err);
      setError(err instanceof Error ? err.message : '로그인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="w-full max-w-md space-y-6 rounded-lg border bg-card p-6 shadow-lg">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">로그인</h1>
          <p className="text-sm text-muted-foreground">
            또는{' '}
            <Button variant="ghost" onClick={() => navigate('/signup')}>
              회원가입
            </Button>
          </p>
        </div>

        {successMessage && (
          <div className="rounded-md bg-green-50 p-4">
            <p className="text-sm text-green-700">{successMessage}</p>
          </div>
        )}

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="username"
            name="username"
            type="text"
            placeholder="사용자 ID"
            required
            maxLength={20}
            value={formData.username}
            onChange={handleChange}
          />
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="비밀번호"
            required
            minLength={6}
            maxLength={20}
            value={formData.password}
            onChange={handleChange}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? '로그인 중...' : '로그인'}
          </Button>
        </form>
      </div>
    </div>
  );
}
