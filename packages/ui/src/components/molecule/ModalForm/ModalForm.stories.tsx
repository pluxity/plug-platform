import type { Meta, StoryObj } from "@storybook/react";
import { ModalForm, ModalFormItem } from "./ModalForm";
import { Input } from "../../atom/Input/Input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '../../atom/Select/Select';

const meta: Meta<typeof ModalForm> = {
  title: "MOLECULE/ModalForm",
  component: ModalForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ModalForm>;

export const Default: Story = {
  render: () => (
    <ModalForm>
      <ModalFormItem label="아이디">
        <Input className="w-full" placeholder="텍스트를 입력하세요" aria-label="아이디" />
        <div className="text-xs text-gray-400 mt-1">6~12자의 영문 소문자로 시작하는 영문, 숫자 조합으로 입력</div>
      </ModalFormItem>
      <ModalFormItem label="사용자명">
        <Input className="w-full" placeholder="텍스트를 입력하세요" aria-label="사용자명" />
      </ModalFormItem>
      <ModalFormItem label="비밀번호">
        <Input className="w-full" placeholder="비밀번호를 입력하세요" type="password" aria-label="비밀번호" />
        <div className="text-xs text-gray-400 mt-1">8~15자의 영문, 숫자, 특수문자 조합으로 입력</div>
      </ModalFormItem>
      <ModalFormItem label="사용자 그룹">
        <Select>
          <SelectTrigger aria-label="사용자 그룹">
            <SelectValue placeholder="그룹 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">관리자</SelectItem>
            <SelectItem value="user">일반</SelectItem>
          </SelectContent>
        </Select>
      </ModalFormItem>
      <ModalFormItem label="연락처">
        <Input className="w-full" placeholder="숫자 입력" aria-label="연락처" />
      </ModalFormItem>
      <ModalFormItem label="부서명">
        <Input className="w-full" aria-label="부서명" />
      </ModalFormItem>
    </ModalForm>
  ),
};




