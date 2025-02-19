import { ReactNode } from "react";
import { Modal, Button, Form } from "antd";

interface RegistrationModalProps<T = unknown> {
  open: boolean;
  title: string;
  onCancel: () => void;
  onSubmit: (values: T) => void;
  children: ReactNode;
}

const RegistrationModal = <T,>({
  open,
  title,
  onCancel,
  onSubmit,
  children,
}: RegistrationModalProps<T>) => {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        onSubmit(values);
      })
      .catch((errorInfo) => {
        console.error("Validation Failed:", errorInfo);
      });
  };

  return (
    <Modal
      title={title}
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          취소
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          등록
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        {children}
      </Form>
    </Modal>
  );
};

export default RegistrationModal;
