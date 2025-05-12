import { Tab, Button, Input, Select, Dropdown, Pagination } from '@plug/ui';
import { ViewerTable } from '../mocks/ViewerTable.mock';

interface ViewerTabContent {title: string;}
interface ViewerItem {name: string;}
type ContentType = 'poi' | 'text3d' | 'topology';

export const ViewerTabContent = ({ title }: ViewerTabContent) => {
    const renderSearchForm = () => (
        <form className="flex flex-col gap-2 my-2">
            <div className="flex items-center gap-2">
                <Select>
                    <Select.Trigger placeholder="대분류" />
                    <Select.Content>
                        <Select.Item value="대분류">대분류</Select.Item>
                    </Select.Content>
                </Select>
                <Select>
                    <Select.Trigger placeholder="중분류" />
                    <Select.Content>
                        <Select.Item value="중분류">중분류</Select.Item>
                    </Select.Content>
                </Select>
            </div>
            <Select>
                <Select.Trigger placeholder="POI명 보기" />
                <Select.Content>
                    <Select.Item value="POI명">POI명</Select.Item>
                </Select.Content>
            </Select>
            <div className="flex items-center gap-2">
                <Input.Text placeholder='POI명을 입력하세요.' className='w-76'/>
                <Button color='primary'>검색</Button>
            </div>
        </form>
    );

    const renderDataTable = (tabValue: 'alignment' | 'unassigned') => {
        const contentType = title.toLowerCase() as ContentType;
        const dataTable = ViewerTable[contentType]?.[tabValue];
        
        return (
            <div className="flex flex-col gap-4">
                <div className="flex flex-col h-full">
                    <table className="flex-1 border-t border-gray-200">
                        <tbody>
                            {dataTable.map((item: ViewerItem, index: number) => 
                                <tr key={index} className="flex items-center justify-between border-b border-gray-200 py-2">
                                    <td>{item.name}</td>
                                    <td>
                                        <Dropdown className="w-30">
                                            <Dropdown.Trigger className="flex justify-end w-full">
                                                <Button color="secondary">
                                                    관리
                                                </Button>
                                            </Dropdown.Trigger>
                                            <Dropdown.Content>
                                                <Dropdown.Item value="1번">1번</Dropdown.Item>
                                                <Dropdown.Item value="2번">2번</Dropdown.Item>
                                            </Dropdown.Content>
                                        </Dropdown>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <Pagination 
                        className="absolute bottom-0 flex items-center w-full" 
                        currentPage={1} 
                        totalPages={5} 
                        onPageChange={() => {}} 
                    />
                </div>
            </div>
        );
    };

    return (
        <Tab.Content value={title}>
            <Tab defaultValue="alignment">
                <Tab.List color='primary' className="text-sm whitespace-nowrap">
                    <Tab.Trigger value="alignment">배치</Tab.Trigger>
                    <Tab.Trigger value="unassigned">미배치</Tab.Trigger>
                </Tab.List>
                <Tab.Content value="alignment">
                    {renderSearchForm()}
                    {renderDataTable('alignment')}
                </Tab.Content>
                <Tab.Content value="unassigned">
                    {renderSearchForm()}
                    {renderDataTable('unassigned')}
                </Tab.Content>
            </Tab>
        </Tab.Content>
    );
}; 