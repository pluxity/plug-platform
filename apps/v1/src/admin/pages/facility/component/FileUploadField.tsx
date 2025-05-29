import React from 'react';
import { Button, FormItem } from '@plug/ui';
import { FileState, FileType } from '../types/file';

interface FileUploadFieldProps {
    type: FileType;
    label: string;
    fileState: FileState;
    isUploading: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onOpenPicker: (type: FileType) => void;
}

export const FileUploadField: React.FC<FileUploadFieldProps> = ({
    type,
    label,
    fileState,
    isUploading,
    onChange,
    onOpenPicker
}) => (
    <FormItem name={`${type}Field`} label={label} required>
        <div className="border-2 border-dashed border-gray-300 rounded-md p-4">
            <input
                type="file"
                id={`${type}-file`}
                className="hidden"
                onChange={onChange}
                accept={type === 'model' ? '.glb,.gltf' : '.png,.jpeg'}
            />
            
            {!fileState.file ? (
                <div className="flex items-center">
                    <p className="flex-1 text-sm text-gray-500">
                        {type === 'model' ? 'GLB, GLTF 파일만 가능합니다.' : 'PNG, JPEG 파일만 가능합니다.'}
                    </p>
                    <Button
                        type="button"
                        color="secondary"
                        className="w-30"
                        onClick={() => onOpenPicker(type)}
                    >
                        파일 선택
                    </Button>
                </div>
            ) : (
                <div className="flex items-center justify-between w-full">
                    <span className="text-sm truncate max-w-xs">
                        {fileState.file.name} ({Math.round(fileState.file.size / 1024)} KB)
                    </span>
                    
                    {isUploading ? (
                        <div className="h-4 w-4 border-2 border-t-primary-500 rounded-full animate-spin" />
                    ) : fileState.fileId ? (
                        <div className="flex items-center gap-2">
                            <div className="text-green-500 text-xs">업로드 완료</div>
                            <Button
                                type="button"
                                color="secondary"
                                className="w-30"
                                onClick={() => onOpenPicker(type)}
                            >
                                변경
                            </Button>
                        </div>
                    ) : (
                        <Button
                            type="button"
                            color="secondary"
                            className="w-30"
                            onClick={() => onOpenPicker(type)}
                        >
                            변경
                        </Button>
                    )}
                </div>
            )}
        </div>
    </FormItem>
);