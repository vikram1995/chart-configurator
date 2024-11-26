import { useEffect, useState } from 'react'
import axios from "axios";
import API_ENDPOINTS from "@/config/urlConfig";
import ChartCard from './chartCard';
import { useChartStore } from '@/stores';
import GraphSkeleton from './graphSkeleton';
const ChartsPlot = () => {
    const { chartList, setChartList } = useChartStore()
    const [loading, setLoading] = useState(true)

    const fetchCharts = async () => {
        try {
            const response = await axios.get(API_ENDPOINTS.charts.getAll);
            setChartList(response?.data?.charts ?? [])
        } catch (error) {
            console.error("Error fetching charts:", error);
        }
        setLoading(false)
    };

    useEffect(() => {
        fetchCharts()
    }, [])

    const skeletons = Array.from({ length: 10 }, (_, index) => (
        <GraphSkeleton key={index} />
    ));

    return (
        <div className='grid flex-1 scroll-mt-20 items-start gap-6 md:grid-cols-2 md:gap-6 xl:grid-cols-3 xl:gap-6 p-4'>

            {loading ? skeletons : chartList?.map(chart =>
                <ChartCard chart={chart} key={chart?.id} />
            )}

        </div>


    )
}
export default ChartsPlot