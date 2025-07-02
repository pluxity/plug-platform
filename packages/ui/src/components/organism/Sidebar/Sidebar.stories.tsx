import { Meta, StoryObj } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import { Sidebar }from "./Sidebar";
import { SidebarItem } from "./Sidebar.types";
import { useState } from "react";

const meta: Meta<typeof Sidebar> = {
  title: "Organism/Sidebar",
  component: Sidebar,
  tags: ["component", "sidebar"],
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

export const Default: Story = {
  render: () => <SidebarWrapper />,
};
