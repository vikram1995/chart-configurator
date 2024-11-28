import { z } from "zod";

const dataSource = z
    .object({
        label: z.string(),
        value: z.string(),
    })
    .nullable() // Allow null for the initial state
    .refine((data) => data !== null && data.label && data.value, {
        message: "Data source is required",
    })

const chartType = z.enum(["line", "bar"])

export const chartConfigSchema = z.object({
    id: z.number().optional(),
    title: z.string().min(1, "Title is required"),
    type: chartType,
    yLabel: z.string().optional(),
    color: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid color format"),
    dataSource: dataSource,
    timeFrequency: z.enum(["1d", "1w", "1m", "1y"], {
        required_error: "Time frequency is required",
    }),
    lineStyle: z.enum(["solid", "dashed", "dotted"], {
        required_error: "Line style is required",
    }).optional(),
    barStyle: z.enum(["thin", "medium", "thick"], {
        required_error: "Bar style is required",
    }).optional(),
});

export type ChartConfig = z.infer<typeof chartConfigSchema>;

export type dataSourceT = z.infer<typeof dataSource>;
export type ChartTypeT = z.infer<typeof chartType>;
