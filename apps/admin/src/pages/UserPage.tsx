import React, { useState } from "react";
import { Table, Button, Input, Select, Space, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import RegistrationModal from "../components/molecules/RegistrationModal";
import UserRegistrationForm from "../components/organisms/UserRegistrationForm";


const initialUsers: User[] = getUsers();

const UserPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterValue, setFilterValue] = useState<string | undefined>(undefined);

  const columns = [
    { title: "이름", dataIndex: "name", key: "name" },
    { title: "이메일", dataIndex: "email", key: "email" },
    { title: "전화번호", dataIndex: "phone", key: "phone" },
  ];

  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => setIsModalOpen(false);

  const handleRegistrationSubmit = (values: {
    name: string;
    email: string;
    phone?: string;
  }) => {
    const newUser: User = {
      key: users.length + 1,
      ...values,
    };
    setUsers([...users, newUser]);
    message.success("사용자 등록 완료!");
    setIsModalOpen(false);
  };

  // 검색 및 필터 적용 (예: 이름 검색, 이메일 도메인 필터)
  const filteredUsers = users.filter((user) => {
    const matchName = user.name
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const matchEmail = user.email
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const matchFilter = filterValue ? user.email.includes(filterValue) : true;
    return (matchName || matchEmail) && matchFilter;
  });

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Space>
          <Input
            placeholder="검색어 입력"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Select
            placeholder="필터 선택"
            style={{ width: 120 }}
            allowClear
            value={filterValue}
            onChange={(value) => setFilterValue(value)}
          >
            <Select.Option value="example.com">example.com</Select.Option>
            <Select.Option value="test.com">test.com</Select.Option>
          </Select>
        </Space>
        <Button type="primary" onClick={showModal}>
          사용자 등록
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={filteredUsers}
        pagination={{ pageSize: 10 }} // 페이지당 10개씩 표시
      />

      <RegistrationModal
        open={isModalOpen}
        title="사용자 등록"
        onCancel={handleCancel}
        onSubmit={handleRegistrationSubmit}
      >
        <UserRegistrationForm />
      </RegistrationModal>
    </div>
  );
};

export default UserPage;
