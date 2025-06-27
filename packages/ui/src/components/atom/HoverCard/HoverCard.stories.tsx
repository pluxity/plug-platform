import type { Meta, StoryObj } from "@storybook/react";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "./HoverCard";
import { useState, useEffect } from "react";
import { 
  User, 
  Mail,
  MapPin, 
  Calendar, 
  Briefcase, 
  Heart,
  Share,
  MessageCircle,
  Image,
  Book,
} from "lucide-react";

type HoverCardProps = {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  openDelay?: number;
  closeDelay?: number;
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
  align?: "start" | "center" | "end";
  alignOffset?: number;
  avoidCollisions?: boolean;
  collisionBoundary?: boolean;
  collisionPadding?: number | { top?: number; right?: number; bottom?: number; left?: number };
  arrowPadding?: number;
  sticky?: "partial" | "always";
  hideWhenDetached?: boolean;
  disableOutsidePointerEvents?: boolean;
  variant?: "default" | "outline" | "solid" | "flat";
  size?: "sm" | "default" | "lg";
  hasArrow?: boolean;
  arrowSize?: number;
  className?: string;
  contentClassName?: string;
  customStyles?: {
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
    boxShadow?: string;
  };
};

const meta: Meta<HoverCardProps> = {
  title: "ATOM/HoverCard",
  component: HoverCard,
  tags: ["autodocs"],
  argTypes: {
    defaultOpen: {
      control: "boolean",
      description: "초기 열림 상태",
      defaultValue: false,
    },
    open: {
      control: "boolean",
      description: "제어 컴포넌트로 사용 시 열림 상태",
    },
    openDelay: {
      control: { type: "number", min: 0, max: 1000, step: 10 },
      description: "마우스 오버 후 카드가 열리기까지의 지연 시간(ms)",
      defaultValue: 300,
    },
    closeDelay: {
      control: { type: "number", min: 0, max: 1000, step: 10 },
      description: "마우스가 벗어난 후 카드가 닫히기까지의 지연 시간(ms)",
      defaultValue: 300,
    },
    side: {
      control: "select",
      options: ["top", "right", "bottom", "left"],
      description: "카드가 나타날 방향",
      defaultValue: "bottom",
    },
    sideOffset: {
      control: { type: "number", min: 0, max: 20, step: 1 },
      description: "트리거와 카드 사이의 간격(px)",
      defaultValue: 5,
    },
    align: {
      control: "select",
      options: ["start", "center", "end"],
      description: "카드의 정렬 방향",
      defaultValue: "center",
    },
    alignOffset: {
      control: { type: "number", min: -20, max: 20, step: 1 },
      description: "정렬 오프셋",
      defaultValue: 0,
    },
    avoidCollisions: {
      control: "boolean",
      description: "뷰포트 충돌 방지 활성화",
      defaultValue: true,
    },
    collisionPadding: {
      control: { type: "number", min: 0, max: 20, step: 1 },
      description: "충돌 계산 시 사용할 여백",
      defaultValue: 10,
    },
    sticky: {
      control: "select",
      options: ["partial", "always"],
      description: "카드가 뷰포트에 유지되는 방식",
      defaultValue: "partial",
    },
    hideWhenDetached: {
      control: "boolean",
      description: "트리거에서 분리될 때 숨김 여부",
      defaultValue: false,
    },
    disableOutsidePointerEvents: {
      control: "boolean",
      description: "외부 포인터 이벤트 비활성화 여부",
      defaultValue: false,
    },
    variant: {
      control: "select",
      options: ["default", "outline", "solid", "flat"],
      description: "카드 스타일 변형",
      defaultValue: "default",
    },
    size: {
      control: "select",
      options: ["sm", "default", "lg"],
      description: "카드 크기",
      defaultValue: "default",
    },
    hasArrow: {
      control: "boolean",
      description: "화살표 표시 여부",
      defaultValue: true,
    },
    arrowSize: {
      control: { type: "number", min: 5, max: 15, step: 1 },
      description: "화살표 크기",
      defaultValue: 8,
      if: { arg: "hasArrow", truthy: true },
    },
    arrowPadding: {
      control: { type: "number", min: 0, max: 20, step: 1 },
      description: "화살표 여백",
      defaultValue: 5,
    },
    className: {
      control: "text",
      description: "루트 컴포넌트에 적용할 클래스",
    },
    contentClassName: {
      control: "text",
      description: "콘텐츠 컴포넌트에 적용할 클래스",
    },
    customStyles: {
      control: "object",
      description: "커스텀 스타일 설정",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const AllOptions: Story = {
  render: function Render(args) {
    const [isOpen, setIsOpen] = useState(args.defaultOpen || false);
    
    useEffect(() => {
      if (args.open !== undefined) {
        setIsOpen(args.open);
      }
    }, [args.open]);
    
    const handleOpenChange = (open: boolean) => {
      setIsOpen(open);
      if (args.onOpenChange) {
        args.onOpenChange(open);
      }
    };
    const getVariantClass = () => {
      switch (args.variant) {
        case "outline":
          return "border border-gray-200 bg-white";
        case "solid":
          return "border-none bg-gray-800 text-white";
        case "flat":
          return "border-none bg-gray-100";
        default:
          return "border border-gray-200 bg-white shadow-md";
      }
    };
    const getSizeClass = () => {
      switch (args.size) {
        case "sm":
          return "p-2 text-sm";
        case "lg":
          return "p-5 text-base";
        default:
          return "p-4";
      }
    };
    
    const variantClass = getVariantClass();
    const sizeClass = getSizeClass();

    const customStyle = args.customStyles ? {
      backgroundColor: args.customStyles.backgroundColor,
      color: args.customStyles.textColor,
      borderColor: args.customStyles.borderColor,
      boxShadow: args.customStyles.boxShadow,
    } : {};
    
    return (
      <div className="flex flex-col gap-6 items-center">
        <div className="p-4 bg-gray-50 rounded-md w-full max-w-md">
          <h3 className="text-lg font-medium mb-2">현재 설정</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="font-medium">열림 상태:</span> {isOpen ? "열림" : "닫힘"}
            </div>
            <div>
              <span className="font-medium">방향:</span> {args.side}
            </div>
            <div>
              <span className="font-medium">열림 지연:</span> {args.openDelay}ms
            </div>
            <div>
              <span className="font-medium">닫힘 지연:</span> {args.closeDelay}ms
            </div>
            <div>
              <span className="font-medium">변형:</span> {args.variant}
            </div>
            <div>
              <span className="font-medium">크기:</span> {args.size}
            </div>
          </div>
        </div>
        
        <div className="flex justify-center items-center h-96 w-full">
          <HoverCard
            defaultOpen={args.defaultOpen}
            open={args.open !== undefined ? args.open : isOpen}
            onOpenChange={handleOpenChange}
            openDelay={args.openDelay}
            closeDelay={args.closeDelay}
          >
            <HoverCardTrigger asChild>
              <div className="px-4 py-2 border rounded cursor-pointer bg-white hover:bg-gray-50 transition-colors">
                사용자 프로필 보기
              </div>
            </HoverCardTrigger>
            <HoverCardContent
              side={args.side}
              sideOffset={args.sideOffset}
              align={args.align}
              alignOffset={args.alignOffset}
              avoidCollisions={args.avoidCollisions}
              collisionPadding={args.collisionPadding}
              arrowPadding={args.arrowPadding}
              sticky={args.sticky}
              hideWhenDetached={args.hideWhenDetached}
              className={`rounded-lg ${variantClass} ${sizeClass} ${args.contentClassName || ""}`}
              style={customStyle}
            >
              {args.hasArrow && (
                <div
                  className="fill-current"
                  style={{
                    position: "absolute",
                    [args.side === "top" ? "bottom" : args.side === "bottom" ? "top" : args.side === "left" ? "right" : "left"]: -args.arrowSize,
                    width: args.arrowSize * 2,
                    height: args.arrowSize * 2,
                    transform: "rotate(45deg)",
                    background: args.customStyles?.backgroundColor || (args.variant === "solid" ? "rgb(31, 41, 55)" : args.variant === "flat" ? "rgb(243, 244, 246)" : "white"),
                    borderColor: args.customStyles?.borderColor || (args.variant === "default" || args.variant === "outline" ? "rgb(229, 231, 235)" : "transparent"),
                    borderStyle: "solid",
                    borderWidth: args.variant === "default" || args.variant === "outline" ? 1 : 0,
                    borderTopWidth: args.side === "bottom" ? 1 : 0,
                    borderLeftWidth: args.side === "right" ? 1 : 0,
                    borderBottomWidth: args.side === "top" ? 0 : 0,
                    borderRightWidth: args.side === "left" ? 0 : 0,
                  }}
                />
              )}
              <div className="flex space-x-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium">홍길동</h4>
                  <p className={`text-sm ${args.variant === "solid" ? "text-gray-300" : "text-gray-500"}`}>
                    제품 디자이너
                  </p>
                  <div className="mt-2 flex items-center text-sm">
                    <Mail className={`h-3.5 w-3.5 mr-1 ${args.variant === "solid" ? "text-gray-300" : "text-gray-500"}`} />
                    <span className={args.variant === "solid" ? "text-gray-300" : "text-gray-500"}>hong@example.com</span>
                  </div>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      </div>
    );
  },
  args: {
    defaultOpen: false,
    openDelay: 300,
    closeDelay: 300,
    side: "bottom",
    sideOffset: 5,
    align: "center",
    alignOffset: 0,
    avoidCollisions: true,
    collisionPadding: 10,
    arrowPadding: 5,
    sticky: "partial",
    hideWhenDetached: false,
    disableOutsidePointerEvents: false,
    variant: "default",
    size: "default",
    hasArrow: true,
    arrowSize: 8,
  },
};

// 스타일 변형 예제
export const StyleVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-8 justify-center items-center p-6">
      <div className="flex flex-col items-center gap-2">
        <span className="text-sm font-medium">기본 (Default)</span>
        <HoverCard>
          <HoverCardTrigger asChild>
            <button className="px-3 py-2 rounded border bg-white hover:bg-gray-50">
              Default
            </button>
          </HoverCardTrigger>
          <HoverCardContent className="p-4 bg-white border border-gray-200 shadow-md rounded-lg">
            <div className="text-sm">기본 스타일의 호버카드입니다.</div>
          </HoverCardContent>
        </HoverCard>
      </div>
      
      <div className="flex flex-col items-center gap-2">
        <span className="text-sm font-medium">아웃라인 (Outline)</span>
        <HoverCard>
          <HoverCardTrigger asChild>
            <button className="px-3 py-2 rounded border bg-white hover:bg-gray-50">
              Outline
            </button>
          </HoverCardTrigger>
          <HoverCardContent className="p-4 bg-white border-2 border-gray-300 rounded-lg">
            <div className="text-sm">아웃라인 스타일의 호버카드입니다.</div>
          </HoverCardContent>
        </HoverCard>
      </div>
      
      <div className="flex flex-col items-center gap-2">
        <span className="text-sm font-medium">솔리드 (Solid)</span>
        <HoverCard>
          <HoverCardTrigger asChild>
            <button className="px-3 py-2 rounded border bg-white hover:bg-gray-50">
              Solid
            </button>
          </HoverCardTrigger>
          <HoverCardContent className="p-4 bg-gray-800 text-white rounded-lg">
            <div className="text-sm">솔리드 스타일의 호버카드입니다.</div>
          </HoverCardContent>
        </HoverCard>
      </div>
      
      <div className="flex flex-col items-center gap-2">
        <span className="text-sm font-medium">플랫 (Flat)</span>
        <HoverCard>
          <HoverCardTrigger asChild>
            <button className="px-3 py-2 rounded border bg-white hover:bg-gray-50">
              Flat
            </button>
          </HoverCardTrigger>
          <HoverCardContent className="p-4 bg-gray-100 rounded-lg">
            <div className="text-sm">플랫 스타일의 호버카드입니다.</div>
          </HoverCardContent>
        </HoverCard>
      </div>
    </div>
  ),
};

// 크기 변형 예제
export const SizeVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-8 justify-center items-center p-6">
      <div className="flex flex-col items-center gap-2">
        <span className="text-sm font-medium">작은 크기 (Small)</span>
        <HoverCard>
          <HoverCardTrigger asChild>
            <button className="px-2 py-1 text-sm rounded border bg-white hover:bg-gray-50">
              Small
            </button>
          </HoverCardTrigger>
          <HoverCardContent className="p-2 bg-white border border-gray-200 shadow-md rounded-lg text-xs">
            <div className="flex items-center gap-2">
              <User className="h-3 w-3" />
              <span>작은 크기의 호버카드입니다.</span>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
      
      <div className="flex flex-col items-center gap-2">
        <span className="text-sm font-medium">기본 크기 (Default)</span>
        <HoverCard>
          <HoverCardTrigger asChild>
            <button className="px-3 py-2 rounded border bg-white hover:bg-gray-50">
              Default
            </button>
          </HoverCardTrigger>
          <HoverCardContent className="p-4 bg-white border border-gray-200 shadow-md rounded-lg">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>기본 크기의 호버카드입니다.</span>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
      
      <div className="flex flex-col items-center gap-2">
        <span className="text-sm font-medium">큰 크기 (Large)</span>
        <HoverCard>
          <HoverCardTrigger asChild>
            <button className="px-4 py-2 text-lg rounded border bg-white hover:bg-gray-50">
              Large
            </button>
          </HoverCardTrigger>
          <HoverCardContent className="p-5 bg-white border border-gray-200 shadow-md rounded-lg">
            <div className="flex items-center gap-3">
              <User className="h-6 w-6" />
              <span className="text-lg">큰 크기의 호버카드입니다.</span>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
    </div>
  ),
};

// 방향 및 정렬 예제
export const PositionVariants: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-6 p-10 h-[500px]">
      <div className="flex justify-center items-start">
        <HoverCard>
          <HoverCardTrigger asChild>
            <button className="px-3 py-2 rounded border bg-white hover:bg-gray-50">
              상단 (Top)
            </button>
          </HoverCardTrigger>
          <HoverCardContent side="top" className="p-3 bg-white border border-gray-200 shadow-md rounded-lg">
            <div className="text-sm">상단에 표시된 호버카드</div>
          </HoverCardContent>
        </HoverCard>
      </div>
      
      <div className="flex justify-center items-center">
        <HoverCard>
          <HoverCardTrigger asChild>
            <button className="px-3 py-2 rounded border bg-white hover:bg-gray-50">
              오른쪽 (Right)
            </button>
          </HoverCardTrigger>
          <HoverCardContent side="right" className="p-3 bg-white border border-gray-200 shadow-md rounded-lg">
            <div className="text-sm">오른쪽에 표시된 호버카드</div>
          </HoverCardContent>
        </HoverCard>
      </div>
      
      <div className="flex justify-center items-start">
        <HoverCard>
          <HoverCardTrigger asChild>
            <button className="px-3 py-2 rounded border bg-white hover:bg-gray-50">
              정렬: 시작 (Start)
            </button>
          </HoverCardTrigger>
          <HoverCardContent side="bottom" align="start" className="p-3 bg-white border border-gray-200 shadow-md rounded-lg">
            <div className="text-sm">시작 정렬된 호버카드</div>
          </HoverCardContent>
        </HoverCard>
      </div>
      
      <div className="flex justify-center items-end">
        <HoverCard>
          <HoverCardTrigger asChild>
            <button className="px-3 py-2 rounded border bg-white hover:bg-gray-50">
              하단 (Bottom)
            </button>
          </HoverCardTrigger>
          <HoverCardContent side="bottom" className="p-3 bg-white border border-gray-200 shadow-md rounded-lg">
            <div className="text-sm">하단에 표시된 호버카드</div>
          </HoverCardContent>
        </HoverCard>
      </div>
      
      <div className="flex justify-center items-center">
        <HoverCard>
          <HoverCardTrigger asChild>
            <button className="px-3 py-2 rounded border bg-white hover:bg-gray-50">
              왼쪽 (Left)
            </button>
          </HoverCardTrigger>
          <HoverCardContent side="left" className="p-3 bg-white border border-gray-200 shadow-md rounded-lg">
            <div className="text-sm">왼쪽에 표시된 호버카드</div>
          </HoverCardContent>
        </HoverCard>
      </div>
      
      <div className="flex justify-center items-end">
        <HoverCard>
          <HoverCardTrigger asChild>
            <button className="px-3 py-2 rounded border bg-white hover:bg-gray-50">
              정렬: 끝 (End)
            </button>
          </HoverCardTrigger>
          <HoverCardContent side="top" align="end" className="p-3 bg-white border border-gray-200 shadow-md rounded-lg">
            <div className="text-sm">끝 정렬된 호버카드</div>
          </HoverCardContent>
        </HoverCard>
      </div>
    </div>
  ),
};

// 실제 사용 사례 예제
export const RealWorldExamples: Story = {
  render: () => (
    <div className="flex flex-col gap-8 p-6">
      {/* 사용자 프로필 카드 */}
      <div className="flex justify-center p-4 border-b pb-6">
        <HoverCard openDelay={200} closeDelay={500}>
          <HoverCardTrigger asChild>
            <div className="flex items-center cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <span className="ml-2 font-medium">김민수</span>
            </div>
          </HoverCardTrigger>
          <HoverCardContent className="w-80 p-4 bg-white border border-gray-200 shadow-lg rounded-lg">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-lg">김민수</h4>
                <p className="text-sm text-gray-500">서울에 거주하는 소프트웨어 개발자</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center text-xs text-gray-500">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>서울, 대한민국</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>2022년 가입</span>
                  </div>
                </div>
                <div className="border-t mt-3 pt-3 flex justify-between">
                  <div className="text-center">
                    <div className="font-bold">128</div>
                    <div className="text-xs text-gray-500">게시물</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold">2.4K</div>
                    <div className="text-xs text-gray-500">팔로워</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold">567</div>
                    <div className="text-xs text-gray-500">팔로잉</div>
                  </div>
                </div>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
      
      {/* 제품 미리보기 카드 */}
      <div className="flex justify-center p-4 border-b pb-6">
        <HoverCard>
          <HoverCardTrigger asChild>
            <div className="text-blue-600 underline cursor-pointer">최신 스마트폰</div>
          </HoverCardTrigger>
          <HoverCardContent side="right" className="w-72 p-0 overflow-hidden bg-white border border-gray-200 shadow-lg rounded-lg">
            <div className="bg-gray-100 h-36 flex items-center justify-center">
              <Image className="h-8 w-8 text-gray-400" />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start">
                <h4 className="font-medium">갤럭시 S23 울트라</h4>
                <div className="font-bold text-green-600">₩1,599,000</div>
              </div>
              <p className="text-sm text-gray-500 mt-1">최신 프로세서와 2억 화소 카메라가 탑재된 플래그십 스마트폰</p>
              <div className="flex gap-2 mt-3">
                <div className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">새 제품</div>
                <div className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">무료 배송</div>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
      
      {/* 용어 설명 카드 */}
      <div className="flex justify-center p-4 border-b pb-6">
        <p className="text-gray-700 max-w-md">
          <span>
            인공지능(AI)
          </span>{" "}
          기술은 현대 소프트웨어 개발에서 중요한 역할을 합니다.{" "}
          <HoverCard>
            <HoverCardTrigger asChild>
              <span className="text-blue-600 border-b border-dashed border-blue-600 cursor-help">머신러닝</span>
            </HoverCardTrigger>
            <HoverCardContent side="top" className="w-80 p-4 bg-white border border-gray-200 shadow-lg rounded-lg">
              <h4 className="flex items-center font-medium">
                <Book className="h-4 w-4 mr-2 text-blue-600" />
                머신러닝 (Machine Learning)
              </h4>
              <p className="text-sm text-gray-600 mt-2">
                컴퓨터 시스템이 명시적인 프로그래밍 없이 데이터와 경험으로부터 학습하고 개선할 수 있게 하는 
                인공지능의 한 분야입니다. 패턴 인식과 계산 학습 이론을 연구합니다.
              </p>
              <div className="mt-3 text-xs text-blue-600">
                더 자세히 알아보기 →
              </div>
            </HoverCardContent>
          </HoverCard>{" "}
          과 딥러닝은 데이터 기반 의사결정을 가능하게 합니다.
        </p>
      </div>
      
      {/* 소셜 미디어 카드 */}
      <div className="flex justify-center p-4">
        <div className="max-w-md border rounded-lg p-4 bg-white">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <User className="h-5 w-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center">
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <span className="font-medium cursor-pointer hover:underline">박지연</span>
                  </HoverCardTrigger>
                  <HoverCardContent side="right" className="w-72 p-4 bg-white border border-gray-200 shadow-lg rounded-lg">
                    <div className="flex gap-3">
                      <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center">
                        <User className="h-8 w-8 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-bold">박지연</h4>
                        <p className="text-sm text-gray-500">UX/UI 디자이너</p>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <Briefcase className="h-3 w-3 mr-1" />
                          <span>디자인 스튜디오 근무</span>
                        </div>
                        <div className="mt-3 flex gap-2">
                          <button className="px-3 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700">
                            팔로우
                          </button>
                          <button className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50">
                            메시지
                          </button>
                        </div>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
                <span className="text-gray-500 text-sm ml-2">· 3시간 전</span>
              </div>
              <p className="text-gray-700 mt-2">
                오늘 새로운 디자인 시스템 작업을 완료했습니다! 피드백 부탁드려요 :)
              </p>
              <div className="mt-3 flex gap-3 text-gray-500">
                <button className="flex items-center gap-1 hover:text-red-500">
                  <Heart className="h-4 w-4" />
                  <span className="text-sm">좋아요</span>
                </button>
                <button className="flex items-center gap-1 hover:text-blue-500">
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-sm">댓글</span>
                </button>
                <button className="flex items-center gap-1 hover:text-green-500">
                  <Share className="h-4 w-4" />
                  <span className="text-sm">공유</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

// 지연 시간 비교 예제
export const DelayComparison: Story = {
  render: () => (
    <div className="flex justify-center gap-8 p-6">
      <div className="flex flex-col items-center gap-2">
        <span className="text-sm font-medium">즉시 (No Delay)</span>
        <HoverCard openDelay={0} closeDelay={0}>
          <HoverCardTrigger asChild>
            <button className="px-3 py-2 rounded border bg-white hover:bg-gray-50">
              즉시 표시
            </button>
          </HoverCardTrigger>
          <HoverCardContent className="p-3 bg-white border border-gray-200 shadow-md rounded-lg">
            <div className="text-sm">지연 없이 즉시 표시됩니다.</div>
          </HoverCardContent>
        </HoverCard>
      </div>
      
      <div className="flex flex-col items-center gap-2">
        <span className="text-sm font-medium">짧은 지연 (300ms)</span>
        <HoverCard openDelay={300} closeDelay={300}>
          <HoverCardTrigger asChild>
            <button className="px-3 py-2 rounded border bg-white hover:bg-gray-50">
              짧은 지연
            </button>
          </HoverCardTrigger>
          <HoverCardContent className="p-3 bg-white border border-gray-200 shadow-md rounded-lg">
            <div className="text-sm">300ms 후에 표시됩니다.</div>
          </HoverCardContent>
        </HoverCard>
      </div>

      <div className="flex flex-col items-center gap-2">
        <span className="text-sm font-medium">긴 지연 (1000ms)</span>
        <HoverCard openDelay={1000} closeDelay={500}>
          <HoverCardTrigger asChild>
            <button className="px-3 py-2 rounded border bg-white hover:bg-gray-50">
              긴 지연
            </button>
          </HoverCardTrigger>
          <HoverCardContent className="p-3 bg-white border border-gray-200 shadow-md rounded-lg">
            <div className="text-sm">1초 후에 표시되고, 0.5초 후에 닫힙니다.</div>
          </HoverCardContent>
        </HoverCard>
      </div>
    </div>
  ),
};

export const CustomStyles: Story = {
  render: () => (
    <div className="flex flex-wrap gap-8 justify-center items-center p-6">
      <div className="flex flex-col items-center gap-2">
        <span className="text-sm font-medium">브랜드 테마</span>
        <HoverCard>
          <HoverCardTrigger asChild>
            <button className="px-3 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700">
              브랜드 스타일
            </button>
          </HoverCardTrigger>
          <HoverCardContent className="p-4 bg-indigo-700 text-white border border-indigo-800 shadow-lg rounded-lg">
            <div className="text-sm">인디고 테마의 호버카드입니다.</div>
          </HoverCardContent>
        </HoverCard>
      </div>

      <div className="flex flex-col items-center gap-2">
        <span className="text-sm font-medium">경고 테마</span>
        <HoverCard>
          <HoverCardTrigger asChild>
            <button className="px-3 py-2 rounded bg-amber-500 text-white hover:bg-amber-600">
              경고 스타일
            </button>
          </HoverCardTrigger>
          <HoverCardContent className="p-4 bg-amber-50 border-2 border-amber-500 text-amber-800 shadow-md rounded-lg">
            <div className="flex items-start gap-2">
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mt-0.5 text-amber-600"
              >
                <path
                  d="M7.5 0C3.36 0 0 3.36 0 7.5C0 11.64 3.36 15 7.5 15C11.64 15 15 11.64 15 7.5C15 3.36 11.64 0 7.5 0ZM6.75 3.75C6.75 3.33579 7.08579 3 7.5 3C7.91421 3 8.25 3.33579 8.25 3.75V8.25C8.25 8.66421 7.91421 9 7.5 9C7.08579 9 6.75 8.66421 6.75 8.25V3.75ZM8.25 11.25C8.25 11.6642 7.91421 12 7.5 12C7.08579 12 6.75 11.6642 6.75 11.25C6.75 10.8358 7.08579 10.5 7.5 10.5C7.91421 10.5 8.25 10.8358 8.25 11.25Z"
                  fill="currentColor"
                />
              </svg>
              <div className="text-sm">주의가 필요한 정보입니다.</div>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>

      <div className="flex flex-col items-center gap-2">
        <span className="text-sm font-medium">유리 효과</span>
        <HoverCard>
          <HoverCardTrigger asChild>
            <button className="px-3 py-2 rounded bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              유리 효과
            </button>
          </HoverCardTrigger>
          <HoverCardContent className="p-4 backdrop-blur-sm bg-white/70 border border-white/20 shadow-lg rounded-lg">
            <div className="text-sm">반투명 배경의 호버카드입니다.</div>
          </HoverCardContent>
        </HoverCard>
      </div>

      <div className="flex flex-col items-center gap-2">
        <span className="text-sm font-medium">다크 테마</span>
        <HoverCard>
          <HoverCardTrigger asChild>
            <button className="px-3 py-2 rounded bg-gray-800 text-white hover:bg-gray-700">
              다크 테마
            </button>
          </HoverCardTrigger>
          <HoverCardContent className="p-4 bg-gray-900 text-gray-100 border border-gray-700 shadow-lg rounded-lg">
            <div className="text-sm">다크 테마의 호버카드입니다.</div>
          </HoverCardContent>
        </HoverCard>
      </div>
    </div>
  ),
};
