import SidebarNav from "@components/sidebar";
import { SidebarProvider } from "@components/ui/sidebar";
import { Outlet } from "react-router";

const Layout = () => {
  return (
    <SidebarProvider>
      <SidebarNav />
      <main className="relative flex w-full flex-1 flex-col md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow duration-100 ease-linear px-3 py-1">
        <Outlet />
      </main>
    </SidebarProvider>
  );
};

export default Layout;
