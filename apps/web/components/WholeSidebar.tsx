import type { ClientManager } from "bonmelo.js";
import { Drawer } from "@mantine/core";
import { useState } from "react";
import Sidebar from "./SidebarNew";
import Toolbar from "./Toolbar";

export default function WholeSidebar({ clientManager }: { clientManager:ClientManager }) {

    const [drawerOpened, setDrawerOpened] = useState(false);

    return (
        <div className={`flex items-center w-fit h-full`}>
            <div className={`h-full hidden sm:flex bg-background dark:bg-backgroundDark`}>
                <Toolbar
                    clientManager={clientManager}
                />
                <Sidebar
                    clientManager={clientManager}
                />
            </div>
        </div>
    )
}