import { Dialog, Form, FormItem, Button } from '@plug/ui';

type PoiBatRegistValue = Record<string, string | number | boolean> & {file?: File;};

export interface PoiBatRegistProps{
    isOpen: boolean;
    onClose: () => void;
}

export const LodSetDialog = ({ isOpen, onClose }: PoiBatRegistProps) =>{
    const handleFinish = (values: PoiBatRegistValue) => {
        alert(`Submitted values: ${JSON.stringify(values)}`);
    };

    return(
        <Dialog
          isOpen={isOpen}
          onClose={onClose}
          closeOnOverlayClick={false}
          overlayClassName="bg-black/50"
        >
          <div className="bg-white p-6 rounded-lg shadow-lg w-100">
            <h2 className="text-lg font-semibold mb-4">일괄 등록</h2>
            <Form<PoiBatRegistValue> onSubmit={handleFinish}>
                <FormItem name="poiBatRegistFile" label='일괄 등록 파일'>
                    <div>
                        <input type='file' name='file' accept=".xlsx, .xls, .csv" 
                            className="w-full text-sm border-1 border-gray-400 rounded-sm py-1 px-1 file:bg-gray-200 file:px-1 file:py-1 file:border-1 file:text-sm file:border-gray-400 file:rounded-sm file:cursor-pointer"
                        />
                    </div>
                
                </FormItem>
                <div className="mt-6 flex justify-center gap-2">
                    <Button onClick={onClose}>취소</Button>
                    <Button type="submit" color="primary">등록</Button>
                </div>
            </Form>
          </div>
        </Dialog>
    )
} 
