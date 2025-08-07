import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Textarea, Card, CardHeader, CardTitle, CardContent } from '@plug/ui';
import { FileUploadComponent } from '@/backoffice/common/components/FileUploadComponent';
import { FileResponse } from '@plug/common-services';

interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  file?: File;
  uploadedAt?: string;
}

// FileResponse를 FileItem으로 변환하는 함수
const fileResponseToFileItem = (fileResponse: FileResponse): FileItem => ({
  id: fileResponse.id.toString(),
  name: fileResponse.originalFileName,
  size: 0, // FileResponse에 size 정보가 없으므로 0으로 설정
  type: fileResponse.contentType,
  url: fileResponse.url,
  uploadedAt: fileResponse.createdAt,
});

// FileItem을 FileResponse 형태로 변환하는 함수
const fileItemToFileResponse = (fileItem: FileItem): Partial<FileResponse> => ({
  id: parseInt(fileItem.id),
  originalFileName: fileItem.name,
  contentType: fileItem.type,
  url: fileItem.url,
  createdAt: fileItem.uploadedAt || new Date().toISOString(),
});

const boundarySchema = z.object({
  boundary: z.string().min(1, '경계 데이터는 필수입니다'),
  version: z.string().optional(),
  description: z.string().optional(),
});

type BoundaryFormData = z.infer<typeof boundarySchema>;

interface BoundaryComponentProps {
  boundary?: string;
  version?: string;
  description?: string;
  files?: FileResponse[];
  onSave: (data: { 
    boundary: string; 
    version?: string; 
    description?: string;
    files?: FileResponse[];
  }) => Promise<void>;
  isLoading?: boolean;
}

export const BoundaryComponent: React.FC<BoundaryComponentProps> = ({
  boundary,
  version,
  description,
  files = [],
  onSave,
  isLoading = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<FileItem[]>(
    files.map(fileResponseToFileItem)
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<BoundaryFormData>({
    resolver: zodResolver(boundarySchema),
    defaultValues: {
      boundary: boundary || '',
      version: version || '',
      description: description || '',
    },
  });

  const onSubmit = async (data: BoundaryFormData) => {
    // FileItem을 FileResponse로 변환
    const convertedFiles = uploadedFiles.map(fileItem => ({
      ...fileItemToFileResponse(fileItem),
      // 실제 FileResponse에 필요한 추가 필드들
      fileStatus: 'ACTIVE',
      createdBy: 'current-user',
      updatedAt: new Date().toISOString(),
      updatedBy: 'current-user',
    })) as FileResponse[];

    await onSave({
      ...data,
      files: convertedFiles,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    reset();
    setUploadedFiles(files.map(fileResponseToFileItem));
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>경계 정보</CardTitle>
          <Button onClick={() => setIsEditing(true)} variant="outline">
            편집
          </Button>
        </CardHeader>
        <CardContent>
          {!boundary && uploadedFiles.length === 0 ? (
            <p className="text-gray-500">등록된 경계 정보가 없습니다.</p>
          ) : (
            <div className="space-y-6">
              {/* 기본 정보 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {version && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">도면 버전</span>
                    <p className="mt-1 text-sm text-gray-800">{version}</p>
                  </div>
                )}
                {description && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">설명</span>
                    <p className="mt-1 text-sm text-gray-800">{description}</p>
                  </div>
                )}
                <div>
                  <span className="text-sm font-medium text-gray-600">등록일</span>
                  <p className="mt-1 text-sm text-gray-800">
                    {files.length > 0 ? new Date(files[0].createdAt).toLocaleDateString() : new Date().toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">등록자</span>
                  <p className="mt-1 text-sm text-gray-800">
                    {files.length > 0 ? files[0].createdBy : 'build3d01'}
                  </p>
                </div>
              </div>

              {/* 첨부 파일 */}
              {uploadedFiles.length > 0 && (
                <div>
                  <span className="text-sm font-medium text-gray-600 mb-3 block">
                    첨부 파일 ({uploadedFiles.length}개)
                  </span>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {uploadedFiles.map((file) => (
                      <Card key={file.id} className="overflow-hidden">
                        <CardContent className="p-3">
                          {file.type.startsWith('image/') && file.url ? (
                            <div className="space-y-2">
                              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                                <img 
                                  src={file.url} 
                                  alt={file.name}
                                  className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                  onClick={() => window.open(file.url, '_blank')}
                                />
                              </div>
                              <div className="space-y-1">
                                <p className="text-xs font-medium truncate" title={file.name}>
                                  {file.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  이미지 파일
                                </p>
                                {file.uploadedAt && (
                                  <p className="text-xs text-gray-400">
                                    {new Date(file.uploadedAt).toLocaleDateString()}
                                  </p>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <div className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
                                   onClick={() => file.url && window.open(file.url, '_blank')}>
                                <div className="text-center">
                                  <div className="text-2xl text-gray-400 mb-1">📄</div>
                                  <p className="text-xs text-gray-600">{file.type.split('/').pop()?.toUpperCase()}</p>
                                </div>
                              </div>
                              <div className="space-y-1">
                                <p className="text-xs font-medium truncate" title={file.name}>
                                  {file.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {file.type}
                                </p>
                                {file.uploadedAt && (
                                  <p className="text-xs text-gray-400">
                                    {new Date(file.uploadedAt).toLocaleDateString()}
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* 경계 데이터 */}
              {boundary && (
                <div>
                  <span className="text-sm font-medium text-gray-600">경계 데이터</span>
                  <div className="mt-2 p-3 bg-gray-50 border rounded-lg">
                    <pre className="text-sm text-gray-800 whitespace-pre-wrap overflow-x-auto max-h-40 overflow-y-auto">
                      {boundary}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>경계 정보 편집</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* 기본 정보 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                도면 버전
              </label>
              <input
                {...register('version')}
                type="text"
                placeholder="예: 2024.12.13.134756"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                설명
              </label>
              <input
                {...register('description')}
                type="text"
                placeholder="경계 정보에 대한 설명"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* 파일 업로드 */}
          <div>
            <FileUploadComponent
              files={uploadedFiles}
              onFilesChange={setUploadedFiles}
              accept="image/*,.dwg,.dxf,.pdf,.json,.geojson"
              multiple={true}
              maxSize={50}
              title="도면 파일 업로드"
              description="이미지, CAD 파일, GeoJSON 등을 업로드하세요"
              showThumbnails={true}
            />
          </div>

          {/* 경계 데이터 입력 */}
          <div>
            <label className="block text-sm font-medium mb-2">
              경계 데이터 <span className="text-red-500">*</span>
            </label>
            <Textarea
              {...register('boundary')}
              placeholder="경계 데이터를 입력하세요 (GeoJSON, WKT 등)"
              rows={8}
              className="font-mono"
            />
            {errors.boundary && (
              <p className="text-red-500 text-sm mt-1">{errors.boundary.message}</p>
            )}
            <p className="text-gray-500 text-sm mt-1">
              GeoJSON, WKT 또는 다른 지리적 경계 형식을 입력하세요.
            </p>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
            >
              취소
            </Button>
            <Button 
              type="submit" 
              disabled={!isDirty || isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? '저장 중...' : '저장'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
