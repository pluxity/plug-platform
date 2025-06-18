import type { Meta, StoryObj } from "@storybook/react";
import { Textarea } from "./Textarea";

const meta: Meta<typeof Textarea> = {
  title: "ATOM/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  argTypes: {
    disabled: { control: "boolean" },
    placeholder: { control: "text" },
    rows: { control: "number" },
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: {
    placeholder: "내용을 입력하세요...",
  },
};

export const WithDefaultValue: Story = {
  args: {
    defaultValue: "기본 텍스트가 들어가 있습니다.",
  },
};

export const Invalid: Story = {
  args: {
    "aria-invalid": true,
    defaultValue: "잘못된 값이 입력됨",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: "입력 비활성화 상태입니다.",
  },
};