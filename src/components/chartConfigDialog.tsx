import { useMediaQuery } from 'usehooks-ts'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer"

import ChartConfigForm from "./chartConfigForm"

import { Breakpoints } from '@/constants'



export function ChartConfigDialog({ onSubmit, isFormOpen, setIsFormOpen, defaultValues }) {

    const isDesktop = useMediaQuery(Breakpoints.Desktop)
    const isEdit = defaultValues ? true : false

    if (isDesktop) {
        return (
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{isEdit ? "Edit Chart" : "Add Chart"}</DialogTitle>
                        <DialogDescription>
                            Configure the chart settings
                        </DialogDescription>

                    </DialogHeader>
                    <ChartConfigForm
                        defaultValues={defaultValues}
                        onSubmit={onSubmit}
                    />
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Drawer open={isFormOpen} onOpenChange={setIsFormOpen}>

            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>Add Chart</DrawerTitle>
                </DrawerHeader>
                <div className="px-4">
                    <ChartConfigForm
                        defaultValues={defaultValues}
                        onSubmit={onSubmit}
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

