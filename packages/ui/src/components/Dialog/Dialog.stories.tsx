import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Dialog } from './Dialog';
import { Button } from '../Button/Button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../Card/Card';

const meta: Meta<typeof Dialog> = {
  title: 'Components/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: '다이얼로그 표시 여부',
      defaultValue: false
    },
    onClose: {
      action: 'closed',
      description: '다이얼로그가 닫힐 때 호출되는 함수'
    },
    closeOnOverlayClick: {
      control: 'boolean',
      description: '오버레이 클릭 시 닫기 여부',
      defaultValue: true
    },
    closeOnEsc: {
      control: 'boolean',
      description: 'ESC 키 누를 시 닫기 여부',
      defaultValue: true
    },
    overlayClassName: {
      control: 'text',
      description: '오버레이에 적용할 추가 클래스'
    },
    contentClassName: {
      control: 'text',
      description: '콘텐츠에 적용할 추가 클래스'
    }
  },
};

export default meta;
type Story = StoryObj<typeof Dialog>;

// 다이얼로그 컨트롤러 컴포넌트
const DialogController: React.FC<{
  children: (props: { isOpen: boolean; onClose: () => void }) => React.ReactNode;
}> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);
  
  return (
    <div>
      <Button onClick={handleOpen}>다이얼로그 열기</Button>
      {children({ isOpen, onClose: handleClose })}
    </div>
  );
};

export const Default: Story = {
  render: (args) => (
    <DialogController>
      {({ isOpen, onClose }) => (
        <Dialog
          {...args}
          isOpen={isOpen}
          onClose={onClose}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4">기본 다이얼로그</h2>
            <p>다이얼로그는 모달과 팝업의 기본이 되는 컴포넌트입니다.</p>
            <p className="mt-2">오버레이와 포털 기능을 제공합니다.</p>
            <div className="mt-6 flex justify-end">
              <Button onClick={onClose}>닫기</Button>
            </div>
          </div>
        </Dialog>
      )}
    </DialogController>
  ),
};

export const CustomOverlay: Story = {
  render: (args) => (
    <DialogController>
      {({ isOpen, onClose }) => (
        <Dialog
          {...args}
          isOpen={isOpen}
          onClose={onClose}
          overlayClassName="bg-blue-500 bg-opacity-30 backdrop-blur-sm"
        >
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4">커스텀 오버레이</h2>
            <p>overlayClassName 속성을 통해 오버레이의 스타일을 변경할 수 있습니다.</p>
            <div className="mt-6 flex justify-end">
              <Button onClick={onClose}>닫기</Button>
            </div>
          </div>
        </Dialog>
      )}
    </DialogController>
  ),
};

export const CustomContent: Story = {
  render: (args) => (
    <DialogController>
      {({ isOpen, onClose }) => (
        <Dialog
          {...args}
          isOpen={isOpen}
          onClose={onClose}
          contentClassName="max-w-md rounded-3xl overflow-hidden"
        >
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white">
            <h2 className="text-lg font-semibold mb-4">커스텀 콘텐츠</h2>
            <p>contentClassName 속성을 통해 콘텐츠 컨테이너의 스타일을 변경할 수 있습니다.</p>
            <div className="mt-6 flex justify-end">
              <Button 
                className="bg-white text-purple-500 hover:bg-gray-100" 
                onClick={onClose}
              >
                닫기
              </Button>
            </div>
          </div>
        </Dialog>
      )}
    </DialogController>
  ),
};

export const WithCard: Story = {
  render: (args) => (
    <DialogController>
      {({ isOpen, onClose }) => (
        <Dialog
          {...args}
          isOpen={isOpen}
          onClose={onClose}
          contentClassName="p-0 overflow-hidden"
        >
          <Card className="border-0 shadow-none">
            <CardHeader>
              <CardTitle>카드가 포함된 다이얼로그</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Dialog 컴포넌트 안에 Card 컴포넌트를 포함시킬 수 있습니다.</p>
              <p className="mt-2">이렇게 하면 일관된 디자인 시스템을 유지하면서 다양한 컴포넌트를 조합할 수 있습니다.</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={onClose}>닫기</Button>
            </CardFooter>
          </Card>
        </Dialog>
      )}
    </DialogController>
  ),
}; 