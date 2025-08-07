import React from 'react';
import { Badge } from '@plug/ui';
import { DOMAINS, FacilityType } from '@plug/common-services';
import { useFacilityData } from '../hooks/useFacilityData';

interface FacilityTypeFilterProps {
  selectedTypes: FacilityType[];
  onTypeToggle: (type: FacilityType) => void;
}

const FacilityTypeFilter: React.FC<FacilityTypeFilterProps> = ({
  selectedTypes,
  onTypeToggle
}) => {
  const { getFacilityCount, isLoading } = useFacilityData();
  const facilityCount = getFacilityCount;
  const availableTypes = Object.keys(DOMAINS) as FacilityType[];

  // 로딩 중일 때는 카운트를 표시하지 않음
  const showCounts = !isLoading;

  return (
    <div className="flex flex-wrap gap-2 mb-6">      
      {/* All 옵션 */}
      <Badge
        variant={selectedTypes.length === 0 ? "default" : "outline"}
        className={`cursor-pointer transition-colors ${
          selectedTypes.length === 0 
            ? "hover:bg-primary/90" 
            : "hover:bg-gray-100"
        }`}
        onClick={() => {
          // 모든 타입 선택 해제
          selectedTypes.forEach(type => onTypeToggle(type));
        }}
      >
        전체
        <span className="ml-1 text-xs">
          ({Object.values(facilityCount).reduce((sum: number, count: number) => sum + count, 0)})
        </span>
      </Badge>

      {/* 각 시설 타입별 필터 */}
      {availableTypes.map((type) => {
        const isSelected = selectedTypes.includes(type);
        const count = facilityCount[type] || 0;
        
        return (
          <Badge
            key={type}
            variant={isSelected ? "default" : "outline"}
            className={`cursor-pointer transition-colors py-1 ${
              isSelected 
                ? "hover:bg-primary/90" 
                : "hover:bg-gray-100"
            }`}
            onClick={() => onTypeToggle(type)}
          >
            {DOMAINS[type].displayName}
            {showCounts && <span className="ml-1 text-xs">({count})</span>}
          </Badge>
        );
      })}
    </div>
  );
};

export default FacilityTypeFilter;
