import React from "react";
import { Form, Input, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const DrawingRegistrationForm: React.FC = () => {
  return (
    <Form layout="vertical">
      <Form.Item
        label="도면 제목"
        name="title"
        rules={[{ required: true, message: "도면 제목을 입력해주세요." }]}
      >
        <Input placeholder="도면 제목을 입력하세요" />
      </Form.Item>
      <Form.Item
        label="등록일"
        name="date"
        rules={[{ required: true, message: "등록일을 입력해주세요." }]}
      >
        <Input placeholder="YYYY-MM-DD 형식으로 입력" />
      </Form.Item>
      <Form.Item
        label="썸네일 URL"
        name="thumbnailUrl"
        rules={[{ required: true, message: "썸네일 URL을 입력해주세요." }]}
      >
        <Input placeholder="https://example.com/thumbnail.jpg" />
      </Form.Item>
      <Form.Item
        label="이미지 파일 업로드"
        name="imageFile"
        rules={[{ required: true, message: "이미지 파일을 업로드해주세요." }]}
      >
        <Upload beforeUpload={() => false} listType="picture">
          <Button icon={<UploadOutlined />}>파일 선택</Button>
        </Upload>
      </Form.Item>
    </Form>
  );
};

export default DrawingRegistrationForm;
