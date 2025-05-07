import { SidebarTrigger } from "./sidebar";

export const SectionWrapper = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="px-3 py-2">
      <header className="flex items-center gap-2">
        <SidebarTrigger />
        <span>{title}</span>
      </header>
      {children}
    </div>
  );
};
