import { useEffect, useMemo } from "react";
import { Card, CardContent, Button, FilterBar } from "@plug/ui";
import { useSearchParams } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import { FacilityCardListProps, FacilityItem } from "./CardListType";
import { PaginationComponent } from "../components/PaginationComponent";

export function CardList<T extends FacilityItem>({ dataResponse, filterData, renderOptions = {}, pageSize = 8, actions, filterOptions = {} }: FacilityCardListProps<T>) {
  const { data = [], isLoading, error } = dataResponse;
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = filterOptions?.searchValue || searchParams.get("query") || "";

  useEffect(() => {
    if (filterOptions?.searchValue !== undefined) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("query", filterOptions.searchValue);
      if (searchParams.get("query") !== filterOptions.searchValue) newParams.set("page", "1");
      setSearchParams(newParams);
    }
  }, [filterOptions?.searchValue, searchParams, setSearchParams])

  const defaultFunctions = {
    getCardColor: (item: T) => {
      const colors = ["bg-gray-700", "bg-zinc-700", "bg-slate-700", "bg-stone-700", "bg-neutral-700", "bg-rose-800", "bg-emerald-800", "bg-cyan-800", "bg-violet-800",];
      return colors[item.id % colors.length];
    },

    getInitial: (item: T) => {
      return item.name ? item.name.charAt(0).toUpperCase() : "?";
    },

    filterData: (items: T[], query: string) => {
      if (!query || query.trim() === "") return items;

      const normalizedQuery = query.toLowerCase().normalize('NFC').trim();
      if (normalizedQuery === '') return items;

      const searchFields = filterOptions?.searchFields || ["name", "code", "description"];

      return items.filter((item) => {
        return searchFields.some(field => {
          const value = item[field as keyof T];
          return value &&
            String(value).toLowerCase().normalize('NFC').includes(normalizedQuery);
        });
      });
    }
  };

  const {
    getCardColor = defaultFunctions.getCardColor,
    getInitial = defaultFunctions.getInitial
  } = renderOptions;

  const filterFunction = filterData || defaultFunctions.filterData;

  const filteredItems = useMemo(() => {
    if (!data || !data.length) return [];
    return filterFunction(data, searchQuery);
  }, [data, searchQuery, filterFunction]);

  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredItems.slice(startIndex, startIndex + pageSize);
  }, [filteredItems, currentPage, pageSize]);

  const handlePageChange = (page: number) => {
    console.log(`페이지 변경: ${currentPage} -> ${page}`);
    if (currentPage === page) return;
    try {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("page", String(page));
      setSearchParams(newParams, { replace: true });
    } catch (error) {
      console.error("페이지 변경 중 오류 발생:", error);
    }
  };

  const handleSearchChange = (value: string) => {
    if (filterOptions?.onSearchChange) {
      filterOptions.onSearchChange(value);
    } else {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("query", value);
      newParams.set("page", "1");
      setSearchParams(newParams);
    }
  };

  const renderCardContent = (item: T) => {
    if (renderOptions?.getCardContent) {
      return renderOptions.getCardContent(item);
    }

    return (
      <div className="p-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold truncate">{item.name}</h3>
          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">{item.code}</span>
        </div>
        <p className="text-gray-600 text-sm line-clamp-2">{item.description || "-"}</p>
      </div>
    );
  };

  const renderTypeLabel = (type?: string) => {
    if (!type) return null;

    const typeLabels = { 'buildings': '건물', 'stations': '역사', 'default': '시설' };

    return (
      <div className="absolute top-2 right-2 px-2 py-1 text-white text-xs rounded-full bg-black/50 backdrop-blur-sm">
        {typeLabels[type as keyof typeof typeLabels] || typeLabels.default}
      </div>
    );
  };

  const renderCardImage = (item: T) => {
    if (renderOptions?.getCardImage) return renderOptions.getCardImage(item);

    const typeColorMap = { 'buildings': 'bg-blue-700', 'stations': 'bg-emerald-700', 'default': 'bg-gray-700' };
    const typeColorClass = item.type ? (typeColorMap[item.type as keyof typeof typeColorMap] || typeColorMap.default) : typeColorMap.default;

    return item.thumbnail?.url ? (
      <div className="relative w-full h-full">
        <img src={item.thumbnail.url} alt={item.name} className="w-full h-full object-cover" />
        {renderTypeLabel(item.type)}
      </div>
    ) : (
      <div className={`w-full h-full flex items-center justify-center text-white text-6xl font-bold ${typeColorClass}`}>
        {getInitial(item)}
        {renderTypeLabel(item.type)}
      </div>
    );
  };

  const renderCardActions = (item: T) => (
    <div className="absolute inset-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
      <div className="opacity-0 group-hover:opacity-100 transition-all duration-300">
        <Button
          size="sm"
          className="bg-white/80 backdrop-blur-sm text-black hover:bg-white/90 rounded-full px-4 py-2 font-bold shadow-sm transition-all duration-300 hover:shadow-md h-8 w-20"
          onClick={(e) => {e.stopPropagation(); actions.onView(item);}}
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
            onClick={(e) => {e.stopPropagation(); actions.onEdit(item);}}
          >
            <Pencil className="h-4 w-4" />
            <span className="sr-only">수정</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full bg-white/70 backdrop-blur-sm hover:bg-white/90 border-transparent"
            onClick={(e) => {e.stopPropagation(); actions.onDelete(item);}}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">삭제</span>
          </Button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    if (isLoading) return <div className="flex justify-center p-8">데이터를 불러오는 중...</div>;

    if (error) {
      return (
        <div className="text-center text-red-500 p-8">
          데이터를 불러오는 중 오류가 발생했습니다.
        </div>
      );
    }

    if (filteredItems.length === 0) {
      return (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-8">
            <p className="mb-4 text-gray-500">
              {searchQuery ? "검색 결과가 없습니다." : "등록된 항목이 없습니다."}
            </p>
          </CardContent>
        </Card>
      );
    }

    return (
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
                {renderCardActions(item)}
              </div>
              {renderCardContent(item)}
            </Card>
          ))}
        </div>

        <PaginationComponent
          totalItems={filteredItems.length}
          pageSize={pageSize}
          defaultPage={currentPage}
          queryParamName="page"
          onPageChange={handlePageChange}
        />
      </>
    );
  };

  return (
    <div className="space-y-6">
      <div className="w-full mb-4">
        <FilterBar
          selects={filterOptions?.additionalFilters || []}
          showSearchInput={true}
          searchValue={searchQuery}
          onSearch={handleSearchChange}
          searchPlaceholder={
            filterOptions?.searchPlaceholder || "이름, 코드 또는 설명으로 검색"
          }
        />
      </div>

      {renderContent()}
    </div>
  );
}