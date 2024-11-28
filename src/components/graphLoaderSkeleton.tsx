import React from 'react'
import GraphSkeleton from './graphSkeleton'

function GraphLoaderSkeleton() {
    return (
        <div className="grid flex-1 scroll-mt-20 items-start gap-6 md:grid-cols-2 md:gap-6 xl:grid-cols-3 xl:gap-6 mt-6">
            {Array.from({ length: 5 }, (_, index) => <GraphSkeleton key={index} />)}
        </div>
    )
}

export default GraphLoaderSkeleton