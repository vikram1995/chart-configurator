import React from "react";
import { Button } from "@/components/ui/button"; // Import ShadCN's Button
import { Menu, MenuItem, MenuTrigger, MenuContent } from "@/components/ui/menu"; // Optional dropdown for future use

const Navbar = () => {
    return (
        <nav className="bg-white border-b border-gray-200 px-4 py-3 sm:px-6 lg:px-8 shadow-sm">
            <div className="flex justify-between items-center">
                {/* Logo */}
                <div className="flex items-center">
                    <span className="ml-2 text-xl font-semibold">Dashboard</span>
                </div>
                {/* Add Button */}
                <Button>
                    Add chart
                </Button>
            </div>
        </nav>
    );
};

export default Navbar;
