import { NavLink } from "react-router";

const SidebarNav = () => {
  return (
    <div className="w-full h-full flex flex-col">
      <header className="sidebar-header">LedgerR</header>
      <aside data-slot="side=bar-nav" className="sidebar-container">
        <NavLink to="/networth" className="sidebar-item">
          Networth
        </NavLink>
        <NavLink to="/income" className="sidebar-item">
          Income
        </NavLink>
        <NavLink to="/expenses" className="sidebar-item">
          Expenses
        </NavLink>
      </aside>
    </div>
  );
};

export default SidebarNav;
