import { useNavigate } from 'react-router-dom';

import { FacilityResponse, domainUtils, FacilityType } from '@plug/common-services';

import ThumbnailHoverButtons from './ThumbnailHoverButtons';

import React from 'react';

import { Card, CardHeader, CardTitle, CardContent, CardAction, Badge } from '@plug/ui';
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
  
  const displayType = (facilityType ? facilityType : 'BUILDING') as FacilityType;
  const typeConfig = domainUtils.getConfig(displayType);

  const handleCardClick = () => {
    navigate(`/admin/facility/${facility.id}`, {
      state: { 
        facilityType: displayType, 
        facilityData: facility 
      }
    });
  };

  const handleView = () => {
    navigate(`/admin/facility/${facility.id}`, {
      state: { 
        facilityType: displayType, 
        facilityData: facility 
      }
    });
  };

  const handleIndoorEdit = () => {
    navigate(`/admin/facility/${facility.id}/indoor`, {
      state: { 
        facilityType: displayType, 
        facilityData: facility 
      }
    });
  };

  // 실내 지도 보기 (편집 모드가 아닌 앱 메인 지도 전환)
  const handleIndoorView = () => {
    // 메인 앱 영역('/') 로 이동하면서 state 로 시설 선택 전달 (URL 깔끔 유지)
    navigate('/', {
      state: {
        facilityId: facility.id,
        facilityType: displayType,
        mode: 'indoor'
      }
    });
  };

  return (
    <Card className="duration-200 pt-4">
      <CardHeader 
        className="cursor-pointer" 
        onClick={handleCardClick}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold text-gray-900 truncate flex">
              {facility.name}
              <Badge className="ml-2 rounded-full bg-primary-300 text-primary-900 border ">
                {typeConfig?.displayName || '알 수 없음'}
              </Badge>
            </CardTitle>
          </div>
          <CardAction className="self-center">
            <code className="px-2 py-1 text-xs font-mono bg-secondary-500/70 text-gray-700 rounded">
              {facility.code}
            </code>
          </CardAction>
        </div>
      </CardHeader>

      <CardContent className=" pt-1 pb-3">
        <div>
          <div className="relative group">
            {facility.thumbnail?.url ? (
              <div className="relative overflow-hidden rounded-md border">
                <img
                  src={facility.thumbnail.url}
                  alt={`${facility.name} 썸네일`}
                  className="w-full h-48 object-cover transition-transform duration-200 group-hover:scale-105"
                />
                <ThumbnailHoverButtons
                  onView={handleView}
                  onIndoorView={handleIndoorView}
                  onIndoorEdit={handleIndoorEdit}
                  onDelete={onDelete && facilityType ? () => onDelete(facility.id, facilityType) : undefined}
                  facilityName={facility.name}
                />
              </div>
            ) : (
              <div className="relative w-full h-48 bg-gradient-to-br from-blue-500 to-purple-600 rounded-md border flex items-center justify-center group">
                <span className="text-white text-4xl font-bold">
                  {facility.name.charAt(0).toUpperCase()}
                </span>
                <ThumbnailHoverButtons
                  onView={handleView}
                  onIndoorView={handleIndoorView}
                  onIndoorEdit={handleIndoorEdit}
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
