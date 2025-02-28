// apps/tancheon-odor-monitoring/src/app/components/UserTable.tsx
'use client';

import { useEffect, useState } from 'react';
import { Button } from '@plug/ui/src/components/Button';

interface User {
  id: number;
  user_name: string;
  password?: string; // password는 선택적
  role: string;
}

const UserTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null); // 선택된 유저 관리

  // 유저 목록 조회
  const fetchUsers = async () => {
    const response = await fetch('/api/users');
    const data = await response.json();
    setUsers(data);
  };

  // 유저 생성
  const createUser = async () => {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_name: userName, password, role }),
    });
    await response.json();
    fetchUsers();
    clearInput(); // 입력 필드 초기화
  };

  // 유저 수정
  const updateUser = async () => {
    if (!selectedUser) return; // 선택된 유저가 없으면 리턴

    const response = await fetch('/api/users', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: selectedUser.id, user_name: userName, password, role }), // 수정된 부분
    });
    await response.json();
    fetchUsers();
    clearInput(); // 입력 필드 초기화
    setSelectedUser(null); // 선택된 유저 초기화
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

  // 입력 필드 초기화
  const clearInput = () => {
    setUserName('');
    setPassword('');
    setRole('');
  };

  // 수정 버튼 클릭 시 입력 필드에 값 채우기
  const handleEdit = (user: User) => {
    setSelectedUser(user); // 선택된 유저 설정
    setUserName(user.user_name);
    setPassword(user.password || ""); // password가 없을 경우 빈 문자열로
    setRole(user.role);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>

      {/* 유저 생성 및 수정 필드 */}
      <div className="mb-4">
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="User Name"
          className="border border-gray-300 p-2 rounded-md mr-2"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="border border-gray-300 p-2 rounded-md mr-2"
        />
        <input
          type="text"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="Role"
          className="border border-gray-300 p-2 rounded-md mr-2"
        />
        <Button color="primary" onClick={selectedUser ? updateUser : createUser}>
          {selectedUser ? 'Update User' : 'Create User'}
        </Button>
      </div>

      {/* 유저 목록 */}
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
