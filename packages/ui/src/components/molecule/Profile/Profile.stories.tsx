import type { Meta, StoryObj } from "@storybook/react";
import { Profile } from "./Profile";

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
        profileItems: {
            description: "프로필 리스트",
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

