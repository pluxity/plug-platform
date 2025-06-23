import type { Meta, StoryObj } from "@storybook/react";
import { Textarea } from "./Textarea";

const meta: Meta<typeof Textarea> = {
  title: "ATOM/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  argTypes: {
    disabled: { control: "boolean" },
    error: { control: "boolean" },
    placeholder: { control: "text" },
    className: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: {
    placeholder: "텍스트를 입력하세요",
  },
};

export const WithValue: Story = {
  args: {
    defaultValue: "입력된 텍스트",
    placeholder: "텍스트를 입력하세요",
  },
};

export const Focused: Story = {
  args: {
    placeholder: "텍스트를 입력하세요",
  },
  parameters: {
    pseudo: { focus: true },
  },
};

export const Error: Story = {
  args: {
    error: true,
    placeholder: "텍스트를 입력하세요",
  },
};

export const ErrorWithValue: Story = {
  args: {
    error: true,
    defaultValue: "잘못된 값이 입력됨",
    placeholder: "텍스트를 입력하세요",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: "텍스트를 입력하세요",
  },
};

export const DisabledWithValue: Story = {
  args: {
    disabled: true,
    defaultValue: "입력 비활성화 상태입니다.",
    placeholder: "텍스트를 입력하세요",
  },
};

export const CustomSize: Story = {
  args: {
    placeholder: "텍스트를 입력하세요",
    className: "w-80 h-32",
  },
};

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <div className="flex flex-col items-start gap-2">
        <p className="text-sm font-medium">기본 상태</p>
        <Textarea placeholder="텍스트를 입력하세요" />
      </div>
      
      <div className="flex flex-col items-start gap-2">
        <p className="text-sm font-medium">에러 상태</p>
        <Textarea error placeholder="텍스트를 입력하세요" />
      </div>
      
      <div className="flex flex-col items-start gap-2">
        <p className="text-sm font-medium">비활성화 상태</p>
        <Textarea disabled placeholder="텍스트를 입력하세요" />
      </div>
    </div>
  ),
};