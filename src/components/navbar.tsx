import { ChartConfig } from "@/chartConfigSchema";
import { ChartConfigDialog } from "./chartConfigDialog";
import { useState } from "react";
import { Button } from "./ui/button";
import { Plus } from 'lucide-react';
import { useAddChartMutation } from "@/hooks/queryHooks";

const Navbar = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const { mutate: addChartMutation } = useAddChartMutation();

    const saveChart = async (chart: ChartConfig) => {
        addChartMutation(chart)
        setIsFormOpen(false);
    };

    const openDialog = () => {
        setIsFormOpen(true)
    }

    return (
        <>
            <nav className="bg-white border-b border-gray-200 px-4 py-3 sm:px-6 lg:px-8 shadow-sm">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <div className="flex items-center">
                        <span className="ml-2 text-xl font-semibold">Dashboard</span>
                    </div>
                    {/* Add Button */}
                    <Button onClick={openDialog}><Plus />Add Chart</Button>
                    <ChartConfigDialog onSubmit={saveChart} isFormOpen={isFormOpen} setIsFormOpen={setIsFormOpen} defaultValues={null} />
                </div>
            </nav>

        </>
    );
};

export default Navbar;
