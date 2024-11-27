import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Pencil, Trash, ChartColumnBig, ChartLine, RotateCw } from "lucide-react";
import { LineChart, BarChart, Bar, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { ChartConfig } from "@/chartConfigSchema";
import API_ENDPOINTS from "@/config/urlConfig";
import { calculateDateRange } from "@/lib/utils";
import { ChartConfigDialog } from "./chartConfigDialog";
import { useChartStore } from "@/stores";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "./ui/skeleton";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

const FRED_API_KEY = import.meta.env.VITE_FRED_API_KEY;

interface ChartDisplayCardProps {
    chart: ChartConfig;
}

const ChartDisplayCard: React.FC<ChartDisplayCardProps> = ({ chart }) => {
    const { title, type, yLabel, timeFrequency, lineStyle, dataSource, color, barStyle, id } = chart;

    const { toast } = useToast()
    const [chartData, setChartData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isFailedToLoadData, setIsFailedToLoadData] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [frequency, setFrequency] = useState<string>(timeFrequency || "1m");
    const [chartType, setChartType] = useState<string>(type || "line");
    const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

    const { setChartList } = useChartStore();

    const strokeDasharray = lineStyle === "dashed" ? "5 5" : lineStyle === "dotted" ? "2 2" : undefined;
    const barSize = barStyle === "thin" ? 10 : barStyle === "medium" ? 20 : barStyle === "thick" ? 30 : 20;

    const handleChartTypeChange = (type: string) => {
        setChartType(type);
    };

    const onDelete = async () => {
        try {
            const response = await axios.delete(API_ENDPOINTS.charts.update(id));
            if (response?.status === 200) {
                toast({
                    title: "Chart deleted successfully!"
                })
                setChartList(response.data.charts);
            }
            else {
                setError("Failed to delete chart.");
            }

        } catch (error) {
            console.error("Error deleting chart:", error);
            setError("Failed to delete chart.");
        }
    };

    const onEditClickHandler = () => {
        setIsFormOpen(true);
    };

    const editChart = async (updatedChart: ChartConfig) => {
        try {
            const response = await axios.put(API_ENDPOINTS.charts.update(id), updatedChart, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response?.status === 200) {
                setChartList(response.data.charts);
                toast({
                    title: "Chart updated successfully!"
                })
            } else {
                setError("Failed to update the chart");
            }

        } catch (error: any) {
            console.error("Error saving chart:", error.response?.data || error.message);
            setError("Failed to save chart");
        }
        setIsFormOpen(false);
    };

    const getChartData = async () => {
        const { startDate, endDate } = calculateDateRange(frequency);
        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.get(API_ENDPOINTS.dataSource.observations, {
                params: {
                    series_id: dataSource?.value,
                    api_key: FRED_API_KEY,
                    observation_start: startDate,
                    observation_end: endDate,
                    file_type: "json",
                },
            });

            const observations = response?.data?.observations || [];
            setChartData(observations);
            setIsFailedToLoadData(false)
            if (observations.length === 0) {
                setError("No data available.");
            }
        } catch (err) {
            console.error("Error fetching chart data:", err);
            setError("Failed to load chart data. Please try again.");
            setIsFailedToLoadData(true)
        } finally {
            setIsLoading(false);
        }
    };

    const handleTimeRangeChange = (range: string) => {
        setFrequency(range);
    };

    const handleRetry = () => {
        getChartData()
    }

    useEffect(() => {
        getChartData();
    }, [frequency, dataSource?.value]);

    useEffect(() => {
        if (error) {
            toast({
                variant: "destructive",
                title: error
            })
        }
    }, [error])

    return (
        <>
            <Card>

                <>
                    <div className="flex flex-row items-center w-full justify-between p-2">
                        {/* Chart Type Tabs */}
                        <Tabs value={chartType} onValueChange={handleChartTypeChange} className="hidden xxs:flex">
                            <TabsList>
                                <TabsTrigger value="line"><ChartLine size={16} /></TabsTrigger>
                                <TabsTrigger value="bar"><ChartColumnBig size={16} /></TabsTrigger>
                            </TabsList>
                        </Tabs>

                        {/* Time Frequency Tabs */}
                        <Tabs defaultValue={frequency} onValueChange={handleTimeRangeChange} className="flex">
                            <TabsList>
                                <TabsTrigger value="1d">1D</TabsTrigger>
                                <TabsTrigger value="1w">1W</TabsTrigger>
                                <TabsTrigger value="1m">1M</TabsTrigger>
                                <TabsTrigger value="1y">1Y</TabsTrigger>
                            </TabsList>
                        </Tabs>

                        {/* Edit and Delete Buttons */}
                        <div className="flex gap-2">
                            <Button size="icon" variant="outline" onClick={onEditClickHandler}>
                                <Pencil size={16} />
                                <span className="sr-only">Edit</span>
                            </Button>
                            <Button size="icon" variant="destructive" onClick={onDelete}>
                                <Trash size={16} />
                                <span className="sr-only">Delete</span>
                            </Button>
                        </div>
                    </div>

                    <Separator />

                    <CardContent className="p-2">
                        {
                            isLoading ? (
                                <ChartContainer config={{ value: { label: "value", color: color } }}>
                                    <Skeleton className="w-full h-full" />
                                </ChartContainer>
                            ) : error ? (
                                < ChartContainer config={{ value: { label: "value", color: color } }}>
                                    <div className="p-4 text-center w-full h-full flex flex-col items-center justify-center gap-3">
                                        <span className="text-red-600">{error}</span>
                                        {isFailedToLoadData && <><TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger><RotateCw size={16} onClick={handleRetry} /></TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Retry</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                        </>}
                                    </div>
                                </ChartContainer>

                            ) : (< ChartContainer config={{ value: { label: "value", color: color } }}>
                                {chartType === "line" ? (
                                    <LineChart
                                        accessibilityLayer
                                        data={chartData}
                                        margin={{ left: 12, right: 12 }}
                                    >
                                        <CartesianGrid vertical={false} />
                                        <XAxis dataKey="date" axisLine={false} tickMargin={8} />
                                        <YAxis
                                            label={{
                                                value: yLabel,
                                                angle: -90,
                                                position: "insideLeft",
                                            }}
                                            axisLine={false}
                                        />
                                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                                        <Line
                                            dataKey="value"
                                            type="natural"
                                            stroke="var(--color-value)"
                                            strokeDasharray={strokeDasharray}
                                            strokeWidth={2}
                                            dot={{ fill: "var(--color-value)" }}
                                            activeDot={{ r: 6 }}
                                        />
                                    </LineChart>
                                ) : (
                                    <BarChart accessibilityLayer data={chartData}>
                                        <CartesianGrid vertical={false} />
                                        <XAxis dataKey="date" tickMargin={10} axisLine={false} />
                                        <YAxis
                                            label={{
                                                value: yLabel,
                                                angle: -90,
                                                position: "insideLeft",
                                            }}
                                            axisLine={false}
                                        />
                                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                                        <Bar
                                            dataKey="value"
                                            fill="var(--color-value)"
                                            radius={8}
                                            barSize={barSize}
                                        />
                                    </BarChart>
                                )}
                            </ChartContainer>)

                        }
                    </CardContent>

                    <CardFooter className="flex-col items-center gap-2 text-sm">
                        <h4>{title}</h4>
                    </CardFooter>
                </>

            </Card >

            {/* Chart Configuration Dialog */}
            < ChartConfigDialog
                onSubmit={editChart}
                isFormOpen={isFormOpen}
                setIsFormOpen={setIsFormOpen}
                defaultValues={chart}
            />
        </>
    );
};

export default ChartDisplayCard;
