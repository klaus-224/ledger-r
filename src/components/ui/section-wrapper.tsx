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
      <header className="flex items-center gap-2 mb-5">
        <SidebarTrigger />
        <span className="font-medium text-xl">{title}</span>
      </header>
      {children}
    </div>
  );
};
