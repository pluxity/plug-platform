import { useEffect, useState } from "react";
import {Card, Button, Pagination} from "@plug/ui";
import { useNavigate } from "react-router-dom";
import {fetchStations} from "@plug/v1/admin/pages/facility/api/station";
import {CardFooter, CardHeader, CardTitle} from "../../../../../../../packages/ui/src/components/Card/Card";
import {StateInfoWrapper} from "@plug/v1/admin/components/boundary/StateInfoWrapper";
import {useModal} from "@plug/v1/admin/components/hook/useModal";
import {FacilityModal} from "@plug/v1/admin/pages/facility/component/FacilityModal";
import {Station} from "@plug/v1/admin/pages/facility/types/facility";

export default function FacilitiesPage() {
    const navigate = useNavigate();
    const [stations, setStations] = useState<Station[]>([]);
    const [error, setError] = useState<Error | null>(null);
    const {isOpen, openModal, closeModal} = useModal();

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    
    useEffect(() => {
        const loadStations = async () => {
            try {
                const response = await fetchStations();
                setStations(response.data);
            } catch (err) {
                setError(err as Error);
            }
        };
        loadStations();
    }, []);

    if (error) return <StateInfoWrapper preset={"defaultError"}/>;
    if (!stations?.length) return <StateInfoWrapper preset={"emptyTable"}/>;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentStations = stations.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(stations.length / itemsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className='mt-4  h-[90%]'>
            <div className='ml-auto flex gap-1 w-24'>
                <Button 
                    color='primary'
                    className='bg-primary-150 text-primary-700 font-semibold hover:bg-primary-200'
                    onClick={() => openModal('create')}
                >
                    등록
                </Button>
            </div>
            <div className='flex flex-col gap-6 mt-2.5'>
                <div className='grid grid-cols-4 gap-4'>
                    {currentStations.map((station) => (
                        <Card 
                            key={station.facility?.id} 
                            className="w-full hover:shadow-md transition-shadow duration-200"
                            onClick={() => navigate(`/admin/dashboard/facility/${station.facility.id}`)}
                        >
                            <div className="w-full h-[150px] bg-gray-100 rounded-t-lg overflow-hidden">
                                <img
                                    src={station.facility?.thumbnail?.url ?? null}
                                    alt={station.facility?.name}
                                    className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
                                />
                            </div>
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold">
                                    {station.facility?.name}
                                </CardTitle>
                            </CardHeader>
                            <CardFooter className="flex">
                                <Button 
                                    size="small" 
                                    className='rounded-r-none hover:bg-primary-50'
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/admin/dashboard/facility/${station.facility?.id}`);
                                    }}
                                >
                                    도면 관리
                                </Button>
                                <Button 
                                    size="small" 
                                    className="rounded-none border-x border-x-slate-300 hover:bg-primary-50"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/admin/viewer/${station.facility?.id}`);
                                    }}
                                >
                                    공간 관리
                                </Button>
                                <Button 
                                    size="small" 
                                    className='rounded-l-none hover:bg-primary-50'
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/service/${station.facility?.id}`);
                                    }}
                                >
                                    3D 뷰어
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
                
                <div className="flex justify-center">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
            <FacilityModal
                isOpen={isOpen}
                onClose={closeModal}
                onSuccess={closeModal}
            />
        </div>
    );
}