import type { Meta, StoryObj } from "@storybook/react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from "./Sheet";

const meta: Meta<typeof Sheet> = {
  title: "ATOM/Sheet",
  component: Sheet,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Sheet>;

const Template = ({ side }: { side: "left" | "right" | "top" | "bottom" }) => (
  <Sheet>
    <SheetTrigger asChild>
      <button className="px-4 py-2 rounded bg-green-600 text-white">Open {side} Sheet</button>
    </SheetTrigger>
    <SheetContent side={side}>
      <SheetHeader>
        <SheetTitle>{side.toUpperCase()} Sheet</SheetTitle>
        <SheetDescription>
          This is a {side}-aligned sheet. You can customize the content inside.
        </SheetDescription>
      </SheetHeader>
      <div className="p-4 text-sm text-muted-foreground">
        Content goes here...
      </div>
      <SheetFooter>
        <button className="px-4 py-2 rounded bg-green-600 text-white">Cancel</button>
        <button className="px-4 py-2 rounded bg-yellow-6-- text-white">Confirm</button>
      </SheetFooter>
    </SheetContent>
  </Sheet>
);

export const Right: Story = {
  render: () => <Template side="right" />,
};

export const Left: Story = {
  render: () => <Template side="left" />,
};

export const Top: Story = {
  render: () => <Template side="top" />,
};

export const Bottom: Story = {
  render: () => <Template side="bottom" />,
};
