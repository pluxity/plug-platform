'use client';

import { useState, useEffect } from 'react';
import SignupModal from '@/app/components/SignUpModal';
import UserTable from '@/app/components/UserTable';
import Link from 'next/link';
import Header from '@/app/components/Header';

interface User {
  id: number;
  user_name: string;
  password?: string;
  role: string;
}

export default function Home() {
  const [users, setUsers] = useState<User[]>([]); // any[] 대신 User[]로 변경
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        if (response.ok) {
          const data: User[] = await response.json(); // 명시적으로 타입을 User[]로 지정
          setUsers(data);
        } else {
          console.error('사용자 목록 조회 실패');
        }
      } catch (error) {
        console.error('사용자 목록 조회 중 오류:', error);
      }
    };

    fetchUsers();
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
     <Header/>
        <Link href="/admin/users">사용자 관리 페이지로 이동</Link>
      <UserTable/>

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
          <button type="button" onClick={openModal}>회원가입</button>
          <SignupModal isOpen={isModalOpen} onClose={closeModal} />
      </div>
    </main>
  );
}
