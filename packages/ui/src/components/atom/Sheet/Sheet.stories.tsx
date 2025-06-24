import type { Meta, StoryObj } from "@storybook/react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "./Sheet";
import { useState, useEffect } from "react";
import { X, Menu, Settings, User, Bell, HelpCircle, Info, Check, Save, Home } from "lucide-react";

type SheetProps = {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  modal?: boolean;
  side?: "top" | "right" | "bottom" | "left";
  size?: "sm" | "default" | "lg" | "xl" | "full";
  overlayClassName?: string;
  closeOnClickOutside?: boolean;
  closeOnEsc?: boolean;
  showCloseButton?: boolean;
  preventScroll?: boolean;
  className?: string;
};

const meta: Meta<SheetProps> = {
  title: "ATOM/Sheet",
  component: Sheet,
  tags: ["autodocs"],
  argTypes: {
    defaultOpen: {
      control: "boolean",
      description: "시트의 초기 상태 (열림/닫힘)",
      defaultValue: false,
    },
    open: {
      control: "boolean",
      description: "시트의 현재 상태 (제어 컴포넌트로 사용 시)",
      defaultValue: undefined,
    },
    modal: {
      control: "boolean",
      description: "모달 모드 활성화 여부",
      defaultValue: true,
    },
    side: {
      control: "select",
      options: ["top", "right", "bottom", "left"],
      description: "시트가 나타날 방향",
      defaultValue: "right",
    },
    closeOnClickOutside: {
      control: "boolean",
      description: "바깥 영역 클릭 시 닫기 여부",
      defaultValue: true,
    },
    closeOnEsc: {
      control: "boolean",
      description: "ESC 키 누를 때 닫기 여부",
      defaultValue: true,
    },
    showCloseButton: {
      control: "boolean",
      description: "닫기 버튼 표시 여부",
      defaultValue: true,
    },
    preventScroll: {
      control: "boolean",
      description: "시트 열릴 때 배경 스크롤 방지",
      defaultValue: true,
    },
    className: {
      control: "text",
      description: "커스텀 CSS 클래스",
    },
    overlayClassName: {
      control: "text",
      description: "오버레이 요소의 커스텀 CSS 클래스",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const AllOptions: Story = {
  render: (args) => {
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
    
    return (
      <div className="flex flex-col gap-4">
        <Sheet
          open={isOpen}
          onOpenChange={handleOpenChange}
          modal={args.modal}
        >
          <SheetTrigger asChild>
            <button className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors">
              {isOpen ? "닫기" : `${args.side} 시트 열기`}
            </button>
          </SheetTrigger>
          <SheetContent 
            side={args.side}
            className={args.className}
            overlayClassName={args.overlayClassName}
            closeOnClickOutside={args.closeOnClickOutside}
            closeOnEsc={args.closeOnEsc}
            showCloseButton={args.showCloseButton}
            preventScroll={args.preventScroll}
          >
            <SheetHeader>
              <SheetTitle>시트 제목</SheetTitle>
              <SheetDescription>
                이 시트는 {args.side} 방향에서 나타납니다. 크기: {args.size}
              </SheetDescription>
            </SheetHeader>
            <div className="py-6">
              <p className="text-sm text-gray-600 mb-4">
                시트 내용입니다. 다양한 옵션들을 조합하여 테스트할 수 있습니다.
              </p>
              <div className="space-y-2">
                <p className="text-sm"><strong>현재 설정:</strong></p>
                <ul className="text-xs space-y-1 text-gray-500">
                  <li>방향: {args.side}</li>
                  <li>크기: {args.size}</li>
                  <li>모달 모드: {args.modal ? "활성화" : "비활성화"}</li>
                  <li>바깥 클릭 시 닫기: {args.closeOnClickOutside ? "활성화" : "비활성화"}</li>
                  <li>ESC 키로 닫기: {args.closeOnEsc ? "활성화" : "비활성화"}</li>
                  <li>닫기 버튼: {args.showCloseButton ? "표시" : "숨김"}</li>
                  <li>스크롤 방지: {args.preventScroll ? "활성화" : "비활성화"}</li>
                </ul>
              </div>
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <button className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors">
                  닫기
                </button>
              </SheetClose>
              <button className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                확인
              </button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
        
        <div className="mt-4 p-4 bg-gray-100 rounded-md">
          <h3 className="text-sm font-medium mb-2">시트 상태 및 동작</h3>
          <p className="text-xs text-gray-600">
            현재 상태: <span className="font-mono">{isOpen ? "열림" : "닫힘"}</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">
            옵션을 변경하면 시트의 동작과 모양이 바뀝니다. 시트를 열고 각 옵션의 효과를 확인해보세요.
          </p>
        </div>
      </div>
    );
  },
  args: {
    defaultOpen: false,
    modal: true,
    side: "right",
    size: "default",
    closeOnClickOutside: true,
    closeOnEsc: true,
    showCloseButton: true,
    preventScroll: true,
  },
};

export const Positions: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-4 border rounded">
        <Sheet>
          <SheetTrigger asChild>
            <button className="px-4 py-2 rounded bg-blue-600 text-white">
              오른쪽 시트
            </button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>오른쪽 시트</SheetTitle>
              <SheetDescription>
                오른쪽에서 슬라이드되어 나타납니다.
              </SheetDescription>
            </SheetHeader>
            <div className="py-4">
              <p className="text-sm">오른쪽 시트의 내용입니다.</p>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      
      <div className="p-4 border rounded">
        <Sheet>
          <SheetTrigger asChild>
            <button className="px-4 py-2 rounded bg-green-600 text-white">
              왼쪽 시트
            </button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>왼쪽 시트</SheetTitle>
              <SheetDescription>
                왼쪽에서 슬라이드되어 나타납니다.
              </SheetDescription>
            </SheetHeader>
            <div className="py-4">
              <p className="text-sm">왼쪽 시트의 내용입니다.</p>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      
      <div className="p-4 border rounded">
        <Sheet>
          <SheetTrigger asChild>
            <button className="px-4 py-2 rounded bg-amber-600 text-white">
              상단 시트
            </button>
          </SheetTrigger>
          <SheetContent side="top">
            <SheetHeader>
              <SheetTitle>상단 시트</SheetTitle>
              <SheetDescription>
                상단에서 슬라이드되어 나타납니다.
              </SheetDescription>
            </SheetHeader>
            <div className="py-4">
              <p className="text-sm">상단 시트의 내용입니다.</p>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      
      <div className="p-4 border rounded">
        <Sheet>
          <SheetTrigger asChild>
            <button className="px-4 py-2 rounded bg-purple-600 text-white">
              하단 시트
            </button>
          </SheetTrigger>
          <SheetContent side="bottom">
            <SheetHeader>
              <SheetTitle>하단 시트</SheetTitle>
              <SheetDescription>
                하단에서 슬라이드되어 나타납니다.
              </SheetDescription>
            </SheetHeader>
            <div className="py-4">
              <p className="text-sm">하단 시트의 내용입니다.</p>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  ),
};

export const ContentTemplates: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="p-4 border rounded">
        <Sheet>
          <SheetTrigger asChild>
            <button className="px-4 py-2 rounded bg-blue-600 text-white flex items-center">
              <User className="h-4 w-4 mr-2" />
              프로필 설정
            </button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>사용자 프로필</SheetTitle>
              <SheetDescription>
                프로필 정보를 확인하고 수정하세요.
              </SheetDescription>
            </SheetHeader>
            <div className="py-6 space-y-6">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                <div className="ml-4">
                  <h4 className="font-medium">홍길동</h4>
                  <p className="text-sm text-gray-500">user@example.com</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">이름</label>
                  <input type="text" defaultValue="홍길동" className="w-full px-3 py-2 border rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">이메일</label>
                  <input type="email" defaultValue="user@example.com" className="w-full px-3 py-2 border rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">전화번호</label>
                  <input type="tel" defaultValue="010-1234-5678" className="w-full px-3 py-2 border rounded" />
                </div>
              </div>
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <button className="px-4 py-2 rounded bg-gray-200 text-gray-800">
                  취소
                </button>
              </SheetClose>
              <SheetClose asChild>
                <button className="px-4 py-2 rounded bg-blue-600 text-white flex items-center">
                  <Save className="h-4 w-4 mr-2" />
                  저장
                </button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
      <div className="p-4 border rounded">
        <Sheet>
          <SheetTrigger asChild>
            <button className="px-4 py-2 rounded bg-gray-800 text-white flex items-center">
              <Settings className="h-4 w-4 mr-2" />
              앱 설정
            </button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>설정</SheetTitle>
              <SheetDescription>
                애플리케이션 설정을 관리합니다.
              </SheetDescription>
            </SheetHeader>
            <div className="py-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">다크 모드</h4>
                    <p className="text-xs text-gray-500">어두운 테마로 전환합니다.</p>
                  </div>
                  <div className="h-6 w-11 bg-gray-200 rounded-full relative">
                    <div className="h-4 w-4 bg-white rounded-full absolute top-1 left-1"></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">알림</h4>
                    <p className="text-xs text-gray-500">푸시 알림을 활성화합니다.</p>
                  </div>
                  <div className="h-6 w-11 bg-blue-600 rounded-full relative">
                    <div className="h-4 w-4 bg-white rounded-full absolute top-1 right-1"></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">자동 업데이트</h4>
                    <p className="text-xs text-gray-500">앱 업데이트를 자동으로 설치합니다.</p>
                  </div>
                  <div className="h-6 w-11 bg-blue-600 rounded-full relative">
                    <div className="h-4 w-4 bg-white rounded-full absolute top-1 right-1"></div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <h4 className="text-sm font-medium mb-2">언어</h4>
                  <select className="w-full px-3 py-2 border rounded">
                    <option>한국어</option>
                    <option>English</option>
                    <option>日本語</option>
                    <option>中文</option>
                  </select>
                </div>
              </div>
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <button className="px-4 py-2 rounded bg-blue-600 text-white w-full">
                  저장
                </button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
      <div className="p-4 border rounded">
        <Sheet>
          <SheetTrigger asChild>
            <button className="px-4 py-2 rounded bg-amber-600 text-white flex items-center">
              <Bell className="h-4 w-4 mr-2" />
              알림 목록
            </button>
          </SheetTrigger>
          <SheetContent side="top">
            <SheetHeader>
              <SheetTitle>알림</SheetTitle>
              <SheetDescription>
                최근 알림 목록
              </SheetDescription>
            </SheetHeader>
            <div className="py-4">
              <div className="space-y-3">
                {[
                  { icon: <Info className="h-4 w-4 text-blue-500" />, title: "시스템 업데이트", desc: "새로운 버전이 설치되었습니다.", time: "방금 전" },
                  { icon: <Bell className="h-4 w-4 text-amber-500" />, title: "새 메시지", desc: "3개의 새 메시지가 있습니다.", time: "5분 전" },
                  { icon: <Check className="h-4 w-4 text-green-500" />, title: "작업 완료", desc: "파일 업로드가 완료되었습니다.", time: "30분 전" },
                  { icon: <HelpCircle className="h-4 w-4 text-purple-500" />, title: "지원 요청", desc: "새로운 지원 요청이 등록되었습니다.", time: "2시간 전" },
                ].map((notification, idx) => (
                  <div key={idx} className="flex p-3 border rounded hover:bg-gray-50">
                    <div className="flex-shrink-0">
                      {notification.icon}
                    </div>
                    <div className="ml-3 flex-grow">
                      <h4 className="text-sm font-medium">{notification.title}</h4>
                      <p className="text-xs text-gray-500">{notification.desc}</p>
                    </div>
                    <div className="text-xs text-gray-400">
                      {notification.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <button className="px-4 py-2 rounded bg-gray-200 text-gray-800">
                  닫기
                </button>
              </SheetClose>
              <button className="px-4 py-2 rounded bg-gray-800 text-white">
                모두 읽음 표시
              </button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
      <div className="p-4 border rounded">
        <Sheet>
          <SheetTrigger asChild>
            <button className="px-4 py-2 rounded bg-indigo-600 text-white flex items-center">
              <Menu className="h-4 w-4 mr-2" />
              모바일 메뉴
            </button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>메뉴</SheetTitle>
            </SheetHeader>
            <div className="py-4">
              <nav className="space-y-1">
                {[
                  { icon: <Home className="h-4 w-4" />, name: "홈" },
                  { icon: <User className="h-4 w-4" />, name: "프로필" },
                  { icon: <Bell className="h-4 w-4" />, name: "알림" },
                  { icon: <Settings className="h-4 w-4" />, name: "설정" },
                  { icon: <HelpCircle className="h-4 w-4" />, name: "도움말" },
                ].map((item, idx) => (
                  <a 
                    key={idx}
                    href="#"
                    className={`flex items-center px-3 py-2 text-sm rounded-md ${
                      idx === 0 ? "bg-indigo-50 text-indigo-600" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.name}</span>
                  </a>
                ))}
              </nav>
            </div>
            <div className="mt-auto pt-4 border-t">
              <SheetClose asChild>
                <button className="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md">
                  <X className="h-4 w-4 mr-3" />
                  로그아웃
                </button>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  ),
};

export const NestedSheets: Story = {
  render: () => (
    <div className="p-4 border rounded">
      <Sheet>
        <SheetTrigger asChild>
          <button className="px-4 py-2 rounded bg-purple-600 text-white">
            첫 번째 시트 열기
          </button>
        </SheetTrigger>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>첫 번째 시트</SheetTitle>
            <SheetDescription>
              중첩된 시트 예제입니다.
            </SheetDescription>
          </SheetHeader>
          <div className="py-6">
            <p className="text-sm mb-4">
              첫 번째 시트의 내용입니다. 아래 버튼을 클릭하여 두 번째 시트를 열 수 있습니다.
            </p>
            
            <Sheet>
              <SheetTrigger asChild>
                <button className="px-4 py-2 rounded bg-blue-600 text-white">
                  두 번째 시트 열기
                </button>
              </SheetTrigger>
              <SheetContent side="bottom">
                <SheetHeader>
                  <SheetTitle>두 번째 시트</SheetTitle>
                  <SheetDescription>
                    첫 번째 시트 위에 열린 시트입니다.
                  </SheetDescription>
                </SheetHeader>
                <div className="py-6">
                  <p className="text-sm">
                    중첩된 시트를 사용하면 복잡한 UI 흐름을 구현할 수 있습니다.
                    첫 번째 시트를 닫지 않고도 추가 정보를 표시할 수 있습니다.
                  </p>
                </div>
                <SheetFooter>
                  <SheetClose asChild>
                    <button className="px-4 py-2 rounded bg-gray-200 text-gray-800">
                      두 번째 시트 닫기
                    </button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <button className="px-4 py-2 rounded bg-gray-200 text-gray-800">
                첫 번째 시트 닫기
              </button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  ),
};

export const ControlledSheet: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    const [history, setHistory] = useState<string[]>([]);
    
    const openSheet = () => {
      setIsOpen(true);
      setHistory(prev => [...prev, `시트 열림: ${new Date().toLocaleTimeString()}`]);
    };
    
    const closeSheet = () => {
      setIsOpen(false);
      setHistory(prev => [...prev, `시트 닫힘: ${new Date().toLocaleTimeString()}`]);
    };
    
    return (
      <div className="space-y-4">
        <div className="p-4 border rounded flex gap-4">
          <button 
            onClick={openSheet} 
            className="px-4 py-2 rounded bg-green-600 text-white"
          >
            시트 열기
          </button>
          
          <button 
            onClick={closeSheet}
            className="px-4 py-2 rounded bg-red-600 text-white"
          >
            시트 닫기
          </button>
        </div>
        
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>제어되는 시트</SheetTitle>
              <SheetDescription>
                외부 상태에 의해 제어되는 시트입니다.
              </SheetDescription>
            </SheetHeader>
            <div className="py-6">
              <p className="text-sm">
                이 시트는 외부 버튼을 통해 열리고 닫힙니다.
                시트의 상태는 컴포넌트 외부에서 관리됩니다.
              </p>
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <button className="px-4 py-2 rounded bg-gray-200 text-gray-800">
                  닫기
                </button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
        
        <div>
          <h4 className="text-sm font-medium">상태 변화 기록</h4>
          <ul className="text-xs text-gray-500 space-y-1">
            {history.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  },
};