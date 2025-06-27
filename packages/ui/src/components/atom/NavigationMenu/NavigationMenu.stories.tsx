import type { Meta, StoryObj } from "@storybook/react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
} from "./NavigationMenu";
import { useState, useEffect } from "react";
import {
  Home,
  User,
  Settings,
  Package,
  ShoppingCart,
  FileText,
  HelpCircle,
  Info,
  Mail,
  Calendar,
  Image,
  Music,
  Video,
  Bookmark,
  Heart, Star
} from "lucide-react";

type NavigationMenuProps = {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  delayDuration?: number;
  skipDelayDuration?: number;
  dir?: "ltr" | "rtl";
  orientation?: "horizontal" | "vertical";
  viewport?: boolean;
  viewportPosition?: "top" | "right" | "bottom" | "left" | "center";
  unstyled?: boolean;
  className?: string;
  activeClass?: string;
  variant?: "default" | "subtle" | "outline" | "filled";
  size?: "sm" | "default" | "lg";
};

const meta: Meta<NavigationMenuProps> = {
  title: "ATOM/NavigationMenu",
  component: NavigationMenu,
  tags: ["autodocs"],
  argTypes: {
    defaultValue: {
      control: "text",
      description: "처음 선택된 아이템의 값",
      defaultValue: "home",
    },
    value: {
      control: "text",
      description: "제어 컴포넌트로 사용 시 현재 선택된 아이템의 값",
    },
    delayDuration: {
      control: { type: "number", min: 0, max: 1000, step: 10 },
      description: "메뉴 표시/숨김 딜레이 시간(ms)",
      defaultValue: 200,
    },
    skipDelayDuration: {
      control: { type: "number", min: 0, max: 1000, step: 10 },
      description: "빠른 이동 시 딜레이를 건너뛰는 시간(ms)",
      defaultValue: 300,
    },
    dir: {
      control: "radio",
      options: ["ltr", "rtl"],
      description: "텍스트 방향",
      defaultValue: "ltr",
    },
    orientation: {
      control: "radio",
      options: ["horizontal", "vertical"],
      description: "메뉴 방향",
      defaultValue: "horizontal",
    },
    viewport: {
      control: "boolean",
      description: "뷰포트 사용 여부",
      defaultValue: true,
    },
    viewportPosition: {
      control: "select",
      options: ["top", "right", "bottom", "left", "center"],
      description: "뷰포트 위치",
      defaultValue: "bottom",
      if: { arg: "viewport", truthy: true }
    },
    unstyled: {
      control: "boolean",
      description: "기본 스타일 적용 여부",
      defaultValue: false,
    },
    variant: {
      control: "select",
      options: ["default", "subtle", "outline", "filled"],
      description: "네비게이션 메뉴 변형",
      defaultValue: "default",
    },
    size: {
      control: "select",
      options: ["sm", "default", "lg"],
      description: "네비게이션 메뉴 크기",
      defaultValue: "default",
    },
    className: {
      control: "text",
      description: "커스텀 CSS 클래스",
    },
    activeClass: {
      control: "text",
      description: "활성화된 아이템의 CSS 클래스",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;
export const AllOptions: Story = {
  render: function Render(args) {
    const [activeItem, setActiveItem] = useState(args.defaultValue || "home");
    
    useEffect(() => {
      if (args.value !== undefined) {
        setActiveItem(args.value);
      }
    }, [args.value]);
    
    const handleValueChange = (value: string) => {
      setActiveItem(value);
      if (args.onValueChange) {
        args.onValueChange(value);
      }
    };
    const orientationClass = args.orientation === "vertical" 
      ? "flex-col items-start" 
      : "flex-row items-center";
    const getVariantClass = () => {
      if (args.unstyled) return "";
      
      switch (args.variant) {
        case "subtle":
          return "bg-transparent border-transparent";
        case "outline":
          return "bg-transparent border border-gray-200";
        case "filled":
          return "bg-gray-100 border-transparent";
        default:
          return "bg-white border border-gray-200";
      }
    };
    const getSizeClass = () => {
      if (args.unstyled) return "";
      
      switch (args.size) {
        case "sm":
          return "p-1 text-sm";
        case "lg":
          return "p-3 text-lg";
        default:
          return "p-2";
      }
    };
    
    const variantClass = getVariantClass();
    const sizeClass = getSizeClass();
    
    return (
      <div className="space-y-8">
        <div className={`${args.orientation === "vertical" ? "h-[400px]" : "h-auto"} w-full`}>
          <NavigationMenu
            value={activeItem}
            onValueChange={handleValueChange}
            delayDuration={args.delayDuration}
            skipDelayDuration={args.skipDelayDuration}
            dir={args.dir}
            orientation={args.orientation}
            className={`${args.className || ""} ${args.unstyled ? "" : "shadow-sm rounded-lg"} ${variantClass}`}
          >
            <NavigationMenuList className={orientationClass}>
              <NavigationMenuItem value="home">
                <NavigationMenuTrigger className={sizeClass}>
                  <Home className="mr-2 h-4 w-4" />
                  홈
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="p-4 w-64 md:w-[400px] lg:w-[500px]">
                    <h3 className="text-lg font-medium mb-2">홈</h3>
                    <p className="text-sm text-gray-500 mb-4">시작 페이지와 주요 기능을 확인하세요.</p>
                    <div className="grid grid-cols-2 gap-3">
                      <NavigationMenuLink
                        href="#dashboard"
                        className="flex items-center p-2 rounded hover:bg-gray-100"
                      >
                        <div className="bg-blue-100 p-2 rounded mr-2">
                          <Home className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">대시보드</div>
                          <div className="text-xs text-gray-500">주요 정보 한눈에 보기</div>
                        </div>
                      </NavigationMenuLink>
                      <NavigationMenuLink
                        href="#recent"
                        className="flex items-center p-2 rounded hover:bg-gray-100"
                      >
                        <div className="bg-green-100 p-2 rounded mr-2">
                          <Calendar className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <div className="font-medium">최근 활동</div>
                          <div className="text-xs text-gray-500">최근 작업 기록</div>
                        </div>
                      </NavigationMenuLink>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              
              <NavigationMenuItem value="products">
                <NavigationMenuTrigger className={sizeClass}>
                  <Package className="mr-2 h-4 w-4" />
                  제품
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="p-4 w-64 md:w-[400px] lg:w-[500px]">
                    <h3 className="text-lg font-medium mb-2">제품 카테고리</h3>
                    <p className="text-sm text-gray-500 mb-4">다양한 제품을 살펴보세요.</p>
                    <div className="grid grid-cols-2 gap-3">
                      <NavigationMenuLink
                        href="#electronics"
                        className="flex items-center p-2 rounded hover:bg-gray-100"
                      >
                        <div className="bg-purple-100 p-2 rounded mr-2">
                          <ShoppingCart className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                          <div className="font-medium">전자기기</div>
                          <div className="text-xs text-gray-500">스마트폰, 태블릿 등</div>
                        </div>
                      </NavigationMenuLink>
                      <NavigationMenuLink
                        href="#clothing"
                        className="flex items-center p-2 rounded hover:bg-gray-100"
                      >
                        <div className="bg-amber-100 p-2 rounded mr-2">
                          <ShoppingCart className="h-4 w-4 text-amber-600" />
                        </div>
                        <div>
                          <div className="font-medium">의류</div>
                          <div className="text-xs text-gray-500">남성, 여성, 아동복</div>
                        </div>
                      </NavigationMenuLink>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              
              <NavigationMenuItem value="services">
                <NavigationMenuTrigger className={sizeClass}>
                  <Settings className="mr-2 h-4 w-4" />
                  서비스
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="p-4 w-64 md:w-[400px] lg:w-[500px]">
                    <h3 className="text-lg font-medium mb-2">서비스 안내</h3>
                    <p className="text-sm text-gray-500 mb-4">다양한 서비스를 이용해보세요.</p>
                    <div className="grid grid-cols-2 gap-3">
                      <NavigationMenuLink
                        href="#consulting"
                        className="flex items-center p-2 rounded hover:bg-gray-100"
                      >
                        <div className="bg-teal-100 p-2 rounded mr-2">
                          <FileText className="h-4 w-4 text-teal-600" />
                        </div>
                        <div>
                          <div className="font-medium">컨설팅</div>
                          <div className="text-xs text-gray-500">전문 컨설팅 서비스</div>
                        </div>
                      </NavigationMenuLink>
                      <NavigationMenuLink
                        href="#support"
                        className="flex items-center p-2 rounded hover:bg-gray-100"
                      >
                        <div className="bg-red-100 p-2 rounded mr-2">
                          <HelpCircle className="h-4 w-4 text-red-600" />
                        </div>
                        <div>
                          <div className="font-medium">기술 지원</div>
                          <div className="text-xs text-gray-500">24/7 기술 지원</div>
                        </div>
                      </NavigationMenuLink>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              
              <NavigationMenuItem value="about">
                <NavigationMenuLink
                  href="#about"
                  className={`${sizeClass} flex items-center ${args.activeClass || ""}`}
                  active={activeItem === "about"}
                >
                  <Info className="mr-2 h-4 w-4" />
                  소개
                </NavigationMenuLink>
              </NavigationMenuItem>
              
              <NavigationMenuItem value="contact">
                <NavigationMenuLink
                  href="#contact"
                  className={`${sizeClass} flex items-center ${args.activeClass || ""}`}
                  active={activeItem === "contact"}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  문의하기
                </NavigationMenuLink>
              </NavigationMenuItem>
              
              {!args.unstyled && <NavigationMenuIndicator />}
            </NavigationMenuList>
            
            {args.viewport && <NavigationMenuViewport />}
          </NavigationMenu>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-md">
          <h3 className="text-lg font-medium mb-2">현재 설정</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="font-medium">활성 아이템:</span> {activeItem}
            </div>
            <div>
              <span className="font-medium">방향:</span> {args.orientation}
            </div>
            <div>
              <span className="font-medium">텍스트 방향:</span> {args.dir}
            </div>
            <div>
              <span className="font-medium">뷰포트:</span> {args.viewport ? "사용" : "사용 안 함"}
            </div>
            <div>
              <span className="font-medium">딜레이:</span> {args.delayDuration}ms
            </div>
            <div>
              <span className="font-medium">건너뛰기 딜레이:</span> {args.skipDelayDuration}ms
            </div>
            <div>
              <span className="font-medium">변형:</span> {args.variant}
            </div>
            <div>
              <span className="font-medium">크기:</span> {args.size}
            </div>
          </div>
        </div>
      </div>
    );
  },
  args: {
    defaultValue: "home",
    delayDuration: 200,
    skipDelayDuration: 300,
    dir: "ltr",
    orientation: "horizontal",
    viewport: true,
    viewportPosition: "bottom",
    unstyled: false,
    variant: "default",
    size: "default",
  },
};

export const VerticalOrientation: Story = {
  render: () => (
    <div className="h-[400px] flex">
      <NavigationMenu orientation="vertical" className="w-64">
        <NavigationMenuList className="flex-col items-start space-y-1 w-full">
          <NavigationMenuItem className="w-full">
            <NavigationMenuLink 
              href="#" 
              className="flex items-center p-2 w-full rounded hover:bg-gray-100"
              active
            >
              <Home className="mr-2 h-4 w-4" />
              홈
            </NavigationMenuLink>
          </NavigationMenuItem>
          
          <NavigationMenuItem className="w-full">
            <NavigationMenuTrigger className="flex items-center p-2 w-full justify-between rounded hover:bg-gray-100">
              <div className="flex items-center">
                <Package className="mr-2 h-4 w-4" />
                제품
              </div>
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="p-2 w-56 ml-2">
                <div className="space-y-1">
                  <NavigationMenuLink 
                    href="#" 
                    className="flex items-center p-2 rounded hover:bg-gray-100"
                  >
                    <div className="bg-purple-100 p-1 rounded mr-2">
                      <Image className="h-3 w-3 text-purple-600" />
                    </div>
                    이미지 제품
                  </NavigationMenuLink>
                  <NavigationMenuLink 
                    href="#" 
                    className="flex items-center p-2 rounded hover:bg-gray-100"
                  >
                    <div className="bg-amber-100 p-1 rounded mr-2">
                      <Video className="h-3 w-3 text-amber-600" />
                    </div>
                    비디오 제품
                  </NavigationMenuLink>
                  <NavigationMenuLink 
                    href="#" 
                    className="flex items-center p-2 rounded hover:bg-gray-100"
                  >
                    <div className="bg-blue-100 p-1 rounded mr-2">
                      <Music className="h-3 w-3 text-blue-600" />
                    </div>
                    음악 제품
                  </NavigationMenuLink>
                </div>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
          
          <NavigationMenuItem className="w-full">
            <NavigationMenuTrigger className="flex items-center p-2 w-full justify-between rounded hover:bg-gray-100">
              <div className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                사용자
              </div>
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="p-2 w-56 ml-2">
                <div className="space-y-1">
                  <NavigationMenuLink 
                    href="#" 
                    className="flex items-center p-2 rounded hover:bg-gray-100"
                  >
                    프로필
                  </NavigationMenuLink>
                  <NavigationMenuLink 
                    href="#" 
                    className="flex items-center p-2 rounded hover:bg-gray-100"
                  >
                    계정 설정
                  </NavigationMenuLink>
                  <NavigationMenuLink 
                    href="#" 
                    className="flex items-center p-2 rounded hover:bg-gray-100"
                  >
                    로그아웃
                  </NavigationMenuLink>
                </div>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
          
          <NavigationMenuItem className="w-full">
            <NavigationMenuLink 
              href="#" 
              className="flex items-center p-2 w-full rounded hover:bg-gray-100"
            >
              <Settings className="mr-2 h-4 w-4" />
              설정
            </NavigationMenuLink>
          </NavigationMenuItem>
          
          <NavigationMenuItem className="w-full">
            <NavigationMenuLink 
              href="#" 
              className="flex items-center p-2 w-full rounded hover:bg-gray-100"
            >
              <HelpCircle className="mr-2 h-4 w-4" />
              도움말
            </NavigationMenuLink>
          </NavigationMenuItem>
          
          <NavigationMenuItem className="w-full">
            <NavigationMenuLink 
              href="#" 
              className="flex items-center p-2 w-full rounded hover:bg-gray-100"
            >
              <Info className="mr-2 h-4 w-4" />
              정보
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      
      <div className="flex-1 p-6 bg-gray-50">
        <h2 className="text-xl font-medium mb-4">수직 네비게이션 메뉴</h2>
        <p className="text-gray-600">
          수직 방향 메뉴는 대개 웹사이트의 사이드바에 사용됩니다. 이 예제에서는 수직 방향으로 메뉴가 배치되어 있으며,
          드롭다운 콘텐츠는 오른쪽에 표시됩니다.
        </p>
      </div>
    </div>
  ),
};

export const RtlDirection: Story = {
  render: () => (
    <div className="w-full flex justify-center" dir="rtl">
      <NavigationMenu dir="rtl">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink href="#" className="flex items-center px-3 py-2">
              <Home className="ml-2 h-4 w-4" />
              홈
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="flex items-center px-3 py-2">
              <User className="ml-2 h-4 w-4" />
              사용자
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="p-4 w-48">
                <p className="text-right">사용자 메뉴 내용</p>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="#" className="flex items-center px-3 py-2">
              <Settings className="ml-2 h-4 w-4" />
              설정
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuIndicator />
        </NavigationMenuList>
        <NavigationMenuViewport />
      </NavigationMenu>
    </div>
  ),
};

export const CustomContent: Story = {
  render: () => (
    <div className="w-full flex justify-center">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>카테고리</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="p-6 w-[400px] lg:w-[600px]">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="font-medium mb-2">인기 카테고리</h3>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <NavigationMenuLink href="#" className="flex items-center hover:text-blue-600">
                          <Heart className="mr-2 h-4 w-4" />
                          인기 상품
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink href="#" className="flex items-center hover:text-blue-600">
                          <Bookmark className="mr-2 h-4 w-4" />
                          추천 상품
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink href="#" className="flex items-center hover:text-blue-600">
                          <Star className="mr-2 h-4 w-4" />
                          신상품
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="font-medium mb-2">테마별 카테고리</h3>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <NavigationMenuLink href="#" className="flex items-center hover:text-blue-600">
                          여름 테마
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink href="#" className="flex items-center hover:text-blue-600">
                          겨울 테마
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink href="#" className="flex items-center hover:text-blue-600">
                          기념일 테마
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <NavigationMenuLink href="#all" className="text-sm text-blue-600 hover:underline">
                    모든 카테고리 보기 →
                  </NavigationMenuLink>
                </div>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger>서비스</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="p-6 w-[400px]">
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-blue-50 p-4 rounded-md">
                    <h3 className="font-medium mb-2 text-blue-900">프리미엄 서비스</h3>
                    <p className="text-sm text-blue-800 mb-4">회원 전용 특별 서비스를 확인하세요.</p>
                    <NavigationMenuLink
                      href="#premium"
                      className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                    >
                      자세히 보기
                    </NavigationMenuLink>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-md">
                    <h3 className="font-medium mb-2 text-purple-900">멤버십 혜택</h3>
                    <p className="text-sm text-purple-800 mb-4">다양한 멤버십 혜택을 확인하세요.</p>
                    <NavigationMenuLink
                      href="#membership"
                      className="inline-block px-4 py-2 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700"
                    >
                      가입하기
                    </NavigationMenuLink>
                  </div>
                </div>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink
              href="#help"
              className="px-3 py-2 block"
            >
              도움말
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuIndicator />
        </NavigationMenuList>
        <NavigationMenuViewport />
      </NavigationMenu>
    </div>
  ),
};
