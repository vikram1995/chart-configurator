import { useMediaQuery } from 'usehooks-ts'
import { useState } from 'react'
import axios from "axios";

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"

import ChartConfigForm from "./chartConfigForm"
import { ChartConfig } from '@/chartConfigSchema'
import { Breakpoints } from '@/constants'
import API_ENDPOINTS from '@/config/urlConfig';


export function ChartConfigDialog() {
    const [charts, setCharts] = useState<ChartConfig[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingChart, setEditingChart] = useState<ChartConfig | null>(null);
    const isDesktop = useMediaQuery(Breakpoints.Desktop)

    const saveChart = async (chart: ChartConfig) => {
        console.log(chart)
        try {
            // Make a POST request to the backend
            const response = await axios.post(API_ENDPOINTS.charts.create, chart, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            // Log the response from the backend
            console.log("Chart saved successfully:", response.data);

            // Optionally update UI or state here
            alert("Chart saved successfully!");
        } catch (error: any) {
            // Handle errors gracefully
            console.error("Error saving chart:", error.response?.data || error.message);
            alert("Failed to save chart. Please try again.");
        }
        setIsFormOpen(false);
    };

    if (isDesktop) {
        return (
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogTrigger asChild>
                    <Button>Add Chart</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add Chart</DialogTitle>

                    </DialogHeader>
                    <ChartConfigForm
                        defaultValues={editingChart || undefined}
                        onSubmit={saveChart}
                    />
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Drawer open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DrawerTrigger asChild>
                <Button>Add Chart</Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>Add Chart</DrawerTitle>
                </DrawerHeader>
                <div className="px-4">
                    <ChartConfigForm
                        defaultValues={editingChart || undefined}
                        onSubmit={saveChart}
                    />
                </div>
                <DrawerFooter className="pt-2">
                    <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

