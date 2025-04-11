import type { Meta, StoryObj } from '@storybook/react';
import DataTable from './DataTable';
import { useState } from 'react';
import { Column } from './DataTable.types';

interface User {
  id: number;
  name: string;
  email: string;
}

const meta: Meta<typeof DataTable> = {
  title: 'Components/DataTable',
  component: DataTable,
  tags: ['autodocs'],
  argTypes: {
    pageSize: {
      control: 'number',
      defaultValue: 3,
    },
    serverSide: {
      control: 'boolean',
      defaultValue: false,
    },
    onPageChange: {
      action: 'onPageChange',
    },
    filterFunction: {
      action: 'filterFunction',
    },
  },
};

export default meta;
type Story = StoryObj<typeof DataTable>;

const sampleData: User[] = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' },
  { id: 3, name: 'Charlie', email: 'charlie@example.com' },
  { id: 4, name: 'Diana', email: 'diana@example.com' },
  { id: 5, name: 'Eve', email: 'eve@example.com' },
  { id: 6, name: 'Frank', email: 'frank@example.com' },
  { id: 7, name: 'Grace', email: 'grace@example.com' },
  { id: 8, name: 'Hank', email: 'hank@example.com' },
  { id: 9, name: 'Ivy', email: 'ivy@example.com' },
  { id: 10, name: 'Jack', email: 'jack@example.com' },
  { id: 11, name: 'Karen', email: 'karen@example.com' },
  { id: 12, name: 'Leo', email: 'leo@example.com' },
  { id: 13, name: 'Mona', email: 'mona@example.com' },
  { id: 14, name: 'Nina', email: 'nina@example.com' },
  { id: 15, name: 'Oscar', email: 'oscar@example.com' },
  { id: 16, name: 'Paul', email: 'paul@example.com' },
  { id: 17, name: 'Quinn', email: 'quinn@example.com' },
  { id: 18, name: 'Rachel', email: 'rachel@example.com' },
  { id: 19, name: 'Steve', email: 'steve@example.com' },
  { id: 20, name: 'Tina', email: 'tina@example.com' },
];

const columns: Column<User>[] = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
];

export const ClientSidePagination: Story = {
  render: () => (
    <DataTable
      data={sampleData}
      columns={columns}
      pageSize={2}
      filterFunction={(item, search) => item.name.toLowerCase().includes(search.toLowerCase())}
    />
  ),
};

export const ServerSidePagination: Story = {
  render: () => {
    const ServerSideDemo = () => {
      const [data, setData] = useState<User[]>(sampleData);
      const [page, setPage] = useState<number>(1);

      const handlePageChange = (newPage: number, pageSize: number) => {
        const startIndex = (newPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        setData(sampleData.slice(startIndex, endIndex));
        setPage(newPage);

        console.log(`Page changed to: ${page}, Page Size: ${pageSize}`);
      };

      return (
        <DataTable
          data={data}
          columns={columns}
          pageSize={2}
          serverSide
          onPageChange={handlePageChange}
        />
      );
    };

    return <ServerSideDemo />;
  },
};

export const SearchAndFilter: Story = {
  render: () => (
    <DataTable
      data={sampleData}
      columns={columns}
      pageSize={1}
      filterFunction={(item, search) => item.name.toLowerCase().includes(search.toLowerCase())}
    />
  ),
};

export const ControlledPagination: Story = {
  render: () => {
    const ControlledPaginationDemo = () => {
      const [data, setData] = useState<User[]>(sampleData.slice(0, 3));
      const [currentPage, setCurrentPage] = useState<number>(1);

      const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        const startIndex = (newPage - 1) * 3;
        const endIndex = startIndex + 3;
        setData(sampleData.slice(startIndex, endIndex));
      };

      return (
        <>
          <span className="mb-2 block font-bold text-gray-700">
            Current Page: {currentPage}
          </span>
          <DataTable
            data={data}
            columns={columns}
            pageSize={3}
            serverSide
            onPageChange={handlePageChange}
          />
        </>
      );
    };

    return <ControlledPaginationDemo />;
  },
};