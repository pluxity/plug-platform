import type { Meta, StoryObj } from "@storybook/react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./Table";

const meta: Meta<typeof Table> = {
  title: "ATOM/Table",
  component: Table,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Table>;

const columns = ["선택", "접속상태", "ID num", "이벤트명", "부서", "권한", "관리자 이름", "휴대폰번호", "공지여부", "등록일"];
const rows = Array.from({ length: 3 }, () => [
  "체크박스",
  "온라인",
  "AD1224511",
  "엘리베이터 고장",
  "관리팀A",
  "관리 권한",
  "김소장",
  "010-1234-5678",
  "미공지",
  "2025-01-11",
]);

export const Default: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>이름</TableHead>
          <TableHead>부서</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>최승은</TableCell>
          <TableCell>프론트엔드</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

export const Custom: Story = {
  render: () => (
    <div className="w-[1240px]">
      <Table variant="custom">
        <TableHeader variant="custom">
          <TableRow variant="custom">
            {columns.map((col, idx) => (
              <TableHead key={idx} variant="custom">
                {col}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, idx) => (
            <TableRow key={idx} variant="custom">
              {row.map((cell, cIdx) => (
                <TableCell key={cIdx} variant="custom">
                  {cell}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ),
};
