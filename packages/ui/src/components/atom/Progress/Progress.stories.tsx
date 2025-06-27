import type { Meta, StoryObj } from "@storybook/react";
import Progress from "./Progress";
import { useEffect, useState } from "react";

const meta: Meta<typeof Progress> = {
  title: "ATOM/Progress",
  component: Progress,
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof Progress>

export const Static: Story = {
  args: {
    value: 60
  }
};

export const Animated: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = useState(0);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      const interval = setInterval(() => {
        setValue((prev) => (prev >= 100 ? 0 : prev + 10));
      }, 500);
      return () => clearInterval(interval);
    }, []);

    return (
      <div className="w-full max-w-sm p-4">
        <Progress value={value} />
        <p className="text-sm text-muted-foreground mt-2">진행도: {value}%</p>
      </div>
    );
  }
};
