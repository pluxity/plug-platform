import TimeDisplay from "./TimeDisplay";
import HeaderEnvInfo from "./HeaderEnvInfo";
import { useParams } from 'react-router-dom';

const Header = () => {
    const { stationId } = useParams<{ stationId: string }>();
    const parsedStationId = stationId ? stationId : '1';

    return (
        <header className="absolute top-0 left-0 w-full h-16 px-6 flex items-center justify-between bg-primary-400/20 backdrop-blur-xs text-white z-10">
            <div className="flex items-center gap-2">
                <img
                    src="/assets/logo.png"
                    alt="부산교통공사 로고"
                    className="w-10 h-10 rounded-full"
                />
                <div className="text-2xl font-bold tracking-tight">부산교통공사</div>
            </div>
            
            <div className="absolute left-1/2 transform -translate-x-1/2">
                <TimeDisplay />
            </div>
            
            <div className="flex items-center gap-4">
                <HeaderEnvInfo stationId={parsedStationId} />
            </div>        
        </header>
    );
};

export default Header;
