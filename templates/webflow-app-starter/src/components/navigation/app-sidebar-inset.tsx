import { Separator } from "../ui/separator";
import { SidebarInset, SidebarTrigger } from "../ui/sidebar";

type AppSidebarInsetProps = {
  children: React.ReactNode;
  left?: React.ReactNode;
  right?: React.ReactNode;
};

export function AppSidebarInset({
  children,
  left,
  right,
}: AppSidebarInsetProps) {
  return (
    <SidebarInset>
      <header className="flex h-12 shrink-0 items-center gap-2 justify-between pr-2 border-b border-border1">
        <div className="flex items-center gap-1 pl-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-1 !h-4" />
          {left}
        </div>
        {right}
      </header>
      <div className="p-2">{children}</div>
    </SidebarInset>
  );
}
