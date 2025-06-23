import type { Meta, StoryObj } from "@storybook/react";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from './Drawer'
import { Button } from '../Button/Button'

const meta: Meta<typeof Drawer> = {
  title: "ATOM/Drawer",
  component: Drawer,
  tags: ["autodocs"],
  argTypes: {
    direction: {
      control: "select",
      options: ["top", "right", "bottom", "left"],
      defaultValue: "bottom",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Drawer>;

export const Default: Story = {
  render: (args) => (
    <Drawer {...args}>
      <DrawerTrigger asChild>
        <Button variant="outline">Drawer 열기</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>제목</DrawerTitle>
          <DrawerDescription>설명 텍스트를 여기에 작성하세요.</DrawerDescription>
        </DrawerHeader>
        <div className="p-4">
          <p>Drawer 컴포넌트의 내용이 여기에 들어갑니다.</p>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button>닫기</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

export const TopDirection: Story = {
  args: {
    direction: "top",
  },
  render: (args) => (
    <Drawer {...args}>
      <DrawerTrigger asChild>
        <Button variant="outline">위쪽 Drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>위쪽 Drawer</DrawerTitle>
          <DrawerDescription>위쪽에서 열리는 Drawer 예시입니다.</DrawerDescription>
        </DrawerHeader>
        <div className="p-4">
          <p>Drawer 컴포넌트의 내용이 여기에 들어갑니다.</p>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button>닫기</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

export const LeftDirection: Story = {
  args: {
    direction: "left",
  },
  render: (args) => (
    <Drawer {...args}>
      <DrawerTrigger asChild>
        <Button variant="outline">왼쪽 Drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>왼쪽 Drawer</DrawerTitle>
          <DrawerDescription>왼쪽에서 열리는 Drawer 예시입니다.</DrawerDescription>
        </DrawerHeader>
        <div className="p-4">
          <p>Drawer 컴포넌트의 내용이 여기에 들어갑니다.</p>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button>닫기</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};