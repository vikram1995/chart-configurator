import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import ChartDisplayCard from './chartDisplayCard';
import { useChartsQuery } from '@/hooks/queryHooks';
import GraphLoaderSkeleton from './skeletonLoader/graphLoaderSkeleton';
import GraphSkeleton from './skeletonLoader/graphSkeleton';

const ChartGrid: React.FC = () => {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isLoading,
        error,
    } = useChartsQuery();

    if (error) {
        return <div className="w-full h-full">Error loading list</div>;
    }

    const charts = data?.pages?.flatMap((page) => page.charts) || [];


    if (charts?.length === 0) {
        return <div className='flex flex-col justify-center h-[90vh] items-center'><span className="font-bold">Click "Add Chart" to create a new chart</span></div>
    }

    return (
        <div className="p-4">
            <InfiniteScroll
                dataLength={charts.length}
                next={fetchNextPage}
                hasMore={hasNextPage || false}
                loader={<GraphLoaderSkeleton />}
            >
                <div className="grid flex-1 scroll-mt-20 items-start gap-6 md:grid-cols-2 md:gap-6 xl:grid-cols-3 xl:gap-6">
                    {isLoading
                        ? Array.from({ length: 10 }, (_, index) => <GraphSkeleton key={index} />)
                        : charts.map((chart) => (
                            <ChartDisplayCard chart={chart} key={chart.id} />
                        ))}
                </div>
            </InfiniteScroll>
        </div>
    );
};

export default ChartGrid;
