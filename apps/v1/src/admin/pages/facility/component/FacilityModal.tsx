import { Modal, Form, FormItem, Button, Input, Select } from '@plug/ui';
import React from 'react';
import { useLinesSWR } from '@plug/common-services';
import {FileUploadField} from "@plug/v1/admin/pages/facility/component/FileUploadField";
import {useFacility} from "@plug/v1/admin/pages/facility/hook/useFacility";

type FacilityModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
};

export const FacilityModal = ({ isOpen, onClose, onSuccess }: FacilityModalProps) => {
    const {
        fileError,
        isLoading,
        files,
        isUploading,
        handleFileUpload,
        handleFinish,
        resetForm,
        modelData,
    } = useFacility({ onClose, onSuccess });

    const { data: lines } = useLinesSWR();

    const openFilePicker = (type: 'model' | 'thumbnail') => {
        const fileInput = document.getElementById(`${type}-file`);
        if (fileInput) fileInput.click();
    };

    return (
        <Modal
            title="역사 정보 등록"
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
                    <FormItem name="name" label="역사 이름" required>
                        <Input.Text placeholder="역사 이름을 입력하세요" />
                    </FormItem>

                    <FormItem name="code" label="역사 코드" required>
                        <Input.Text placeholder="역사 코드를 입력하세요" />
                    </FormItem>

                    <FormItem name="externalCode" label="NFLUX STATION ID" required>
                        <Input.Text placeholder="NFLUX STATION ID를 입력하세요" />
                    </FormItem>

                    <FormItem name="linesId" label="호선 선택" required>
                        <Select type="multiple" defaultValue={[]}>
                            <Select.Trigger/>
                            <Select.Content>
                                {lines?.map((line) => (
                                    <Select.Item key={line.id} value={String(line.id)}>
                                        {line.name}
                                    </Select.Item>
                                ))}
                            </Select.Content>
                        </Select>
                    </FormItem>

                    <FormItem name="description" label="역사 설명" required>
                        <Input.Text placeholder="역사 설명을 입력하세요" />
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

                    <FormItem name="floors" label="층 정보" required>
                        <Select disabled={isLoading} type={"multiple"}>
                            <Select.Trigger />
                            <Select.Content>
                                {modelData.map((item) => {
                                    const val = JSON.stringify({
                                        "name": item.displayName,
                                        "floorId": item.floorId
                                    })

                                    return (<Select.Item key={item.floorId} value={val}>
                                        {item.displayName}
                                    </Select.Item>
                                    )
                                })}
                            </Select.Content>
                        </Select>
                    </FormItem>


                    <FormItem name="linesId" label="해당호선" required>
                        <Select type="multiple" defaultValue={[]}>
                            <Select.Trigger/>
                            <Select.Content>
                                {lines?.map((line) => (
                                    <Select.Item key={line.id} value={String(line.id)}>
                                        {line.name}
                                    </Select.Item>
                                ))}
                            </Select.Content>
                        </Select>
                    </FormItem>

                    <FormItem name="externalCode" label="외부 코드" required>
                        <Input.Text placeholder="외부 코드를 입력하세요" />
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