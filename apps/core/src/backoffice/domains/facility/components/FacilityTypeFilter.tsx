
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
    <div className="flex items-centers justify-evenly rounded-sm gap-1 mb-6 py-1 ">
      <div
        className={`
          relative px-4 py-2 cursor-pointer transition-all duration-200 rounded-md w-full flex justify-center
          ${
            isAllSelected
              ? "text-primary-foreground"
              : "text-secondary-700 hover:bg-secondary-200"
          }
        `}
        onClick={() => {
          selectedTypes.forEach((type) => onTypeToggle(type));
        }}
      >
        <div className="flex items-center gap-2">
          <span className={`${isAllSelected ? "font-semibold" : ""}`}>
            전체 보기
          </span>
          <span
            className={`
            inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-lg text-xs 
            ${
              isAllSelected
                ? "bg-primary-600 text-white font-semibold"
                : "bg-secondary-400 text-secondary-700"
            }
          `}
          >
            {totalCount}
          </span>
          {isAllSelected ? (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-full"></div>
          ) : (<div className="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary-400 rounded-full"></div>)}
        </div>
      </div>

      {availableTypes.map((type) => {
        const isSelected = selectedTypes.includes(type);
        const count = facilityCount[type] || 0;
        const displayName = domainUtils.getConfig(type).displayName;

        return (
          <div
            key={type}
            className={`
              relative px-4 py-2 cursor-pointer transition-all duration-200 rounded-md w-full flex justify-center
              ${
                isSelected
                  ? "text-primary-foreground"
                  : "text-secondary-700 hover:bg-secondary-200"
              }
            `}
            onClick={() => onTypeToggle(type)}
          >
            <div className="flex items-center gap-2">
              <span className={`${isSelected ? "font-semibold" : ""}`}>{displayName}</span>
              {showCounts && (
                <span
                  className={`
                  inline-flex items-center justify-center min-w-[16px] h-5 px-2 rounded-lg text-xs font-semibold
                  ${
                    isSelected
                      ? "bg-primary-600 text-white"
                      : "bg-secondary-400 text-secondary-700"
                  }
                `}
                >
                  {count}
                </span>
              )}
            </div>
            {isSelected? (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-full"></div>
            ) : (<div className="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary-400 rounded-full"></div>)}
          </div>
        );
      })}
    </div>
  );
};

export default FacilityTypeFilter;