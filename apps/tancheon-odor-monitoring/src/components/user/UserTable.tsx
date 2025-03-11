// apps/tancheon-odor-monitoring/src/app/components/UserTable.tsx
'use client';

import { useEffect, useState } from 'react';
import { Button } from '@plug/ui/src/components/Button';
import CreateUserModal from './CreateUserModal';

interface User {
  id: number;
  user_name: string;
  password?: string; // password는 선택적
  role: string;
}

const UserTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null); // 선택된 유저 관리
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // 생성 모달 상태
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false); // 수정 모달 상태

  // 유저 목록 조회
  const fetchUsers = async () => {
    const response = await fetch('/api/users');
    const data = await response.json();
    setUsers(data);
  };

  // 유저 삭제
  const deleteUser = async (id: number) => {
    await fetch('/api/users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    fetchUsers();
  };

  // 수정 버튼 클릭 시 입력 필드에 값 채우기
  const handleEdit = (user: User) => {
    setSelectedUser(user); // 선택된 유저 설정
    openUpdateModal()
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openCreateModal = () => {
    setIsCreateModalOpen(true);
  };

    const openUpdateModal = () => {
        setIsUpdateModalOpen(true);
    };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };

    const closeUpdateModal = () => {
        setIsUpdateModalOpen(false);
        setSelectedUser(null); //모달이 닫혔을 때, selectedUser 초기화
    };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>

      <div className="mb-4 flex justify-end">
          <Button color="primary" onClick={openCreateModal}>사용자 생성</Button>
          <CreateUserModal isOpen={isCreateModalOpen} onClose={closeCreateModal} onUserCreated={fetchUsers} />
        {selectedUser &&
            <CreateUserModal isOpen={isUpdateModalOpen} onClose={closeUpdateModal} onUserCreated={fetchUsers} user={selectedUser}/>
        }
      </div>

      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">User Name</th>
            <th className="border px-4 py-2">Password</th>
            <th className="border px-4 py-2">Role</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="border px-4 py-2">{user.id}</td>
              <td className="border px-4 py-2">{user.user_name}</td>
              <td className="border px-4 py-2">{user.password}</td>
              <td className="border px-4 py-2">{user.role}</td>
              <td className="border px-4 py-2">
                <Button color="secondary" onClick={() => handleEdit(user)} className="mr-2">
                  Edit
                </Button>
                <Button color="destructive" onClick={() => deleteUser(user.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
