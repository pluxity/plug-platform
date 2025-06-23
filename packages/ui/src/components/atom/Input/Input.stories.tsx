import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./Input";
import React, { useState } from "react";

const meta: Meta<typeof Input> = {
  title: "ATOM/Input",
  component: Input,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    placeholder: "텍스트를 입력하세요",
  },
};

export const WithDefaultValue: Story = {
  args: {
    placeholder: "텍스트를 입력하세요",
    defaultValue: "기본 값이 설정되어 있습니다",
  },
};

export const WithInfoIcon: Story = {
  args: {
    placeholder: "텍스트를 입력하세요",
    icon: "info",
  },
};

export const Password: Story = {
  args: {
    type: "password",
    placeholder: "비밀번호를 입력하세요",
  },
};

export const Error: Story = {
  args: {
    placeholder: "텍스트를 입력하세요",
    error: true,
  },
};

export const ErrorWithInfoIcon: Story = {
  args: {
    placeholder: "텍스트를 입력하세요",
    icon: "info",
    error: true,
  },
};

export const ErrorPassword: Story = {
  args: {
    type: "password",
    placeholder: "비밀번호를 입력하세요",
    error: true,
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "비활성화된 입력 필드",
    disabled: true,
  },
};

export const DisabledWithInfoIcon: Story = {
  args: {
    placeholder: "비활성화된 입력 필드",
    icon: "info",
    disabled: true,
  },
};

export const DisabledPassword: Story = {
  args: {
    type: "password",
    placeholder: "비활성화된 비밀번호 필드",
    disabled: true,
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="space-y-2">
      <label htmlFor="with-label" className="text-sm font-medium">
        이메일
      </label>
      <Input id="with-label" placeholder="example@email.com" type="email" />
    </div>
  ),
};

export const WithValidation: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = useState("");
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [isValid, setIsValid] = useState(true);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      setValue(inputValue);
      setIsValid(inputValue.length >= 5);
    };

    return (
      <div className="space-y-2">
        <label htmlFor="validation-input" className="text-sm font-medium">
          사용자 이름 (5자 이상)
        </label>
        <Input
          id="validation-input"
          value={value}
          onChange={handleChange}
          error={!isValid && value !== ""}
          placeholder="사용자 이름을 입력하세요"
        />
        {!isValid && value !== "" && (
          <p className="text-xs text-red-500">사용자 이름은 5자 이상이어야 합니다.</p>
        )}
      </div>
    );
  },
};

export const AllStates: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">기본 입력 필드</h3>
        <div className="flex flex-wrap gap-4">
          <div>
            <p className="text-xs mb-1">기본</p>
            <Input placeholder="텍스트를 입력하세요" />
          </div>
          <div>
            <p className="text-xs mb-1">에러</p>
            <Input placeholder="텍스트를 입력하세요" error={true} />
          </div>
          <div>
            <p className="text-xs mb-1">비활성화</p>
            <Input placeholder="텍스트를 입력하세요" disabled />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">정보 아이콘이 있는 입력 필드</h3>
        <div className="flex flex-wrap gap-4">
          <div>
            <p className="text-xs mb-1">기본</p>
            <Input placeholder="텍스트를 입력하세요" icon="info" />
          </div>
          <div>
            <p className="text-xs mb-1">에러</p>
            <Input placeholder="텍스트를 입력하세요" icon="info" error={true} />
          </div>
          <div>
            <p className="text-xs mb-1">비활성화</p>
            <Input placeholder="텍스트를 입력하세요" icon="info" disabled />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">비밀번호 입력 필드</h3>
        <div className="flex flex-wrap gap-4">
          <div>
            <p className="text-xs mb-1">기본</p>
            <Input type="password" placeholder="비밀번호를 입력하세요" />
          </div>
          <div>
            <p className="text-xs mb-1">에러</p>
            <Input type="password" placeholder="비밀번호를 입력하세요" error={true} />
          </div>
          <div>
            <p className="text-xs mb-1">비활성화</p>
            <Input type="password" placeholder="비밀번호를 입력하세요" disabled />
          </div>
        </div>
      </div>
    </div>
  ),
};

export const WithVariousTypes: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="text-input" className="text-sm font-medium">
          텍스트
        </label>
        <Input id="text-input" type="text" placeholder="텍스트 입력" />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="password-input" className="text-sm font-medium">
          비밀번호
        </label>
        <Input id="password-input" type="password" placeholder="비밀번호 입력" />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="number-input" className="text-sm font-medium">
          숫자
        </label>
        <Input id="number-input" type="number" placeholder="숫자 입력" />
      </div>
    </div>
  ),
};