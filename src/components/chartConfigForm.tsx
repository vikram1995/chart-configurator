import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { chartConfigSchema, ChartConfig } from "@/schema/chartConfigSchema";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from "@/components/ui/select";
import DataSourceField from "./dataSourceField";

interface ChartConfigFormProps {
    defaultValues?: Partial<ChartConfig>;
    onSubmit: (data: ChartConfig) => void;
}

const chartTypeDisplayMap: { [key in "line" | "bar"]: string } = {
    line: "Line",
    bar: "Bar"
}

const lineStyleDisplayMap: { [key in "solid" | "dashed" | "dotted"]: string } = {
    solid: "Solid",
    dashed: "Dashed",
    dotted: "Dotted",
};

const barStyleDisplayMap: { [key in "thin" | "medium" | "thick"]: string } = {
    thin: "Thin",
    medium: "Medium",
    thick: "Thick",
};

const timeFrequencyDisplayMap: { [key in "1d" | "1w" | "1m" | "1y"]: string } = {
    "1d": "Day",
    "1w": "Week",
    "1m": "Month",
    "1y": "Year",
};

const ChartConfigForm: React.FC<ChartConfigFormProps> = ({
    defaultValues,
    onSubmit,
}) => {
    const form = useForm<ChartConfig>({
        resolver: zodResolver(chartConfigSchema),
        defaultValues: {
            title: defaultValues?.title || "",
            type: defaultValues?.type || "line",
            yLabel: defaultValues?.yLabel || "",
            color: defaultValues?.color || "#4b8dff",
            dataSource: defaultValues?.dataSource || null,
            timeFrequency: defaultValues?.timeFrequency || "1m",
            lineStyle: defaultValues?.lineStyle || "solid",
            barStyle: defaultValues?.barStyle || "medium",
        },
    });

    const handleSubmit = (data: ChartConfig) => {
        onSubmit(data);
    };

    const chartType = form.watch("type");

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-2"
            >
                {/* Title */}
                <FormField
                    name="title"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter chart title" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Data Source */}
                <FormField
                    name="dataSource"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Data Source</FormLabel>
                            <FormControl>
                                <DataSourceField
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Chart Type */}
                <FormField
                    name="type"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Chart Type</FormLabel>
                            <FormControl>
                                <Select
                                    value={field.value}
                                    onValueChange={(value) =>
                                        field.onChange(value as "line" | "bar")
                                    }
                                >
                                    <SelectTrigger>{chartTypeDisplayMap[field.value]}</SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="line">Line</SelectItem>
                                        <SelectItem value="bar">Bar</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />


                {/* Line Style Field - Conditional Rendering */}
                {chartType === "line" && (
                    <FormField
                        name="lineStyle"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Line Style</FormLabel>
                                <FormControl>
                                    <Select
                                        value={field.value}
                                        onValueChange={(value) => field.onChange(value)}
                                    >
                                        <SelectTrigger>{lineStyleDisplayMap[field.value] || "Select Line Style"}</SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="solid">Solid</SelectItem>
                                            <SelectItem value="dashed">Dashed</SelectItem>
                                            <SelectItem value="dotted">Dotted</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                {/* Bar Style Field - Conditional Rendering */}
                {chartType === "bar" && (
                    <FormField
                        name="barStyle"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Bar Style</FormLabel>
                                <FormControl>
                                    <Select
                                        value={field.value}
                                        onValueChange={(value) => field.onChange(value)}
                                    >
                                        <SelectTrigger>{barStyleDisplayMap[field.value] || "Select Bar Style"}</SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="thin">Thin</SelectItem>
                                            <SelectItem value="medium">Medium</SelectItem>
                                            <SelectItem value="thick">Thick</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                {/* Time Frequency */}
                <FormField
                    name="timeFrequency"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Time Frequency</FormLabel>
                            <FormControl>
                                <Select
                                    value={field.value}
                                    onValueChange={(value) =>
                                        field.onChange(
                                            value as "1d" | "1w" | "1m" | "1y"
                                        )
                                    }
                                >
                                    <SelectTrigger>{timeFrequencyDisplayMap[field.value] || "Select Time Frequency"}</SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1d">Day</SelectItem>
                                        <SelectItem value="1w">Week</SelectItem>
                                        <SelectItem value="1m">Month</SelectItem>
                                        <SelectItem value="1y">Year</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {/* Y-Axis Label */}
                <FormField
                    name="yLabel"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Y-Axis Label</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter Y-axis label" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Color Picker */}
                <FormField
                    name="color"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Chart Color</FormLabel>
                            <FormControl>
                                <Input type="color" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Save Button */}
                <Button type="submit" className="w-full">
                    Save
                </Button>
            </form>
        </Form>
    );
};

export default ChartConfigForm;
