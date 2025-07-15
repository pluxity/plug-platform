import React, { useMemo } from "react";
import { Card, CardContent } from "@plug/ui";
import { Button } from "@plug/ui";
import { FilterBar } from "@plug/ui";
import { useBuildingsSWR } from "@plug/common-services";
import { api } from "@plug/api-hooks";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { BuildingResponse } from "@plug/common-services";
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

export const Buildings: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const searchQuery = searchParams.get("query") || "";
  const pageSize = 8;

  const { data: buildings, isLoading, error, mutate } = useBuildingsSWR();
  const navigate = useNavigate();

  const filteredBuildings = useMemo(() => {
    if (!buildings) return [];
    
    return buildings.filter((building) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        building.facility.name.toLowerCase().includes(searchLower) ||
        building.facility.code.toLowerCase().includes(searchLower) ||
        (building.facility.description && 
         building.facility.description.toLowerCase().includes(searchLower))
      );
    });
  }, [buildings, searchQuery]);

  const paginatedBuildings = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredBuildings.slice(startIndex, startIndex + pageSize);
  }, [filteredBuildings, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredBuildings.length / pageSize);

  const handlePageChange = (page: number) => {
    setSearchParams({
      query: searchQuery,
      page: page.toString()
    });
  };

  const handleSearchChange = (value: string) => {
    setSearchParams({
      query: value,
      page: "1"
    });
  };

  const handleDeleteBuilding = async (buildingId: number) => {
    if (confirm("해당 빌딩을 삭제하시겠습니까?")) {
      try {
        await api.delete(`building/${buildingId}`);
        await mutate();
      } catch (err) {
        console.error("빌딩 삭제 오류:", err);
        alert("빌딩을 삭제하는 중 오류가 발생했습니다.");
      }
    }
  };

  const handleAddBuilding = () => {
    navigate("/admin/building/add");
  };

  const handleViewBuilding = (buildingId: number) => {
    navigate(`/admin/building/${buildingId}`);
  };

  const handleEditBuilding = (buildingId: number) => {
    navigate(`/admin/building/${buildingId}/edit`);
  };

  const getRandomColor = (seed: number) => {
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
    return colors[seed % colors.length];
  };

  const getInitial = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : "B";
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

  return (
    <div className="space-y-6">
      <div className="w-full">
        <FilterBar
          selects={[]}
          showSearchInput={true}
          searchValue={searchQuery}
          onSearch={handleSearchChange}
          searchPlaceholder="건물 이름, 코드 또는 설명으로 검색"
          className="mb-6"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">데이터를 불러오는 중...</div>
      ) : error ? (
        <div className="text-center text-red-500 p-8">
          데이터를 불러오는 중 오류가 발생했습니다.
        </div>
      ) : filteredBuildings.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-8">
            <p className="mb-4 text-gray-500">
              {searchQuery ? "검색 결과가 없습니다." : "등록된 건물이 없습니다."}
            </p>
            <Button variant="default" onClick={handleAddBuilding}>
              새 건물 추가
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedBuildings.map((building: BuildingResponse) => (
              <Card
                key={building.facility.id}
                className="group overflow-hidden transition-all duration-300 hover:shadow-lg"
                onClick={() => handleViewBuilding(building.facility.id)}
              >
                <div
                  className={`relative w-full h-40 ${getRandomColor(building.facility.id)}`}
                >
                  {building.facility.thumbnail?.url ? (
                    <img
                      src={building.facility.thumbnail.url}
                      alt={building.facility.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-6xl font-bold">
                      {getInitial(building.facility.name)}
                    </div>
                  )}

                  <div className="absolute inset-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <Button
                        size="sm"
                        className="bg-white/80 backdrop-blur-sm text-black hover:bg-white/90 rounded-full w-20 h-8 font-bold shadow-sm transition-all duration-300 hover:shadow-md"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewBuilding(building.facility.id);
                        }}
                      >
                        <span>상세 보기</span>
                      </Button>
                    </div>
                    <div className="absolute top-0 right-0 px-4 py-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full bg-white/70 backdrop-blur-sm hover:bg-white/90 border-transparent"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditBuilding(building.facility.id);
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
                            handleDeleteBuilding(building.facility.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">삭제</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold truncate">
                      {building.facility.name}
                    </h3>
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      {building.facility.code}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {building.facility.description || "-"}
                  </p>
                </div>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination className="mt-8">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                
                {renderPaginationLinks()}
                
                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
};