// SearchForm.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { SearchForm } from "./SearchForm";
import * as React from "react";

const meta: Meta<typeof SearchForm> = {
  title: "Molecule/SearchForm",
  component: SearchForm,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SearchForm>;

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = React.useState("");
    const allSuggestions = ["김포공항", "김포역", "김포한강", "서울역", "인천공항"];
    const filteredSuggestions = allSuggestions.filter((item) =>
      item.toLowerCase().includes(value.toLowerCase())
    );

    return (
        <SearchForm
          {...args}
          value={value}
          onChange={setValue}
          onSelect={(item) => setValue(item)}
          suggestions={value ? filteredSuggestions : []}
        />
    );
  },
};
