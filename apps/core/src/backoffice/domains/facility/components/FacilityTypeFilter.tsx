import React from 'react';
import { domainUtils, FacilityType } from '@plug/common-services';
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
  const availableTypes = domainUtils.getAllDomains();
  const showCounts = !isLoading;

  const totalCount = Object.values(facilityCount).reduce((sum: number, count: number) => sum + count, 0);
  const isAllSelected = selectedTypes.length === 0;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div
        className={`
      inline-flex items-center gap-2 px-3 py-1.5 rounded-full cursor-pointer transition-all duration-200
      border text-xs font-medium
      ${
          isAllSelected
            ? "bg-white text-primary-800 font-semibold border-2 border-primary-700"
            : "bg-white text-secondary-700 border-secondary-500 hover:border-primary-400 hover:bg-primary-100"
        }
    `}
        onClick={() => {
          selectedTypes.forEach((type) => onTypeToggle(type));
        }}
      >
        <span>전체 보기</span>
        <span
          className={`
        inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-semibold
        ${
            isAllSelected
              ? "bg-primary-700 text-white"
              : "bg-secondary-300 text-secondary-600"
          }
      `}
        >
      {totalCount}
    </span>
      </div>

      {availableTypes.map((type) => {
        const isSelected = selectedTypes.includes(type);
        const count = facilityCount[type] || 0;
        const displayName = domainUtils.getConfig(type).displayName;

        return (
          <div
            key={type}
            className={`
          inline-flex items-center gap-2 px-3 py-1.5 rounded-full cursor-pointer transition-all duration-200
          border text-xs font-medium
          ${
              isSelected
                ? "bg-white text-primary-800 font-semibold border-2 border-primary-700"
                : "bg-white text-secondary-700 border-secondary-500 hover:border-primary-300 hover:bg-primary-50"
            }
        `}
            onClick={() => onTypeToggle(type)}
          >
            <span>{displayName}</span>
            {showCounts && (
              <span
                className={`
              inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-semibold
              ${
                  isSelected
                    ? "bg-primary-700 text-white"
                    : "bg-secondary-300 text-secondary-600"
                }
            `}
              >
            {count}
          </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default FacilityTypeFilter;