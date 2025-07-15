import { useEffect, useMemo } from "react";
import { Card, CardContent } from "@plug/ui";
import { Button } from "@plug/ui";
import { FilterBar } from "@plug/ui";
import { useSearchParams } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@plug/ui";
import {
  FacilityCardListProps,
  FacilityItem
} from "@/backoffice/domains/facility/components/CardListType";

export function CardList<T extends FacilityItem>({
                                                           dataResponse,
                                                           filterData,
                                                           renderOptions,
                                                           pageSize = 8,
                                                           actions,
                                                           filterOptions,
                                                           emptyStateAction,
                                                         }: FacilityCardListProps<T>) {
  const { data, isLoading, error } = dataResponse;
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = parseInt(searchParams.get("page") || "1", 8);
  const searchQuery = filterOptions?.searchValue || searchParams.get("query") || "";

  useEffect(() => {
    if (filterOptions?.searchValue !== undefined) {
      setSearchParams({
        query: filterOptions.searchValue,
        page: "1"
      });
    }
  }, [filterOptions?.searchValue]);

  const defaultGetCardColor = (item: T) => {
    const colors = [
      "bg-gray-700",
      "bg-zinc-700",
      "bg-slate-700",
      "bg-stone-700",
      "bg-neutral-700",
      "bg-rose-800",
      "bg-emerald-800",
      "bg-cyan-800",
      "bg-violet-800",
    ];
    return colors[item.id % colors.length];
  };

  const defaultGetInitial = (item: T) => {
    return item.name ? item.name.charAt(0).toUpperCase() : "?";
  };

  const defaultFilterData = (items: T[], query: string) => {
    if (!query || query.trim() === "") return items;
    const normalizedQuery = query
      .toLowerCase()
      .normalize('NFC')
      .trim();

    if (normalizedQuery === '') return items;

    const searchFields = filterOptions?.searchFields || ["name", "code", "description"];

    return items.filter((item) => {
      return searchFields.some(field => {
        const value = item[field as keyof T];
        return value &&
          String(value)
            .toLowerCase()
            .normalize('NFC')
            .includes(normalizedQuery);
      });
    });
  };

  const getCardColor = renderOptions?.getCardColor || defaultGetCardColor;
  const getInitial = renderOptions?.getInitial || defaultGetInitial;
  const filterFunction = filterData || defaultFilterData;

  const filteredItems = useMemo(() => {
    if (!data) return [];
    return filterFunction(data, searchQuery);
  }, [data, searchQuery, filterFunction]);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredItems.slice(startIndex, startIndex + pageSize);
  }, [filteredItems, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredItems.length / pageSize);

  const handlePageChange = (page: number) => {
    setSearchParams({
      query: searchQuery,
      page: page.toString()
    });
  };

  const handleSearchChange = (value: string) => {
    if (filterOptions?.onSearchChange) {
      filterOptions.onSearchChange(value);
    } else {
      setSearchParams({
        query: value,
        page: "1"
      });
    }
  };

  const renderPaginationLinks = () => {
    const pageNumbers = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("ellipsis");
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push("ellipsis");
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push("ellipsis");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("ellipsis");
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers.map((page, index) => {
      if (page === "ellipsis") {
        return (
          <PaginationItem key={`ellipsis-${index}`}>
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      return (
        <PaginationItem key={page}>
          <PaginationLink
            isActive={currentPage === page}
            onClick={() => handlePageChange(page as number)}
          >
            {page}
          </PaginationLink>
        </PaginationItem>
      );
    });
  };

  const renderCardContent = (item: T) => {
    if (renderOptions?.getCardContent) {
      return renderOptions.getCardContent(item);
    }

    return (
      <div className="p-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold truncate">
            {item.name}
          </h3>
          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
            {item.code}
          </span>
        </div>
        <p className="text-gray-600 text-sm line-clamp-2">
          {item.description || "-"}
        </p>
      </div>
    );
  };

  const renderCardImage = (item: T) => {
    if (renderOptions?.getCardImage) {
      return renderOptions.getCardImage(item);
    }

    const typeColorClass = item.type === 'building' ? 'bg-blue-700' :
      item.type === 'panorama' ? 'bg-purple-700' :
        item.type === 'station' ? 'bg-emerald-700' : 'bg-gray-700';

    return item.thumbnail?.url ? (
      <div className="relative w-full h-full">
        <img
          src={item.thumbnail.url}
          alt={item.name}
          className="w-full h-full object-cover"
        />
        {item.type && (
          <div className="absolute top-2 right-2 px-2 py-1 text-white text-xs rounded-full bg-black/50 backdrop-blur-sm">
            {item.type === 'building' ? '건물' :
              item.type === 'panorama' ? '파노라마' :
                item.type === 'station' ? '역사' : '시설'}
          </div>
        )}
      </div>
    ) : (
      <div className={`w-full h-full flex items-center justify-center text-white text-6xl font-bold ${typeColorClass}`}>
        {getInitial(item)}
        {item.type && (
          <div className="absolute top-2 right-2 px-2 py-1 text-white text-xs rounded-full bg-black/50 backdrop-blur-sm">
            {item.type === 'building' ? '건물' :
              item.type === 'panorama' ? '파노라마' :
                item.type === 'station' ? '역사' : '시설'}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="w-full">
        <FilterBar
          selects={filterOptions?.additionalFilters || []}
          showSearchInput={true}
          searchValue={searchQuery}
          onSearch={handleSearchChange}
          searchPlaceholder={
            filterOptions?.searchPlaceholder || "이름, 코드 또는 설명으로 검색"
          }
          className="mb-6"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">데이터를 불러오는 중...</div>
      ) : error ? (
        <div className="text-center text-red-500 p-8">
          데이터를 불러오는 중 오류가 발생했습니다.
        </div>
      ) : filteredItems.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-8">
            <p className="mb-4 text-gray-500">
              {searchQuery
                ? "검색 결과가 없습니다."
                : "등록된 항목이 없습니다."}
            </p>
            {emptyStateAction && (
              <Button variant="default" onClick={emptyStateAction.onClick}>
                {emptyStateAction.label}
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedItems.map((item) => (
              <Card
                key={item.id}
                className="group overflow-hidden transition-all duration-300 hover:shadow-lg"
                onClick={() => actions.onView(item)}
              >
                <div className={`relative w-full h-40 ${getCardColor(item)}`}>
                  {renderCardImage(item)}

                  <div className="absolute inset-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <Button
                        size="sm"
                        className="bg-white/80 backdrop-blur-sm text-black hover:bg-white/90 rounded-full px-4 py-2 font-bold shadow-sm transition-all duration-300 hover:shadow-md h-8 w-20"
                        onClick={(e) => {
                          e.stopPropagation();
                          actions.onView(item);
                        }}
                      >
                        <span>상세 보기</span>
                      </Button>
                    </div>
                    <div className="absolute bottom-0 right-0 px-4 py-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full bg-white/70 backdrop-blur-sm hover:bg-white/90 border-transparent"
                          onClick={(e) => {
                            e.stopPropagation();
                            actions.onEdit(item);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">수정</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full bg-white/70 backdrop-blur-sm hover:bg-white/90 border-transparent"
                          onClick={(e) => {
                            e.stopPropagation();
                            actions.onDelete(item);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">삭제</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                {renderCardContent(item)}
              </Card>
            ))}
          </div>

          {totalPages >= 1 && (
            <Pagination className="mt-8">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      handlePageChange(Math.max(1, currentPage - 1))
                    }
                    className={
                      currentPage === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>

                {renderPaginationLinks()}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      handlePageChange(Math.min(totalPages, currentPage + 1))
                    }
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
}