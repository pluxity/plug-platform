// apps/tancheon-odor-monitoring/src/app/components/Header.tsx
'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface User {
  id: number;
  user_name: string;
  password?: string;
  role: string;
}

const Header = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    // 쿠키 삭제
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    // localStorage에서 사용자 정보 삭제
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">TanCheon Odor Monitoring</h1>
        <nav>
          <ul className="flex space-x-4">
            {user && (
              <li className="mr-4">
                <span className="font-bold">
                  {user.user_name}({user.role})님 환영합니다.
                </span>
              </li>
            )}
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
