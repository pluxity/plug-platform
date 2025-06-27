import type { Meta, StoryObj } from "@storybook/react";
import { Separator } from "./Separator";

const meta: Meta<typeof Separator> = {
  title: "ATOM/Separator",
  component: Separator,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Separator>;

export const Horizontal: Story = {
  args: {
    orientation: "horizontal",
    className: "my-4",
  },
  render: (args) => (
    <div className="w-full">
      <div className="text-sm mb-2">Section Above</div>
      <Separator {...args} />
      <div className="text-sm mt-2">Section Below</div>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="w-full flex flex-col gap-2">
      <div className="space-y-1 ">
        <h4 className="text-sm leading-none font-medium">Radix Primitives</h4>
        <p className="text-muted-foreground text-sm">
          An open-source UI component library.
        </p>
      </div>
      <Separator className="my-4" />
      <div className="flex gap-2 h-5 items-center space-x-4 text-sm">
        <div>Blog</div>
        <Separator orientation="vertical" />
        <div>Docs</div>
        <Separator orientation="vertical" />
        <div>Source</div>
      </div>
    </div>
  ),
};
