import { ChartConfigDialog } from "./chartConfigDialog";

const Navbar = () => {
    return (
        <>
            <nav className="bg-white border-b border-gray-200 px-4 py-3 sm:px-6 lg:px-8 shadow-sm">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <div className="flex items-center">
                        <span className="ml-2 text-xl font-semibold">Dashboard</span>
                    </div>
                    {/* Add Button */}
                    <ChartConfigDialog />
                </div>
            </nav>

        </>
    );
};

export default Navbar;
