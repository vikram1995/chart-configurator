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

export const chartConfigSchema = z.object({
    title: z.string().min(1, "Title is required"),
    type: z.enum(["line", "bar"]),
    yLabel: z.string().optional(),
    color: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid color format"),
    dataSource: dataSource
});

export type ChartConfig = z.infer<typeof chartConfigSchema>;

export type dataSourceT = z.infer<typeof dataSource>;
