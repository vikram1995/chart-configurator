import GraphSkeleton from './graphSkeleton';
import ChartDisplayCard from './chartDisplayCard';
import { useChartsQuery } from '@/hooks/queryHooks';


const skeletons = Array.from({ length: 10 }, (_, index) => (
    <GraphSkeleton key={index} />
));
const ChartGrid = () => {
    const {
        data: chartList,
        error,
        isLoading,
    } = useChartsQuery();

    if (error) {
        return (
            <div className='w-full h-full'> Error loading list</div>
        )
    }
    return (
        <div className='grid flex-1 scroll-mt-20 items-start gap-6 md:grid-cols-2 md:gap-6 xl:grid-cols-3 xl:gap-6 p-4'>
            {isLoading ? skeletons : chartList?.map(chart =>
                <ChartDisplayCard chart={chart} key={chart?.id} />
            )}
        </div>
    )
}
export default ChartGrid