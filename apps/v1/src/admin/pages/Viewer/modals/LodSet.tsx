import { Modal, Select, Button, Input } from '@plug/ui';
export interface PoiBatRegistProps{
    isOpen: boolean;
    onClose: () => void;
}

export const LodSetModal = ({ isOpen, onClose }: PoiBatRegistProps) =>{

    return(
        <Modal
            title="LOD 설정"
            isOpen={isOpen}
            onClose={onClose}
            closeOnOverlayClick={false}
            contentClassName="w-300"
            overlayClassName="bg-black/50"
        >
            <form>
                <table>
                    <tbody>
                        <tr>
                            <th>최장거리 설정</th>
                            <td className="border border-gray-300 p-2">
                                <Button type="button" >현재화면 기준</Button>
                                <Input.Text />

                            </td>
                            <th>LOD 레벨수</th>
                            <td>
                                <Select id=''>
                                    <Select.Trigger placeholder="LOD선택" />
                                    <Select.Content> 
                                        <Select.Item value="3">3단계</Select.Item>
                                        <Select.Item value="4">4단계</Select.Item>
                                        <Select.Item value="5">5단계</Select.Item>
                                    </Select.Content>
                                </Select>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
        </Modal>
    )
} 
