import React from "react";
import axios from "axios";

import { useQueryClient } from "react-query";

import InfiniteScrollSelect from "./ui/infiniteScrollSelect";
import { dataSourceT } from "@/chartConfigSchema";
import API_ENDPOINTS from "@/config/urlConfig";
const FRED_API_KEY = import.meta.env.VITE_FRED_API_KEY;


interface DataSourceFieldProps {
    value: dataSourceT;
    onChange: (value: string) => void;
}

const DataSourceField: React.FC<DataSourceFieldProps> = ({ onChange, value }) => {
    const queryClient = useQueryClient();

    const fetchOptions = async (search: string, offset: number) => {
        const response = await axios.get(API_ENDPOINTS.dataSource.search, {
            params: {
                search_text: search || "economy",
                api_key: FRED_API_KEY,
                file_type: "json",
                limit: 20,
                offset,
            },
        });

        const options =
            response?.data?.seriess?.map((item: any) => ({
                label: item?.title || "Unknown Title",
                value: item?.id || "",
            })) || [];

        const hasMore = offset + options.length < (response?.data?.count || 0);

        return {
            options,
            hasMore,
        };
    };

    const loadOptions = async (search: string, loadedOptions: any[]) => {
        const result = await queryClient.fetchQuery(
            ["dataSourceOptions", search, loadedOptions.length],
            () => fetchOptions(search, loadedOptions.length),
        );

        return {
            options: result?.options || [],
            hasMore: result?.hasMore || false,
        };
    };


    return (
        <InfiniteScrollSelect loadOptions={loadOptions} onChange={onChange} value={value} placeHolder={"Search data source..."} />
    );
};

export default DataSourceField;
