// SearchForm.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { SearchForm } from "./SearchForm";
import { useState } from "react";

const meta: Meta<typeof SearchForm> = {
  title: "Molecule/SearchForm",
  component: SearchForm,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    searchResult: {
      description: "API 결과",
    },
    onSearch: {
      description: "API 호출 시 사용",
    },
  },
};

export default meta;
type Story = StoryObj<typeof SearchForm>;

export const Default: Story = {
  render: function Render(args) {
    const [value, setValue] = useState("");
    const [apiSuggestions, setApiSuggestions] = useState<string[]>([]);
    const allData = ["김포공항", "김포역", "김포한강", "서울역", "인천공항", "부산역", "대구역", "광주역"];

    const handleSearch = (search: string) => {
      // 실제 API 호출
      setTimeout(() => {
        const filtered = allData.filter(item => 
          item.toLowerCase().includes(search.toLowerCase())
        );
        setApiSuggestions(filtered);
      }, 500);
    };

    return (
      <SearchForm
        {...args}
        value={value}
        onChange={setValue}
        onSelect={(item) => setValue(item)}
        placeholder="입력하세요."
        // API 호출
        onSearch={handleSearch} 
        searchResult={apiSuggestions} 
      />
    );
  },
};


export const CustomStyle: Story = {
  render: function Render(args) {
    const [value, setValue] = useState("");
    const [apiSuggestions, setApiSuggestions] = useState<string[]>([]);
    const allData = ["김포공항", "김포역", "김포한강", "서울역", "인천공항", "부산역", "대구역", "광주역"];

    const handleSearch = (search: string) => {
      // 실제 API 호출
      setTimeout(() => {
        const filtered = allData.filter(item => 
          item.toLowerCase().includes(search.toLowerCase())
        );
        setApiSuggestions(filtered);
      }, 500);
    };

    return (
      <SearchForm
        {...args}
        value={value}
        onChange={setValue}
        onSelect={(item) => setValue(item)}
        className="bg-yellow-50"
        inputClassName="bg-yellow-50"
        listClassName="bg-blue-50"
        itemClassName="hover:bg-blue-100"
        clearButtonClassName="text-red-500"
        placeholder="여기서 검색하세요!"
        // API 호출
        onSearch={handleSearch} 
        searchResult={apiSuggestions} 
      />
    );
  },
};
