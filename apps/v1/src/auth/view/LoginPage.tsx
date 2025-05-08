import { Form, FormItem, Input, Button, required } from '@plug/ui';
import { authApi } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

interface LoginFormData {
    username: string;
    password: string;
    [key: string]: string;
}

const LoginPage = () => {
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleLogin = async (values: LoginFormData) => {
        setError('');
        try {
            await authApi.login(values);
            navigate('/service');
        } catch (err: Error | unknown) {
            const error = err instanceof Error ? err.message : '로그인에 실패했습니다.';
            setError(error);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
                <h2 className="mb-6 text-center text-2xl font-bold text-gray-900">로그인</h2>

                <Form<LoginFormData> onSubmit={handleLogin}>
                    <FormItem name="username" label="아이디" validate={[required()]}>
                        <Input placeholder="아이디를 입력하세요" />
                    </FormItem>
                    <FormItem name="password" label="비밀번호" validate={[required()]}>
                        <Input type="password" placeholder="비밀번호를 입력하세요" />
                    </FormItem>

                    {error && (
                        <p className="mt-2 text-sm text-red-500">{error}</p>
                    )}

                    <Button type="submit" color="primary" className="mt-4 w-full">
                        로그인
                    </Button>
                </Form>
            </div>
        </div>
    );
};

export default LoginPage;
