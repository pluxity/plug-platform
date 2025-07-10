import type { Meta, StoryObj } from "@storybook/react";
import { Profile } from "./Profile";
import { Button } from "../../atom/Button/Button";

const meta: Meta<typeof Profile> = {
    title: "Molecule/Profile",  
    component: Profile,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        profileTitle: {
            description: "프로필 제목",
            control: {
                type: "text",
            },
        },
        profileDescription: {
            description: "프로필 설명",
            control: {
                type: "text",
            },
        },
        type: {
            description: "프로필 타입 - list: 리스트 방식, custom: 커스텀 레이아웃",
            control: {
                type: "select",
                options: ["list", "custom"],
            },
        },
        profileItems: {
            description: "프로필 리스트 (type='list'일 때만 사용)",
            control: {
                type: "object",
            },
        },
        profileButton: {
            description: "프로필 버튼",
            control: {
                type: "object",
            },
        },
        profileImage: {
            description: "프로필 이미지",
            control: {
                type: "text",
            },
        },
        className: {    
            description: "프로필 컴포넌트 스타일",
            control: {
                type: "text",
            },
        },
        children: {
            description: "커스텀 컨텐츠",
            control: false,
        },
    }
};

export default meta;
type Story = StoryObj<typeof Profile>;

export const Default: Story = {
    render: function Render() {
        const handleLogout = () => {
            alert("로그아웃 되었습니다.");
        };

        const handleProfile = () => {
            alert("내 정보 페이지로 이동됩니다.");
        };

        const handleSettings = () => {
            alert("계정 설정 페이지로 이동됩니다.");
        };

        const handleNotifications = () => {
            alert("알림 페이지로 이동됩니다.");
        };

        return (
            <Profile 
                type="list"
                profileTitle="김철수"
                profileDescription="admin@pluxity.com"
                profileItems={[
                    { title: '내 정보', onClick: handleProfile },
                    { title: '계정 설정', onClick: handleSettings },
                    { title: '알림', onClick: handleNotifications }
                ]}
                profileButton={{ 
                    title: "로그아웃", 
                    onClick: handleLogout 
                }}
            />
        )
    },
};

export const CustomStyle: Story = {
    render: function Render() {
        const handleLogout = () => {
            alert("로그아웃 되었습니다.");
        };

        const handleProfile = () => {
            alert("내 정보 페이지로 이동됩니다.");
        };

        const handleSettings = () => {
            alert("계정 설정 페이지로 이동됩니다.");
        };

        const handleNotifications = () => {
            alert("알림 페이지로 이동됩니다.");
        };

        return (
            <Profile 
                type="list"
                profileTitle="김철수"
                profileDescription="admin@pluxity.com"
                profileImage="https://github.com/shadcn.png"
                profileItems={[
                    { title: '내 정보', onClick: handleProfile },
                    { title: '계정 설정', onClick: handleSettings },
                    { title: '알림', onClick: handleNotifications }
                ]}
                profileButton={{ 
                    title: "로그아웃", 
                    onClick: handleLogout 
                }}
                className="p-2 hover:bg-gray-100 cursor-pointer"
            />
        )
    },
};

export const CustomLayout: Story = {
    render: function Render() {
        const handleLogout = () => {
            alert("로그아웃 되었습니다.");
        };

        const handleShortcut1 = () => {
            alert("바로가기 1 클릭");
        };

        const handleShortcut2 = () => {
            alert("바로가기 2 클릭");
        };

        const handleShortcut3 = () => {
            alert("바로가기 3 클릭");
        };

        const handleSystemSettings = () => {
            alert("시스템 설정으로 이동");
        };

        return (
            <Profile 
                type="custom"
                profileTitle="관리자"
                profileDescription="admin@pluxity.com"
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-2">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex flex-col h-16 p-2"
                            onClick={handleShortcut1}
                        >
                            <div className="w-6 h-6 bg-blue-500 rounded-full mb-1"></div>
                            <span className="text-xs">바로가기1</span>
                        </Button>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex flex-col h-16 p-2"
                            onClick={handleShortcut2}
                        >
                            <div className="w-6 h-6 bg-green-500 rounded-full mb-1"></div>
                            <span className="text-xs">바로가기2</span>
                        </Button>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex flex-col h-16 p-2"
                            onClick={handleShortcut3}
                        >
                            <div className="w-6 h-6 bg-purple-500 rounded-full mb-1"></div>
                            <span className="text-xs">바로가기3</span>
                        </Button>
                    </div>
                    
                    <div className="flex space-x-2">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={handleSystemSettings}
                        >
                            시스템 설정
                        </Button>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={handleLogout}
                        >
                            로그아웃
                        </Button>
                    </div>
                </div>
            </Profile>
        )
    },
};