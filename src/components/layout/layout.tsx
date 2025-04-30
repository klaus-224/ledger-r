import { ReactNode, useState } from "react";
import SidebarNav from "@components/sidebar";
import { FiSidebar } from "react-icons/fi";

const Layout = ({ children }: { children: ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div data-slot="window-wrapper" className="flex flex-row">
      <div
        data-slot="side-bar-wrapper"
        className={`sidebar-section ${sidebarOpen ? "w-1/4" : "w-0"}`}
      >
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 absolute rounded-sm hover:cursor-pointer text-foreground"
        >
          <FiSidebar />
        </button>
        <SidebarNav />
      </div>
      <div
        data-slot="content-wrapper"
        className={`main-content-section ${sidebarOpen ? "w-3/4" : "w-full"}`}
      >
        {children}
      </div>
    </div>
  );
};

export default Layout;
