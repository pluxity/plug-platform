import { Card, CardContent } from '@plug/ui';

import React from 'react';
interface ThumbnailViewProps {
  imageUrl?: string;
  title?: string;
  subtitle?: string;
  className?: string;
}

export const ThumbnailView: React.FC<ThumbnailViewProps> = ({
  imageUrl,
  title,
  subtitle,
  className = '',
}) => {
  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardContent className="p-0">
        <div className="aspect-square bg-gray-100 flex items-center justify-center">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={title || "Thumbnail"}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center">
              <div className="text-4xl text-gray-400 mb-2">📷</div>
              <p className="text-xs text-gray-500">이미지 없음</p>
            </div>
          )}
        </div>
        {(title || subtitle) && (
          <div className="p-3">
            {title && (
              <p className="text-sm font-medium truncate" title={title}>
                {title}
              </p>
            )}
            {subtitle && (
              <p className="text-xs text-gray-500 truncate" title={subtitle}>
                {subtitle}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
