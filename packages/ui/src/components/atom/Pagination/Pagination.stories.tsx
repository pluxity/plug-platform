import type { Meta, StoryObj } from "@storybook/react"
import {
  Pagination,
  PaginationContent,
  PaginationNumber,
  PaginationPrevious,
  PaginationNext,
} from "./Pagination";
import React from "react";

const meta: Meta<typeof Pagination> = {
  title: "ATOM/Pagination",
  component: Pagination,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Pagination>

export const Default: Story = {
  render: () => (
    <Pagination>
      <PaginationContent>
        <PaginationPrevious />
        <PaginationNumber page={52} />
        <PaginationNumber page={53} />
        <PaginationNumber page={54} />
        <PaginationNumber page={55} />
        <PaginationNumber page={56} />
        <PaginationNumber page={57} />
        <PaginationNumber page={58} isActive />
        <PaginationNumber page={59} />
        <PaginationNumber page={60} />
        <PaginationNumber page={61} />
        <PaginationNext />
      </PaginationContent>
    </Pagination>
  ),
}

export const CustomActivePosition: Story = {
  render: () => (
    <Pagination>
      <PaginationContent>
        <PaginationPrevious />
        <PaginationNumber page={1} />
        <PaginationNumber page={2} />
        <PaginationNumber page={3} isActive />
        <PaginationNumber page={4} />
        <PaginationNumber page={5} />
        <PaginationNumber page={6} />
        <PaginationNumber page={7} />
        <PaginationNext />
      </PaginationContent>
    </Pagination>
  ),
}

export const FewerPages: Story = {
  render: () => (
    <Pagination>
      <PaginationContent>
        <PaginationPrevious />
        {[1, 2, 3, 4, 5].map((num) => (
          <PaginationNumber 
            key={num} 
            page={num} 
            isActive={num === 3}
          />
        ))}
        <PaginationNext />
      </PaginationContent>
    </Pagination>
  ),
}

export const WithInteractiveExample: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [activePage, setActivePage] = React.useState(5);
    const totalPages = 9;
    
    const handlePrevious = () => {
      setActivePage((prev) => Math.max(1, prev - 1));
    };
    
    const handleNext = () => {
      setActivePage((prev) => Math.min(totalPages, prev + 1));
    };
    
    const handlePageClick = (page: number) => {
      setActivePage(page);
    };
    
    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-sm text-gray-500">현재 페이지: {activePage}</p>
        <Pagination>
          <PaginationContent>
            <div onClick={handlePrevious} style={{ cursor: 'pointer' }}>
              <PaginationPrevious />
            </div>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <div 
                key={page} 
                onClick={() => handlePageClick(page)} 
                style={{ cursor: 'pointer' }}
              >
                <PaginationNumber 
                  page={page} 
                  isActive={page === activePage} 
                />
              </div>
            ))}
            <div onClick={handleNext} style={{ cursor: 'pointer' }}>
              <PaginationNext />
            </div>
          </PaginationContent>
        </Pagination>
      </div>
    );
  },
};