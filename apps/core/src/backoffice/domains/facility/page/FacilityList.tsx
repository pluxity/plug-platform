import React, { useState, useEffect } from 'react';
import { Button } from '@plug/ui';
import { 
  FacilityResponse, 
  FacilityType
} from '@plug/common-services';
import { PageContainer } from '@/backoffice/common/view/layouts';
import FacilityCard from '../components/FacilityCard';
import FacilityTypeFilter from '../components/FacilityTypeFilter';
import Pagination from '../components/Pagination';
import { CreateFacilityModal } from '../components/CreateFacilityModal';
import { useFacilityData } from '../hooks/useFacilityData';

const ITEMS_PER_PAGE = 8;

const FacilityList: React.FC = () => {
  const [selectedTypes, setSelectedTypes] = useState<FacilityType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { 
    isLoading, 
    error, 
    deleteFacility: deleteFacilityFromStore,
    getAllFacilities,
    refetch
  } = useFacilityData();

  const handleFacilityDelete = async (id: number, facilityType: FacilityType): Promise<void> => {
    await deleteFacilityFromStore(id, facilityType);
  };

  const allFacilities = getAllFacilities;

  const filteredFacilities = allFacilities.filter((facilityWithType: FacilityResponse & { facilityType: FacilityType }) => {
    const { facilityType, ...facility } = facilityWithType;
    
    const matchesSearch = searchTerm === '' || 
      facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      facility.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (facility.description && facility.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(facilityType);

    return matchesSearch && matchesType;
  });

  const totalPages = Math.ceil(filteredFacilities.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedFacilities = filteredFacilities.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const handleTypeToggle = (type: FacilityType) => {
    setSelectedTypes(prev => {
      const newTypes = prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type];
      setCurrentPage(1);
      return newTypes;
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleCreateSuccess = () => {
    refetch();
  };

  const handleDelete = async (id: number, facilityType: FacilityType) => {
    try {
      await handleFacilityDelete(id, facilityType);
    } catch (error) {
      console.error('Failed to delete facility:', error);
    }
  };

  const loading = isLoading;
  const hasError = !!error;

  if (loading) {
    return (
      <PageContainer title="시설 관리">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">시설 목록을 불러오는 중...</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (hasError) {
    return (
      <PageContainer title="시설 관리">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-600 mb-4">시설 데이터를 불러오는 중 오류가 발생했습니다.</p>
            <Button onClick={() => window.location.reload()}>
              다시 시도
            </Button>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="시설 관리">
      <div className="space-y-6">
        <div className="mb-6">
          <FacilityTypeFilter 
            selectedTypes={selectedTypes}
            onTypeToggle={handleTypeToggle}
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="시설명, 코드 또는 설명으로 검색..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            새 시설 등록
          </Button>
        </div>

        {paginatedFacilities.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">표시할 시설이 없습니다.</p>
            {(searchTerm || selectedTypes.length > 0) && (
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedTypes([]);
                  setCurrentPage(1);
                }}
              >
                필터 초기화
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
              {paginatedFacilities.map((facilityWithType: FacilityResponse & { facilityType: FacilityType }) => {
                const { facilityType, ...facility } = facilityWithType;
                return (
                  <FacilityCard
                    key={facility.id}
                    facility={facility}
                    facilityType={facilityType}
                    onDelete={handleDelete}
                  />
                );
              })}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              itemsPerPage={ITEMS_PER_PAGE}
              totalItems={filteredFacilities.length}
            />
          </>
        )}
      </div>

      <CreateFacilityModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />
    </PageContainer>
  );
};

export default FacilityList;
