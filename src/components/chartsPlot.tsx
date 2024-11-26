import { useEffect, useState } from 'react'
import axios from "axios";
import API_ENDPOINTS from "@/config/urlConfig";
import ChartCard from './chartCard';
import { ChartConfig } from '@/chartConfigSchema';
const ChartsPlot = () => {
    const [chartList, setChartList] = useState<ChartConfig[]>([])
    const fetchCharts = async () => {
        try {
            const response = await axios.get(API_ENDPOINTS.charts.getAll);
            console.log("Charts:", response.data);
            setChartList(response?.data ?? [])
        } catch (error) {
            console.error("Error fetching charts:", error);
        }
    };

    useEffect(() => {
        fetchCharts()
    }, [])

    return (
        <div className='grid flex-1 scroll-mt-20 items-start gap-6 md:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:gap-6 p-4'>
            {chartList.map(chart =>
                <ChartCard chart={chart} key={chart?.id} />
            )}
        </div>


    )
}
export default ChartsPlot