import { ChartConfig } from "@/chartConfigSchema";
import { ChartConfigDialog } from "./chartConfigDialog";
import { useState } from "react";
import axios from "axios";
import API_ENDPOINTS from "@/config/urlConfig";
import { Button } from "./ui/button";
import { useChartStore } from "@/stores";
import { Plus } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const Navbar = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const { setChartList } = useChartStore()
    const { toast } = useToast()
    const saveChart = async (chart: ChartConfig) => {
        try {
            // Make a POST request to the backend
            const response = await axios.post(API_ENDPOINTS.charts.create, chart, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response?.status === 200) {
                setChartList(response?.data?.charts)
                toast({
                    title: "Chart added successfully!",
                })
            }
            else {
                throw Error("Failed to add the chart")
            }


        } catch (error: any) {
            // Handle errors gracefully
            console.error("Error saving chart:", error.response?.data || error.message);
            toast({
                variant: "destructive",
                title: "Failed to add the chart"
            })
        }
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
