import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardAction, Badge } from '@plug/ui';
import { FacilityResponse } from '@plug/common-services';
import { DOMAINS, FacilityType } from '@plug/common-services';
import { useNavigate } from 'react-router-dom';
import ThumbnailHoverButtons from './ThumbnailHoverButtons';

interface FacilityCardProps {
  facility: FacilityResponse;
  facilityType?: FacilityType;
  onDelete?: (id: number, facilityType: FacilityType) => void;
}

const FacilityCard: React.FC<FacilityCardProps> = ({
  facility,
  facilityType,
  onDelete
}) => {
  const navigate = useNavigate();
  
  const displayType = facilityType && facilityType in DOMAINS ? facilityType : 'building';
  const typeConfig = DOMAINS[displayType];

  const handleCardClick = () => {
    // 카드 클릭 시 상세보기 대신 편집 페이지로 이동
    navigate(`/admin/facility/${facility.id}`);
  };

  const handleEdit = () => {
    navigate(`/admin/facility/${facility.id}`);
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200 pt-4">
      <CardHeader 
        className="cursor-pointer" 
        onClick={handleCardClick}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold text-gray-900 truncate flex">
              {facility.name}
              <Badge variant="outline" className="ml-2">
                {typeConfig?.displayName || '알 수 없음'}
              </Badge>
            </CardTitle>
          </div>
          <CardAction>
            <code className="px-2 py-1 text-xs font-mono bg-gray-100 text-gray-700 rounded border">
              {facility.code}
            </code>
          </CardAction>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div>
          {/* 썸네일 또는 첫 글자 표시 */}
          <div className="relative group my-4">
            {facility.thumbnail?.url ? (
              // 썸네일이 있는 경우
              <div className="relative overflow-hidden rounded-md border">
                <img
                  src={facility.thumbnail.url}
                  alt={`${facility.name} 썸네일`}
                  className="w-full h-48 object-cover transition-transform duration-200 group-hover:scale-105"
                />
                {/* 호버 시 나타나는 버튼들 */}
                <ThumbnailHoverButtons
                  onEdit={handleEdit}
                  onDelete={onDelete && facilityType ? () => onDelete(facility.id, facilityType) : undefined}
                  facilityName={facility.name}
                />
              </div>
            ) : (
              // 썸네일이 없는 경우 - 첫 글자 표시
              <div className="relative w-full h-48 bg-gradient-to-br from-blue-500 to-purple-600 rounded-md border flex items-center justify-center group">
                <span className="text-white text-4xl font-bold">
                  {facility.name.charAt(0).toUpperCase()}
                </span>
                {/* 호버 시 나타나는 버튼들 */}
                <ThumbnailHoverButtons
                  onEdit={handleEdit}
                  onDelete={onDelete && facilityType ? () => onDelete(facility.id, facilityType) : undefined}
                  facilityName={facility.name}
                />
              </div>
            )}
          </div>
        </div>
      </CardContent>

    </Card>
  );
};

export default FacilityCard;
