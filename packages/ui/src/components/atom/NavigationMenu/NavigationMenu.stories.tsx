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

const meta: Meta<typeof NavigationMenu> = {
  title: "ATOM/NavigationMenu",
  component: NavigationMenu,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof NavigationMenu>;

const menuItems = [
  {
    label: "Home",
    href: "#home",
  },
  {
    label: "Services",
    content: (
      <div className="p-4 w-40">Various services listed here.</div>
    ),
  },
  {
    label: "About",
    href: "#about",
  },
];

export const Basic: Story = {
  render: () => (
    <div className="w-full h-50 flex justify-center items-center">
      <NavigationMenu>
        <NavigationMenuList>
          {menuItems.map((item, index) => (
            <NavigationMenuItem key={index}>
              {item.content ? (
                <>
                  <NavigationMenuTrigger>{item.label}</NavigationMenuTrigger>
                  <NavigationMenuContent>{item.content}</NavigationMenuContent>
                </>
              ) : (
                <NavigationMenuLink href={item.href}>{item.label}</NavigationMenuLink>
              )}
            </NavigationMenuItem>
          ))}
          <NavigationMenuIndicator />
        </NavigationMenuList>
        <NavigationMenuViewport />
      </NavigationMenu>
    </div>

  ),
};

export const WithoutViewport: Story = {
  render: () => (
    <div className="w-full h-50 flex justify-center items-center">
      <NavigationMenu viewport={false}>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Docs</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="p-4 w-40">Documentation content</div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  ),
};

export const WithMultipleTriggers: Story = {
  render: () => (
    <div className="w-full h-50 flex justify-center items-center">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Features</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="p-4 w-64">Feature content 1</div>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Pricing</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="p-4 w-64">Pricing content here</div>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="#support">Support</NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuIndicator />
        </NavigationMenuList>
        <NavigationMenuViewport />
      </NavigationMenu>
    </div>
  ),
};
