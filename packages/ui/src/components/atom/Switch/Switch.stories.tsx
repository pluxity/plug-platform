import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Switch } from "./Switch";

const meta: Meta<typeof Switch> = {
  title: "ATOM/Switch",
  component: Switch,
  tags: ["autodocs"],
  argTypes: {
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
    onCheckedChange: { action: "onCheckedChange" },
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  render: function Render(args) {
    const [checked, setChecked] = useState(args.checked ?? false);
    return (
      <div className="flex items-center gap-4">
        <Switch
          {...args}
          checked={checked}
          onCheckedChange={(v) => {
            setChecked(v);
            args.onCheckedChange?.(v);
          }}
        />
        <span>{checked ? "켜짐" : "꺼짐"}</span>
      </div>
    );
  },
  args: {
    checked: false,
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    checked: true,
    disabled: true,
  },
};

export const CustomStyle: Story = {
  render: function Render() {
    const [checked, setChecked] = useState(false);

    return (
      <div className="flex items-center gap-4">
        <Switch
          checked={checked}
          onCheckedChange={setChecked}
          className="bg-point-blue data-[state=checked]:bg-blue-point"
        >
        </Switch>
        <span className="text-sm">
          {checked ? "맞춤형 켜짐" : "맞춤형 꺼짐"}
        </span>
      </div>
    );
  },
};
