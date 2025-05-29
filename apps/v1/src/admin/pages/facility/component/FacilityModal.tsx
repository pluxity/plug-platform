import { Modal, Form, FormItem, Button, Input, Select } from '@plug/ui';
import React from 'react';
import { useLinesSWR } from '@plug/common-services';
import { FacilityModalProps } from '../types/facility';
import {FileUploadField} from "@plug/v1/admin/pages/facility/component/FileUploadField";
import {useFacility} from "@plug/v1/admin/pages/facility/hook/useFacility";
import {useFloorInfo} from "@plug/v1/admin/pages/facility/hook/useFloorInfo";

export const FacilityModal = ({ isOpen, onClose, onSuccess }: FacilityModalProps) => {
    const {
        fileError,
        isLoading,
        files,
        isUploading,
        handleFileUpload,
        handleFinish,
        resetForm
    } = useFacility({ onClose, onSuccess });

    const { data: lines } = useLinesSWR();
    const { floors, error} = useFloorInfo();

    const openFilePicker = (type: 'model' | 'thumbnail') => {
        const fileInput = document.getElementById(`${type}-file`);
        if (fileInput) fileInput.click();
    };

    return (
        <Modal
            title="도면 등록"
            isOpen={isOpen}
            onClose={isLoading ? undefined : resetForm}
            closeOnOverlayClick={false}
        >
            <div className="p-4">
                {fileError && (
                    <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md">
                        {fileError.message}
                    </div>
                )}

                <Form onSubmit={handleFinish}>
                    <FormItem name="name" label="도면 이름" required>
                        <Input.Text placeholder="도면 이름을 입력하세요" />
                    </FormItem>

                    <FormItem name="code" label="도면 코드" required>
                        <Input.Text placeholder="도면 코드를 입력하세요" />
                    </FormItem>

                    <FormItem name="description" label="도면 설명" required>
                        <Input.Text placeholder="도면 설명을 입력하세요" />
                    </FormItem>

                    <FileUploadField
                        type="model"
                        label="3D 모델 파일"
                        fileState={files.model}
                        isUploading={isUploading}
                        onChange={(e) => handleFileUpload(e, 'model')}
                        onOpenPicker={openFilePicker}
                    />

                    <FileUploadField
                        type="thumbnail"
                        label="썸네일 파일"
                        fileState={files.thumbnail}
                        isUploading={isUploading}
                        onChange={(e) => handleFileUpload(e, 'thumbnail')}
                        onOpenPicker={openFilePicker}
                    />

                    <FormItem name="floorId" label="층 정보" required>
                        <Select disabled={isLoading}>
                            <Select.Trigger />
                            <Select.Content>
                                {isLoading ? (
                                    <Select.Item value="">
                                        로딩 중...
                                    </Select.Item>
                                ) : error ? (
                                    <Select.Item value="">
                                        층 정보를 불러오는데 실패했습니다
                                    </Select.Item>
                                ) : floors && floors.length > 0 ? (
                                    floors.map((floor) => (
                                        <Select.Item
                                            key={floor.floorId}
                                            value={floor.floorId}
                                        >
                                            {floor.displayName}
                                        </Select.Item>
                                    ))
                                ) : (
                                    <Select.Item value="">
                                        사용 가능한 층 정보가 없습니다
                                    </Select.Item>
                                )}
                            </Select.Content>
                        </Select>
                    </FormItem>


                    <FormItem name="lineId" label="해당호선" required>
                        <Select>
                            <Select.Trigger />
                            <Select.Content>
                                {lines?.map((line) => (
                                    <Select.Item key={line.id} value={String(line.id)}>
                                        {line.name}
                                    </Select.Item>
                                ))}
                            </Select.Content>
                        </Select>
                    </FormItem>

                    <div className="mt-6 flex justify-center gap-2">
                        <Button
                            type="button"
                            onClick={resetForm}
                            disabled={isLoading}
                        >
                            취소
                        </Button>
                        <Button
                            type="submit"
                            color="primary"
                            disabled={isLoading}
                            isLoading={isLoading}
                        >
                            등록
                        </Button>
                    </div>
                </Form>
            </div>
        </Modal>
    );
};