import { ReactNode } from "react";
import SidebarNav from "./sidebar-nav";

const WindowWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <div
      data-slot="window-wrapper"
      className="min-h-screen flex flex-row"
    >
      <div data-slot="side-bar-wrapper" className="min-h-screen border-2 border-red-500 w-1/3">
        <SidebarNav />
      </div>
      <div data-slot="content-wrapper" className="min-h-screen w-full border-2 border-blue-500">
        {children}
      </div>
    </div>
  );
};

export default WindowWrapper;
