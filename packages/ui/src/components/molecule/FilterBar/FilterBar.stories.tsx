import type { Meta, StoryObj } from "@storybook/react";
import { FilterBar } from "./FilterBar";
import { useState } from "react";

const meta: Meta<typeof FilterBar> = {
  title: 'MOLECULE/FilterBar',
  component: FilterBar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    showSearchInput: { control: 'boolean' },
    searchPlaceholder: { control: 'text' },
  }
}

export default meta
type Story = StoryObj<typeof FilterBar>

type Option = { label: string; value: string };
type OptionMap = Record<string, Option[]>;

export const Default: Story = {
  render: function Render(args) {
    const [main, setMain] = useState("");
    const [sub, setSub] = useState("");
    const [detail, setDetail] = useState("");
    const [search, setSearch] = useState("");

    const mainOptions = [
        { label: "대분류A", value: "a" },
        { label: "대분류B", value: "b" },
    ];
    
    const subOptions: OptionMap = {
      a: [
        { label: "중분류A-1", value: "a1" },
        { label: "중분류A-2", value: "a2" },
      ],
      b: [
        { label: "중분류B-1", value: "b1" },
      ],
    };
    
    const detailOptions: OptionMap = {
      a1: [
        { label: "소분류A-1-1", value: "a11" },
      ],
      a2: [
        { label: "소분류A-2-1", value: "a21" },
      ],
      b1: [
        { label: "소분류B-1-1", value: "b11" },
      ],
    };

    const handleSubmit = () => {
      alert(`검색: ${main}, ${sub}, ${detail}, ${search}`);
    }

    return (
      <FilterBar
        {...args}
        selects={[
          {
            key: "main",
            placeholder: "대분류",
            options: mainOptions,
            value: main,
            onChange: (value: string) => {setMain(value);},
          },
          {
            key: "sub",
            placeholder: "중분류",
            options: subOptions[main] || [],
            value: sub,
            onChange: (value: string) => {setSub(value);},
          },
          {
            key: "detail",
            placeholder: "소분류",
            options: detailOptions[sub] || [],
            value: detail,
            onChange: (value: string) => {setDetail(value);},
          },
        ]}
        showSearchInput={true}
        searchValue={search}
        onSearch={setSearch}
        onSubmit={handleSubmit}
      />
    );
  },
}

export const NoDetail: Story = {
  render: function Render() {
    const [main, setMain] = useState("");
    const [sub, setSub] = useState("");
    const [search, setSearch] = useState("");

    const mainOptions = [
      { label: "대분류A", value: "a" },
      { label: "대분류B", value: "b" },
    ];
    const subOptions: OptionMap = {
      a: [
        { label: "중분류A-1", value: "a1" },
        { label: "중분류A-2", value: "a2" },
      ],
      b: [
        { label: "중분류B-1", value: "b1" },
      ],
    };

    return (
      <FilterBar
        selects={[
          {
            key: "main",
            placeholder: "대분류",
            options: mainOptions,
            value: main,
            onChange: setMain,
          },
          {
            key: "sub",
            placeholder: "중분류",
            options: subOptions[main] || [],
            value: sub,
            onChange: setSub,
          },
        ]}
        showSearchInput={true}
        searchValue={search}
        onSearch={setSearch}
        onSubmit={() => alert(`검색: ${main}, ${sub}, ${search}`)}
      />
    );
  },
}

export const NoSearchInput: Story = {
  render: function Render() {
    const [main, setMain] = useState("");
    const [sub, setSub] = useState("");
    const [detail, setDetail] = useState("");

    const mainOptions = [
      { label: "대분류A", value: "a" },
      { label: "대분류B", value: "b" },
    ];
    const subOptions: OptionMap = {
      a: [
        { label: "중분류A-1", value: "a1" },
        { label: "중분류A-2", value: "a2" },
      ],
      b: [
        { label: "중분류B-1", value: "b1" },
      ],
    };
    const detailOptions: OptionMap = {
      a1: [
        { label: "소분류A-1-1", value: "a11" },
      ],
      a2: [
        { label: "소분류A-2-1", value: "a21" },
      ],
      b1: [
        { label: "소분류B-1-1", value: "b11" },
      ],
    };

    return (
      <FilterBar
        selects={[
          {
            key: "main",
            placeholder: "대분류",
            options: mainOptions,
            value: main,
            onChange: setMain,
          },
          {
            key: "sub",
            placeholder: "중분류",
            options: subOptions[main] || [],
            value: sub,
            onChange: setSub,
          },
          {
            key: "detail",
            placeholder: "소분류",
            options: detailOptions[sub] || [],
            value: detail,
            onChange: setDetail,
          },
        ]}
        showSearchInput={false}
        onSubmit={() => alert(`검색: ${main}, ${sub}, ${detail}`)}
      />
    );
  },
}



