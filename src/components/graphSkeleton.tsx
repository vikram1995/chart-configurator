
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const GraphSkeleton = () => {
    return (
        <Card className="relative">
            {/* Header Skeleton */}
            <CardHeader className="flex justify-between items-center pb-4">
                {/* Title Skeleton */}
                <Skeleton className="h-6 w-32" />

                {/* Tabs and Buttons Skeleton */}
                <div className="flex items-center space-x-4">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-8" />
                    <Skeleton className="h-6 w-8" />
                </div>
            </CardHeader>

            {/* Graph Skeleton */}
            <CardContent>
                <div className="w-full h-60">
                    <Skeleton className="w-full h-full" />
                </div>
            </CardContent>
        </Card>
    );
};

export default GraphSkeleton;
