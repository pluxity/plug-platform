import { api } from "@plug/api-hooks";
import { useEffect, useState } from "react";
import type { Asset } from "../types/asset";
import AssetCard from "./AssetCard";

const AssetList = () => {
    const [assets, setAssets] = useState<Asset[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAssets = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await api.get<Asset[]>('assets');
                if (response && response.data) {
                    setAssets(response.data);
                } else {
                    setError('Failed to fetch assets');
                }
            } catch (err) {
                console.error('Error fetching assets:', err);
                setError('An error occurred while fetching assets');
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchAssets();
    }, []);

    if (isLoading) {
        return (
            <div className="asset-list p-4">
                <h2 className="text-lg font-bold mb-4">Asset List</h2>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-pulse text-gray-500">Loading assets...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="asset-list p-4">
                <h2 className="text-lg font-bold mb-4">Asset List</h2>
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            </div>
        );
    }    if (assets.length === 0) {
        return (
            <div className="asset-list p-4">
                <h2 className="text-lg font-bold mb-4">Asset List</h2>
                <div className="bg-gray-100 rounded-lg p-6 text-center">
                    <p className="text-gray-600">No assets found</p>
                </div>
            </div>
        );
    }
    
    return (
        <div className="asset-list p-4 ">
            <h2 className="text-lg font-bold mb-6">Asset List</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {assets.map(asset => (
                    <AssetCard key={asset.id} asset={asset} />
                ))}
            </div>
        </div>
    );
};

export default AssetList;