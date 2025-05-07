import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@components/ui/sidebar";
import { NavLink } from "react-router";
import { Landmark, BanknoteArrowUp, BanknoteArrowDown } from "lucide-react";

const items = [
  {
    title: "Networth",
    url: "/networth",
    icon: Landmark,
  },
  {
    title: "Expenses",
    url: "/expenses",
    icon: BanknoteArrowDown,
  },
  {
    title: "Income",
    url: "/income",
    icon: BanknoteArrowUp,
  },
];

const SidebarNav = () => {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>LedgerR</SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton>
                    <NavLink to={item.url} className="flex flex-row gap-2">
                      <item.icon />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default SidebarNav;
