import type { Meta, StoryObj } from "@storybook/react";
import { DataTable } from "./DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { Button } from "../../atom/Button/Button";

const data = [
  { id: "1", name: "홍길동", email: "hong@example.com", age: 28 },
  { id: "2", name: "김철수", email: "kim@example.com", age: 32 },
  { id: "3", name: "이영희", email: "lee@example.com", age: 24 },
  { id: "4", name: "박민수", email: "park@example.com", age: 30 },
  { id: "5", name: "최지우", email: "choi@example.com", age: 27 },
  { id: "6", name: "정해인", email: "jung@example.com", age: 29 },
  { id: "7", name: "한지민", email: "han@example.com", age: 31 },
  { id: "8", name: "이준기", email: "leejg@example.com", age: 26 },
  { id: "9", name: "신세경", email: "shin@example.com", age: 25 },
  { id: "10", name: "김유정", email: "kimyj@example.com", age: 23 },
  { id: "11", name: "유승호", email: "yoo@example.com", age: 28 },
  { id: "12", name: "박보영", email: "parkby@example.com", age: 27 },
  { id: "13", name: "서강준", email: "seo@example.com", age: 29 },
  { id: "14", name: "김소현", email: "kimsh@example.com", age: 24 },
  { id: "15", name: "이성경", email: "leesg@example.com", age: 30 },
  { id: "16", name: "남주혁", email: "nam@example.com", age: 32 },
  { id: "17", name: "박서준", email: "park@example.com", age: 31 },
  { id: "18", name: "김지원", email: "kimjw@example.com", age: 28 },
  { id: "19", name: "이동욱", email: "leedw@example.com", age: 33 },
  { id: "20", name: "공유", email: "gong@example.com", age: 34 },
];

const columns: ColumnDef<typeof data[0]>[] = [
  { accessorKey: "name", header: "이름" },
  { accessorKey: "email", header: "이메일" },
  { accessorKey: "age", header: "나이" },
];

const meta: Meta<typeof DataTable<typeof data[0]>> = {
  title: "ORGANISM/DataTable",
  component: DataTable,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DataTable<typeof data[0]>>;

export const Default: Story = {
  render: function Render(args) {
    const [main, setMain] = useState("");

    const mainOptions = [
      { label: "전체", value: "all" },
      { label: "A", value: "a" },
      { label: "B", value: "b" },
    ];
    const selects = [
      {
        key: "main",
        placeholder: "대분류",
        options: mainOptions,
        value: main,
        onChange: setMain,
      },
    ];
    return (
      <DataTable
        {...args}
        columns={columns}
        data={data}
        selects={selects || []}
        showFilter={true}
        filterPlaceholder="이름을 검색하세요."
        filterColumnKey="name"
        buttons={
          <>
            <Button variant="default" onClick={() => {}}>등록</Button>
            <Button variant="destructive" onClick={() => {}}>삭제</Button>
            <Button variant="secondary" onClick={() => {}}>엑셀 다운로드</Button>
          </>
        }
      />
    );
  },
};

export const PanginationSize: Story = {
  render: function Render(args) {
    const [main, setMain] = useState("");
    const mainOptions = [
      { label: "전체", value: "all" },
      { label: "A", value: "a" },
      { label: "B", value: "b" },
    ];
    const selects = [
      {
        key: "main",
        placeholder: "대분류",
        options: mainOptions,
        value: main,
        onChange: setMain,
      },
    ];
    return (
      <DataTable
        {...args}
        columns={columns}
        data={data}
        selects={selects || []}
        showFilter={true}
        filterColumnKey="name"
        pageSize={8}
        buttons={
          <>
            <Button variant="default" onClick={() => {}}>등록</Button>
            <Button variant="destructive" onClick={() => {}}>삭제</Button>
            <Button variant="secondary" onClick={() => {}}>엑셀 다운로드</Button>
          </>
        }
      />
    );
  },
};

export const NoFilter: Story = {
  render: function Render(args) {
    return (
      <DataTable
        {...args}
        columns={columns}
        data={data}
        pageSize={5}
        showFilter={false}
        buttons={
          <>
            <Button variant="default" onClick={() => {}}>등록</Button>
            <Button variant="destructive" onClick={() => {}}>삭제</Button>
            <Button variant="secondary" onClick={() => {}}>엑셀 다운로드</Button>
          </>
        }
      />
    );
  },
};

export const NoButtons: Story = {
  render: function Render(args) {
    return (
      <DataTable
        {...args}
        columns={columns}
        data={data}
        pageSize={8}
      />
    );
  },
};

export const RowSelection: Story = {
  render: function Render(args) {
    return (
      <DataTable 
        {...args} 
        columns={columns} 
        data={data} 
        rowSelection={true}
      />
    );
  },
};
