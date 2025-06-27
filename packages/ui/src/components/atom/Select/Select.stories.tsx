import type { Meta, StoryObj } from "@storybook/react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
} from "./Select";

const meta: Meta<typeof Select> = {
  title: "ATOM/Select",
  component: Select,
  tags: ["autodocs"]   
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="선택하세요" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option1">리스트 이름 1</SelectItem>
        <SelectItem value="option2">리스트 이름 2</SelectItem>
        <SelectItem value="option3">리스트 이름 3</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const WithFocus: Story = {
  name: "포커스 상태",
  render: () => (
    <Select defaultOpen>
      <SelectTrigger className="focus">
        <SelectValue placeholder="선택하세요" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option1">리스트 이름 1</SelectItem>
        <SelectItem value="option2">리스트 이름 2</SelectItem>
        <SelectItem value="option3">리스트 이름 3</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const WithError: Story = {
  name: "에러 상태",
  render: () => (
    <Select>
      <SelectTrigger data-invalid={true}>
        <SelectValue placeholder="선택하세요" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option1">리스트 이름 1</SelectItem>
        <SelectItem value="option2">리스트 이름 2</SelectItem>
        <SelectItem value="option3">리스트 이름 3</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const Disabled: Story = {
  name: "비활성화 상태",
  render: () => (
    <Select disabled>
      <SelectTrigger>
        <SelectValue placeholder="선택하세요" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option1">리스트 이름 1</SelectItem>
        <SelectItem value="option2">리스트 이름 2</SelectItem>
        <SelectItem value="option3">리스트 이름 3</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const OpenList: Story = {
  name: "오픈된 리스트",
  render: () => (
    <div className="flex flex-col">
      <div className="mb-4">
        <Select defaultOpen>
          <SelectTrigger>
            <SelectValue placeholder="선택하세요" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">리스트 이름 1</SelectItem>
            <SelectItem value="option2">리스트 이름 1</SelectItem>
            <SelectItem value="option3" className="data-[highlighted=true]:text-zinc-700">리스트 이름 오버</SelectItem>
            <SelectItem value="option4" className="text-blue-600">리스트 이름 선택 됨</SelectItem>
            <SelectItem value="option5">리스트 이름 1</SelectItem>
            <SelectItem value="option6">리스트 이름 1</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  ),
};

export const WithGroupAndLabel: Story = {
  name: "그룹 및 라벨 포함",
  render: () => (
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="선택하세요" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>그룹 1</SelectLabel>
          <SelectItem value="option1">리스트 이름 1</SelectItem>
          <SelectItem value="option2">리스트 이름 2</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>그룹 2</SelectLabel>
          <SelectItem value="option3">리스트 이름 3</SelectItem>
          <SelectItem value="option4">리스트 이름 4</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};

export const AllStates: Story = {
  name: "모든 상태",
  render: () => (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-sm mb-2">기본 상태</p>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="선택하세요" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">리스트 이름 1</SelectItem>
            <SelectItem value="option2">리스트 이름 2</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <p className="text-sm mb-2">에러 상태</p>
        <Select>
          <SelectTrigger data-invalid={true}>
            <SelectValue placeholder="선택하세요" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">리스트 이름 1</SelectItem>
            <SelectItem value="option2">리스트 이름 2</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <p className="text-sm mb-2">비활성화 상태</p>
        <Select disabled>
          <SelectTrigger>
            <SelectValue placeholder="선택하세요" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">리스트 이름 1</SelectItem>
            <SelectItem value="option2">리스트 이름 2</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  ),
};