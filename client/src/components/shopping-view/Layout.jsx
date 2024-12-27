import { Outlet } from "react-router-dom";
import { useState } from "react";
import ShoppingHeader from "./header.jsx";

function ShoppingLayout() {
    const [openSidebar, setOpenSidebar] = useState(false);

    return (
        <div className="flex flex-col bg-slate-950 overflow-hidden">
            {/* common header */}
            <ShoppingHeader />
            <main className="flex flex-col w-full" >
                <Outlet />
            </main>
        </div>
    );
}

export default ShoppingLayout;
