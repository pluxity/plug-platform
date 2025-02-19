import React from "react";
import { Form, Input } from "antd";

const UserRegistrationForm: React.FC = () => {
  return (
    <Form layout="vertical">
      <Form.Item
        label="이름"
        name="name"
        rules={[{ required: true, message: "이름을 입력해주세요." }]}
      >
        <Input placeholder="이름을 입력하세요" />
      </Form.Item>
      <Form.Item
        label="이메일"
        name="email"
        rules={[
          { required: true, message: "이메일을 입력해주세요." },
          { type: "email", message: "유효한 이메일을 입력해주세요." },
        ]}
      >
        <Input placeholder="이메일을 입력하세요" />
      </Form.Item>
      <Form.Item label="전화번호" name="phone">
        <Input placeholder="전화번호를 입력하세요" />
      </Form.Item>
    </Form>
  );
};

export default UserRegistrationForm;
