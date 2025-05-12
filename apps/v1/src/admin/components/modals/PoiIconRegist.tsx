import { Modal, Form, FormItem, Button, Input } from '@plug/ui';

type PoiIconRegistValue = Record<string, string | number | boolean> & {file?: File;};

export interface PoiIconRegistProps{
    isOpen: boolean;
    onClose: () => void;
}

export const PoiIconRegistModal = ({ isOpen, onClose }: PoiIconRegistProps) =>{
    const handleFinish = (values: PoiIconRegistValue) => {
        alert(`Submitted values: ${JSON.stringify(values)}`);
    };

    return(
        <Modal
            title="아이콘 등록"
            isOpen={isOpen}
            onClose={onClose}
            closeOnOverlayClick={false}
            contentClassName="w-100"
            overlayClassName="bg-black/50"
        >
            <Form<PoiIconRegistValue> onSubmit={handleFinish}>
                <FormItem name="poiIconRegistName" label='이름'>
                    <Input.Text />
                </FormItem>
                <FormItem name="poiIconRegistFile" label='일괄 등록 파일'>
                    <div>
                        <input type='file' name='file' accept=".xlsx, .xls, .csv" 
                            className="w-full text-sm border-1 border-gray-300 rounded-sm py-1 px-1 file:bg-gray-200 file:px-1 file:py-1 file:border-1 file:text-sm file:border-gray-300 file:rounded-sm file:cursor-pointer"
                        />
                    </div>
                </FormItem>
                <div className="mt-6 flex justify-center gap-2">
                    <Button onClick={onClose}>취소</Button>
                    <Button type="submit" color="primary">등록</Button>
                </div>
            </Form>
        </Modal>
    )
} 
