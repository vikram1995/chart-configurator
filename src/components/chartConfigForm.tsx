import React from "react";
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { chartConfigSchema, ChartConfig } from "@/chartConfigSchema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import DataSourceField from "./dataSourceField";

interface ChartConfigFormProps {
    defaultValues?: Partial<ChartConfig>;
    onSubmit: (data: ChartConfig) => void;
}

const ChartConfigForm: React.FC<ChartConfigFormProps> = ({ defaultValues, onSubmit }) => {
    const form = useForm<ChartConfig>({
        resolver: zodResolver(chartConfigSchema),
        defaultValues: {
            title: defaultValues?.title || "",
            type: defaultValues?.type || "line",
            yLabel: defaultValues?.yLabel || "",
            color: defaultValues?.color || "#4b8dff",
            dataSource: defaultValues?.dataSource || null
        },
    });

    const handleSubmit = (data: ChartConfig) => {
        onSubmit(data);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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

                <FormField
                    name="dataSource"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Data Source</FormLabel>
                            <FormControl>
                                <DataSourceField value={field.value} onChange={field.onChange} />
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
                                    onValueChange={(value) => field.onChange(value as "line" | "bar")}
                                >
                                    <SelectTrigger>{field.value}</SelectTrigger>
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

                {/* Buttons */}

                <Button type="submit" className="w-full">Save</Button>

            </form>
        </Form>
    );
};

export default ChartConfigForm;
