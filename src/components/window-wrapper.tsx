import { ReactNode, useState } from "react";
import SidebarNav from "./sidebar-nav";

const WindowWrapper = ({ children }: { children: ReactNode }) => {
	const [sidebarOpen, setSidebarOpen] = useState(true);

	return (
    <div data-slot="window-wrapper" className="flex flex-row">
      <div
        data-slot="side-bar-wrapper"
        className={`side-bar ${sidebarOpen ? "w-1/4" : "w-1/12"}`}
      >
        <SidebarNav />
      </div>
      <div
        data-slot="content-wrapper"
        className={`main-content ${sidebarOpen ? "w-3/4" : "w-11/12"}`}
      >
				<button onClick={() => setSidebarOpen(!sidebarOpen)}>
					Toggle Side Bar
				</button>
        {children}
      </div>
    </div >
  );
};

export default WindowWrapper;
