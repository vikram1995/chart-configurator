import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Pencil, Trash, ChartColumnBig, ChartLine } from "lucide-react";
import { LineChart, BarChart, Bar, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { ChartConfig as ChartT } from '@/chartConfigSchema';
import API_ENDPOINTS from "@/config/urlConfig";
import GraphSkeleton from "./graphSkeleton";
import { calculateDateRange } from "@/lib/utils";
import { ChartConfigDialog } from "./chartConfigDialog";
import { useChartStore } from "@/stores";

const FRED_API_KEY = import.meta.env.VITE_FRED_API_KEY;

interface ChartDisplayCardProps {
    chart: ChartT;
}

const ChartDisplayCard: React.FC<ChartDisplayCardProps> = ({ chart }) => {
    const { title, type, yLabel, timeFrequency, lineStyle, dataSource, color, barStyle, id } = chart;
    const [chartData, setChartData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [frequency, setFrequency] = useState<string>(timeFrequency || "1m");
    const [chartType, setChartType] = useState<string>(type || "line");

    const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

    const { setChartList } = useChartStore();

    const strokeDasharray = lineStyle === "dashed"
        ? "5 5"
        : lineStyle === "dotted"
            ? "2 2"
            : undefined;

    const barSize =
        barStyle === "thin"
            ? 10
            : barStyle === "medium"
                ? 20
                : barStyle === "thick"
                    ? 30
                    : 20;

    const handleChartTypeChange = (type: string) => {
        setChartType(type);
    };

    const onDelete = async () => {
        try {
            const response = await axios.delete(API_ENDPOINTS.charts.update(id));
            setChartList(response?.data?.charts);
        } catch (error) {
            console.error("Error deleting chart:", error);
        }
    };

    const onEditClickHandler = () => {
        setIsFormOpen(true);
    };

    const editChart = async (chart: ChartT) => {
        try {
            const response = await axios.put(API_ENDPOINTS.charts.update(id), chart, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            setChartList(response?.data?.charts);
            alert("Chart saved successfully!");
        } catch (error: any) {
            console.error("Error saving chart:", error.response?.data || error.message);
            alert("Failed to save chart. Please try again.");
        }
        setIsFormOpen(false);
    };

    const getChartData = async () => {
        const { startDate, endDate } = calculateDateRange(frequency);
        try {
            const response = await axios.get(API_ENDPOINTS.dataSource.observations, {
                params: {
                    series_id: dataSource?.value,
                    api_key: FRED_API_KEY,
                    observation_start: startDate,
                    observation_end: endDate,
                    file_type: "json"
                }
            });
            const observations = response?.data?.observations;
            setChartData(observations);
        } catch (error) {
            console.error("Error fetching chart data:", error);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        getChartData();
    }, [frequency]);

    const chartConfig = {
        value: {
            label: "value",
            color: color
        },
    };

    const handleTimeRangeChange = (range: string) => {
        setFrequency(range);
    };

    return (
        <>
            <Card>
                {isLoading ? <GraphSkeleton /> : <>
                    <div className="flex flex-row items-center w-full justify-between p-2">
                        <Tabs
                            value={chartType}
                            onValueChange={handleChartTypeChange}
                            className="hidden xxs:flex"
                        >
                            <TabsList>
                                <TabsTrigger value="line"><ChartLine size={16} /></TabsTrigger>
                                <TabsTrigger value="bar"><ChartColumnBig size={16} /></TabsTrigger>
                            </TabsList>
                        </Tabs>
                        <Tabs
                            defaultValue={frequency}
                            onValueChange={handleTimeRangeChange}
                            className="flex"
                        >
                            <TabsList>
                                <TabsTrigger value="1d">1D</TabsTrigger>
                                <TabsTrigger value="1w">1W</TabsTrigger>
                                <TabsTrigger value="1m">1M</TabsTrigger>
                                <TabsTrigger value="1y">1Y</TabsTrigger>
                            </TabsList>
                        </Tabs>
                        <div className="flex gap-2">
                            <Button
                                size="icon"
                                variant="outline"
                                onClick={onEditClickHandler}
                            >
                                <Pencil size={16} />
                                <span className="sr-only">Edit</span>
                            </Button>
                            <Button
                                size="icon"
                                variant="destructive"
                                onClick={onDelete}
                            >
                                <Trash size={16} />
                                <span className="sr-only">Delete</span>
                            </Button>
                        </div>
                    </div>
                    <Separator />
                    <CardContent className="p-2">
                        <ChartContainer config={chartConfig}>
                            {chartType === 'line' ? (
                                <LineChart
                                    accessibilityLayer
                                    data={chartData}
                                    margin={{
                                        left: 12,
                                        right: 12,
                                    }}
                                >
                                    <CartesianGrid vertical={false} />
                                    <XAxis
                                        dataKey="date"
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={8}
                                    />
                                    <YAxis
                                        label={{
                                            value: yLabel,
                                            angle: -90,
                                            position: "insideLeft",
                                        }}
                                    />
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent hideLabel />}
                                    />
                                    <Line
                                        dataKey="value"
                                        type="natural"
                                        stroke="var(--color-value)"
                                        strokeDasharray={strokeDasharray}
                                        strokeWidth={2}
                                        dot={{
                                            fill: "var(--color-value)",
                                        }}
                                        activeDot={{
                                            r: 6,
                                        }}
                                    />
                                </LineChart>
                            ) : (
                                <BarChart accessibilityLayer data={chartData}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis
                                        dataKey="date"
                                        tickLine={false}
                                        tickMargin={10}
                                        axisLine={false}
                                    />
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent hideLabel />}
                                    />
                                    <Bar dataKey="value" fill="var(--color-value)" radius={8} barSize={barSize} />
                                </BarChart>
                            )}
                        </ChartContainer>
                    </CardContent>
                    <CardFooter className="flex-col items-center gap-2 text-sm">
                        <h4>{title}</h4>
                    </CardFooter>
                </>}
            </Card>
            <ChartConfigDialog onSubmit={editChart} isFormOpen={isFormOpen} setIsFormOpen={setIsFormOpen} defaultValues={chart} />
        </>
    );
};

export default ChartDisplayCard;