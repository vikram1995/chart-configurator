import { ChartConfig } from "@/chartConfigSchema";
import { ChartConfigDialog } from "./chartConfigDialog";
import { useState } from "react";
import axios from "axios";
import API_ENDPOINTS from "@/config/urlConfig";
import { Button } from "./ui/button";

const Navbar = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const saveChart = async (chart: ChartConfig) => {
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
                    <Button onClick={openDialog}>Add Chart</Button>
                    <ChartConfigDialog onSubmit={saveChart} isFormOpen={isFormOpen} setIsFormOpen={setIsFormOpen} defaultValues={null} />
                </div>
            </nav>

        </>
    );
};

export default Navbar;
