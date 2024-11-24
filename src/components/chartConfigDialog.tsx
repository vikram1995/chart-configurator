import { useMediaQuery } from 'usehooks-ts'
import { useState } from 'react'
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


export function ChartConfigDialog() {
    const [charts, setCharts] = useState<ChartConfig[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingChart, setEditingChart] = useState<ChartConfig | null>(null);
    const isDesktop = useMediaQuery(Breakpoints.Desktop)

    const saveChart = (chart: ChartConfig) => {
        console.log(chart)
        if (chart.title && editingChart) {
            // Edit existing chart
            setCharts((prev) => prev.map((c) => (c.title === editingChart.title ? chart : c)));
        } else {
            // Add new chart
            setCharts((prev) => [...prev, { ...chart, id: Date.now() }]);
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

