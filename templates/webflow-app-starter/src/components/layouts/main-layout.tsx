import { AppSidebar } from "../navigation/app-sidebar";
import { SidebarProvider } from "../ui/sidebar";

type MainLayoutProps = {
  children: React.ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <SidebarProvider defaultOpen={false} className="overflow-x-hidden">
      <AppSidebar />
      {children}
    </SidebarProvider>
  );
}
