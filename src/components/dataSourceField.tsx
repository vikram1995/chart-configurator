import React from "react";
import axios from "axios";

import InfiniteScrollSelect from "./ui/infiniteScrollSelect";
import { dataSourceT } from "@/chartConfigSchema";
import API_ENDPOINTS from "@/config/urlConfig";
const FRED_API_KEY = import.meta.env.VITE_FRED_API_KEY;


interface DataSourceFieldProps {
    value: dataSourceT;
    onChange: (value: string) => void;
}

const DataSourceField: React.FC<DataSourceFieldProps> = ({ onChange, value }) => {

    const loadOptions = async (search: string, loadedOptions: any[]) => {
        try {
            const response = await axios.get(API_ENDPOINTS.dataSource.search, {
                params: {
                    search_text: search || "economy", // Fallback for empty search
                    api_key: FRED_API_KEY,
                    file_type: "json",
                    limit: 20, // Fetch 20 results at a time
                    offset: loadedOptions.length,
                }
            });

            const options = response?.data?.seriess?.map((item: any) => ({
                label: item?.title || "Unknown Title", // Fallback for missing titles
                value: item?.id || "", // Fallback for missing IDs
            })) || [];

            // Check if more results exist
            const hasMore = loadedOptions.length + options.length < (response?.data?.count || 0);

            return {
                options,
                hasMore,
            };
        } catch (error) {
            console.error("Error loading options:", error);

            // Return an empty array and hasMore as false to stop further loading
            return {
                options: [],
                hasMore: false,
            };
        }
    };

    return (
        <InfiniteScrollSelect loadOptions={loadOptions} onChange={onChange} value={value} placeHolder={"Search data source..."} />
    );
};

export default DataSourceField;
