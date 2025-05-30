import React, { useEffect, useState } from "react";
import { Card, Button } from "@plug/ui";
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

    return (
        <div>
            <div className='flex'>
                <div className='ml-auto flex gap-1'>
                    <Button color='primary' onClick={() => openModal('create')}>등록</Button>
                </div>
            </div>
            <div className='mt-4 grid grid-cols-4 gap-4'>
                {stations?.map((station) => (
                    <Card key={station.facility?.id} className="w-full" onClick={() => navigate(`/admin/dashboard/facility/${station.facility.id}`)}>
                        <div className="w-full h-[200px] bg-gray-200 rounded-t-lg flex items-center justify-center">
                            <img
                                src={station.facility?.thumbnail?.url ?? ""}
                                alt={station.facility?.name}
                                className="w-full h-full object-cover rounded-t-lg"
                            />
                        </div>
                        <CardHeader>
                            <CardTitle>{station.facility?.name}</CardTitle>
                        </CardHeader>
                        <CardFooter className="flex justify-between">
                            <Button size="small" className='rounded-r-none'
                                    onClick={() => navigate(`/admin/dashboard/facility/${station.facility?.id}`)}>도면
                                관리</Button>
                            <Button size="small" className="rounded-none border-x border-x-slate-300"
                                    onClick={() => navigate(`/admin/dashboard/facility/${station.facility?.id}`)}>공간
                                관리</Button>
                            <Button size="small" className='rounded-l-none'
                                    onClick={() => navigate(`/admin/dashboard/facility/${station.facility?.id}`)}>3D
                                뷰어</Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
            <FacilityModal
                isOpen={isOpen}
                onClose={closeModal}
            />
        </div>
    );
}