import type { Meta, StoryObj } from "@storybook/react";
import { Toggle } from "./Toggle";
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Maximize2, Minimize2, ChevronsUpDown } from "lucide-react";
import { useArgs } from "@storybook/preview-api";
import { useState } from "react";

type ToggleProps = {
  variant?: "default" | "outline";
  size?: "sm" | "default" | "lg";
  pressed?: boolean;
  disabled?: boolean;
  "aria-label"?: string;
  "aria-invalid"?: boolean;
  isCustom?: boolean;
  bgColor?: string;
  activeBgColor?: string;
  textColor?: string;
  activeTextColor?: string;
  iconColor?: string;
  activeIconColor?: string;
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

const meta = {
  title: "ATOM/Toggle",
  component: Toggle,
  tags: ["autodocs"],
  argTypes: {
    // 기본 스타일 옵션
    variant: {
      control: "select",
      options: ["default", "outline"],
      description: "토글 버튼의 스타일 변형",
      defaultValue: "default",
    },
    size: {
      control: "select",
      options: ["sm", "default", "lg"],
      description: "토글 버튼의 크기",
      defaultValue: "default",
    },
    pressed: {
      control: "boolean",
      description: "토글의 선택 상태 (제어 컴포넌트로 사용 시)",
      defaultValue: false,
    },
    disabled: {
      control: "boolean",
      description: "비활성화 상태",
      defaultValue: false,
    },
    "aria-invalid": {
      control: "boolean",
      description: "유효하지 않은 상태 표시",
      defaultValue: false,
    },
    // 커스텀 스타일 옵션
    isCustom: {
      control: "boolean",
      description: "커스텀 스타일 적용 여부",
      defaultValue: false,
    },
    bgColor: {
      control: "color",
      description: "배경 색상 (기본 상태)",
      if: { arg: "isCustom", truthy: true },
    },
    activeBgColor: {
      control: "color",
      description: "활성화된 배경 색상",
      if: { arg: "isCustom", truthy: true },
    },
    textColor: {
      control: "color",
      description: "텍스트 색상 (기본 상태)",
      if: { arg: "isCustom", truthy: true },
    },
    activeTextColor: {
      control: "color",
      description: "활성화된 텍스트 색상",
      if: { arg: "isCustom", truthy: true },
    },
    iconColor: {
      control: "color",
      description: "아이콘 색상 (기본 상태)",
      if: { arg: "isCustom", truthy: true },
    },
    activeIconColor: {
      control: "color",
      description: "활성화된 아이콘 색상",
      if: { arg: "isCustom", truthy: true },
    },
    children: {
      control: { type: "text" },
      description: "토글 버튼 내용",
      defaultValue: "토글",
    },
  },
} satisfies Meta<ToggleProps>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 토글 - 모든 컨트롤을 조절 가능한 예제
export const Default: Story = {
  render: function Render(args) {
    const [{ pressed }, updateArgs] = useArgs();
    
    const handleClick = () => {
      updateArgs({ pressed: !pressed });
    };
    
    return (
      <div className="flex flex-col gap-4">
        <Toggle 
          {...args} 
          pressed={pressed}
          onClick={handleClick}
        >
          {typeof args.children === 'string' ? args.children : <Bold />}
        </Toggle>
        <div className="text-sm text-gray-500">
          현재 상태: {pressed ? '켜짐' : '꺼짐'}
        </div>
      </div>
    );
  },
  args: {
    variant: "default",
    size: "default",
    pressed: false,
    disabled: false,
    "aria-invalid": false,
    isCustom: false,
    children: "토글",
  },
};

// 아이콘 토글 변형
export const IconToggle: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex gap-2 items-center">
        <span className="text-sm w-24">텍스트 포맷:</span>
        <Toggle variant="default" aria-label="Bold">
          <Bold className="size-4" />
        </Toggle>
        <Toggle variant="default" aria-label="Italic">
          <Italic className="size-4" />
        </Toggle>
        <Toggle variant="default" aria-label="Underline">
          <Underline className="size-4" />
        </Toggle>
      </div>
      
      <div className="flex gap-2 items-center">
        <span className="text-sm w-24">텍스트 정렬:</span>
        <Toggle variant="outline" aria-label="Align left">
          <AlignLeft className="size-4" />
        </Toggle>
        <Toggle variant="outline" aria-label="Align center">
          <AlignCenter className="size-4" />
        </Toggle>
        <Toggle variant="outline" aria-label="Align right">
          <AlignRight className="size-4" />
        </Toggle>
      </div>
      
      <div className="flex gap-2 items-center">
        <span className="text-sm w-24">창 조절:</span>
        <Toggle variant="default" size="sm" aria-label="Minimize">
          <Minimize2 className="size-3" />
        </Toggle>
        <Toggle variant="default" size="default" aria-label="Toggle size">
          <ChevronsUpDown className="size-4" />
        </Toggle>
        <Toggle variant="default" size="lg" aria-label="Maximize">
          <Maximize2 className="size-5" />
        </Toggle>
      </div>
    </div>
  ),
};

// 크기 변형
export const SizeVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 items-center">
        <span className="text-sm w-24">Small:</span>
        <Toggle variant="default" size="sm">S</Toggle>
        <Toggle variant="outline" size="sm">S</Toggle>
      </div>
      
      <div className="flex gap-4 items-center">
        <span className="text-sm w-24">Default:</span>
        <Toggle variant="default" size="default">M</Toggle>
        <Toggle variant="outline" size="default">M</Toggle>
      </div>
      
      <div className="flex gap-4 items-center">
        <span className="text-sm w-24">Large:</span>
        <Toggle variant="default" size="lg">L</Toggle>
        <Toggle variant="outline" size="lg">L</Toggle>
      </div>
    </div>
  ),
};

// 스타일 변형
export const StyleVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 items-center">
        <span className="text-sm w-24">Default:</span>
        <Toggle variant="default">기본 스타일</Toggle>
      </div>
      
      <div className="flex gap-4 items-center">
        <span className="text-sm w-24">Outline:</span>
        <Toggle variant="outline">아웃라인 스타일</Toggle>
      </div>
      
      <div className="flex gap-4 items-center">
        <span className="text-sm w-24">Invalid:</span>
        <Toggle variant="default" aria-invalid={true}>오류 상태</Toggle>
        <Toggle variant="outline" aria-invalid={true}>오류 상태</Toggle>
      </div>
      
      <div className="flex gap-4 items-center">
        <span className="text-sm w-24">Disabled:</span>
        <Toggle variant="default" disabled>비활성화</Toggle>
        <Toggle variant="outline" disabled>비활성화</Toggle>
      </div>
    </div>
  ),
};

export const CustomStyled: Story = {
  render: function Render() {
    const [isPrimary, setIsPrimary] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isWarning, setIsWarning] = useState(false);
    const [isDanger, setIsDanger] = useState(false);
    
    return (
      <div className="flex flex-col gap-4">
        <div className="flex gap-4 items-center">
          <span className="text-sm w-24">기본 커스텀:</span>
          <Toggle
            isCustom
            bgColor="#f8fafc"
            activeBgColor="#1e293b"
            textColor="#334155"
            onClick={() => setIsPrimary(!isPrimary)}
            pressed={isPrimary}
          >
            커스텀 토글
          </Toggle>
        </div>

        <div className="flex gap-4 items-center">
          <span className="text-sm w-24">테마 커스텀:</span>
          <Toggle
            isCustom
            bgColor="#f0fdf4"
            activeBgColor="#166534"
            textColor="#166534"
            onClick={() => setIsSuccess(!isSuccess)}
            pressed={isSuccess}
          >
            성공
          </Toggle>

          <Toggle
            isCustom
            bgColor="#fffbeb"
            activeBgColor="#a16207"
            textColor="#a16207"
            onClick={() => setIsWarning(!isWarning)}
            pressed={isWarning}
          >
            경고
          </Toggle>

          <Toggle
            isCustom
            bgColor="#fef2f2"
            activeBgColor="#b91c1c"
            textColor="#b91c1c"
            onClick={() => setIsDanger(!isDanger)}
            pressed={isDanger}
          >
            위험
          </Toggle>
        </div>

        <div className="flex gap-4 items-center">
          <span className="text-sm w-24">아이콘 커스텀:</span>
          <Toggle
            isCustom
            bgColor="#f0f9ff"
            activeBgColor="#0c4a6e"
            iconColor="#0369a1"
          >
            <Bold className="size-4" />
          </Toggle>
        </div>
      </div>
    );
  },
};

// 토글 그룹 예제
export const ToggleGroup: Story = {
  render: function Render() {
    const [alignment, setAlignment] = useState<string | null>("center");
    
    return (
      <div className="flex flex-col gap-6">
        <div className="flex gap-2 items-center">
          <span className="text-sm w-24">텍스트 정렬:</span>
          <div className="flex border rounded-md">
            <Toggle
              className="rounded-none rounded-l-md border-0"
              pressed={alignment === "left"}
              onClick={() => setAlignment("left")}
              variant="outline"
              aria-label="Align left"
            >
              <AlignLeft className="size-4" />
            </Toggle>
            <Toggle
              className="rounded-none border-0 border-x"
              pressed={alignment === "center"}
              onClick={() => setAlignment("center")}
              variant="outline"
              aria-label="Align center"
            >
              <AlignCenter className="size-4" />
            </Toggle>
            <Toggle
              className="rounded-none rounded-r-md border-0"
              pressed={alignment === "right"}
              onClick={() => setAlignment("right")}
              variant="outline"
              aria-label="Align right"
            >
              <AlignRight className="size-4" />
            </Toggle>
          </div>
          <span className="text-sm text-gray-500 ml-2">선택됨: {alignment}</span>
        </div>
      </div>
    );
  },
};

// 실제 사용 사례
export const RealWorldExamples: Story = {
  render: function Render() {
    const [darkMode, setDarkMode] = useState(false);
    const [notifications, setNotifications] = useState(true);
    const [autoSave, setAutoSave] = useState(true);
    
    return (
      <div className="flex flex-col gap-4 w-80 p-4 border rounded-md">
        <h3 className="text-lg font-medium">사용자 설정</h3>
        
        <div className="flex justify-between items-center">
          <span>다크 모드</span>
          <Toggle
            variant="default"
            size="sm"
            pressed={darkMode}
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle dark mode"
          >
            {darkMode ? "켜짐" : "꺼짐"}
          </Toggle>
        </div>
        
        <div className="flex justify-between items-center">
          <span>알림 수신</span>
          <Toggle
            variant="outline"
            size="sm"
            pressed={notifications}
            onClick={() => setNotifications(!notifications)}
            aria-label="Toggle notifications"
          >
            {notifications ? "켜짐" : "꺼짐"}
          </Toggle>
        </div>
        
        <div className="flex justify-between items-center">
          <span>자동 저장</span>
          <Toggle
            isCustom
            bgColor="#f1f5f9"
            activeBgColor="#0f766e"
            textColor="#334155"
            size="sm"
            pressed={autoSave}
            onClick={() => setAutoSave(!autoSave)}
            aria-label="Toggle auto save"
          >
            {autoSave ? "켜짐" : "꺼짐"}
          </Toggle>
        </div>
      </div>
    );
  },
};

// 상태별 전환 테스트
export const StateTransition: Story = {
  render: function Render() {
    const [states, setStates] = useState({
      toggle1: false,
      toggle2: false,
      toggle3: false,
    });
    
    return (
      <div className="flex flex-col gap-6">
        <div className="flex gap-4 items-center">
          <Toggle
            variant="default"
            pressed={states.toggle1}
            onClick={() => setStates({...states, toggle1: !states.toggle1})}
          >
            {states.toggle1 ? "활성화됨" : "비활성화됨"}
          </Toggle>
          <span className="text-sm text-gray-500">
            기본 상태 전환
          </span>
        </div>
        
        <div className="flex gap-4 items-center">
          <Toggle
            variant="outline"
            pressed={states.toggle2}
            onClick={() => setStates({...states, toggle2: !states.toggle2})}
          >
            <Bold className={states.toggle2 ? "text-primary" : ""} />
          </Toggle>
          <span className="text-sm text-gray-500">
            아이콘 스타일 전환
          </span>
        </div>
        
        <div className="flex gap-4 items-center">
          <Toggle
            isCustom
            bgColor="#f9fafb"
            activeBgColor="#4f46e5"
            textColor="#4b5563"
            pressed={states.toggle3}
            onClick={() => setStates({...states, toggle3: !states.toggle3})}
          >
            {states.toggle3 ? "켜짐" : "꺼짐"}
          </Toggle>
          <span className="text-sm text-gray-500">
            커스텀 스타일 전환
          </span>
        </div>
      </div>
    );
  },
};