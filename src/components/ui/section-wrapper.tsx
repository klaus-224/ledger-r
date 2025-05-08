import { useNavigate } from "react-router";
import { SidebarTrigger } from "./sidebar";
import { CircleArrowLeft } from "lucide-react";

export const SectionWrapper = ({
  title,
  children,
  navigateTo,
}: {
  title: string;
  children: React.ReactNode;
  navigateTo?: string;
}) => {
  const navigate = useNavigate();
  return (
    <div className="px-3 py-2">
      <header className="flex items-center gap-2 mb-5">
        <SidebarTrigger />
        {navigateTo && (
          <CircleArrowLeft
            className="cursor-pointer"
            size={18}
            onClick={() => navigate(navigateTo)}
          />
        )}
        <span className="font-medium text-xl">{title}</span>
      </header>
      {children}
    </div>
  );
};
