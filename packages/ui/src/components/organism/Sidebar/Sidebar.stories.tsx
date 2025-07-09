import { Meta, StoryObj } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import { Sidebar }from "./Sidebar";
import { SidebarItem } from "./Sidebar.types";
import { useState } from "react";

const meta: Meta<typeof Sidebar> = {
  title: "Organism/Sidebar",
  component: Sidebar,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

const sidebarItems: SidebarItem[] = [
  {
    id: "user-management",
    label: "사용자 관리",
    to: "/admin",
    depth: 1,
    showToggle: true,
  },
  {
    id: "user-list",
    label: "사용자 목록",
    to: "/admin/users",
    depth: 2,
    parentId: "user-management",
  },
  {
    id: "group-auth-list",
    label: "그룹/권한 목록",
    to: "/admin/user-groups",
    depth: 2,
    parentId: "user-management",
  },
];

const oneDepthSidebarItems: SidebarItem[] = [
  {
    id: "dashboard",
    label: "대시보드",
    to: "/admin/dashboard",
    depth: 1,
    showToggle: true,
  },
  {
    id: "user-management",
    label: "사용자 관리",
    to: "/admin/users",
    depth: 1,
    showToggle: true,
  },
  {
    id: "asset-management",
    label: "자산 관리",
    to: "/admin/assets",
    depth: 1,
    showToggle: true,
  },
  {
    id: "device-management",
    label: "디바이스 관리",
    to: "/admin/devices",
    depth: 1,
    showToggle: true,
  },
  {
    id: "settings",
    label: "설정",
    to: "/admin/settings",
    depth: 1,
    showToggle: true,
  },
];

const SidebarWrapper = () => {
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const handleClick = (id: string) => {
    setActiveItem(id);
  };

  const handleToggle = (id: string) =>
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );

  return (
    <MemoryRouter>
      <Sidebar
        items={sidebarItems}
        activeItemId={activeItem}
        expandedItemIds={expandedItems}
        onItemClick={handleClick}
        onToggleExpand={handleToggle}
      />
    </MemoryRouter>
  );
};

const OneDepthSidebarWrapper = () => {
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const handleClick = (id: string) => {
    setActiveItem(id);
  };

  const handleToggle = (id: string) => 
    setExpandedItems((prev) => (prev.includes(id) ? [] : [id]));

  return (
    <MemoryRouter>
      <Sidebar
        items={oneDepthSidebarItems}
        activeItemId={activeItem}
        expandedItemIds={expandedItems}
        onItemClick={handleClick}
        onToggleExpand={handleToggle}
      />
    </MemoryRouter>
  );
};

export const Default: Story = {
  render: () => <SidebarWrapper />,
};

export const OneDepthSidebar: Story = {
  render: () => <OneDepthSidebarWrapper />,
};
