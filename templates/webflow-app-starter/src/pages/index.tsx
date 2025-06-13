import { AppSidebarInset } from "@/components/navigation/app-sidebar-inset";
import {
  BreadcrumbPage,
  BreadcrumbList,
  Breadcrumb,
  BreadcrumbItem,
} from "@/components/ui/breadcrumb";

export default function Page() {
  return (
    <AppSidebarInset
      left={
        <Breadcrumb className="w-full flex-1">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Page</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      }
    >
      <p>Page</p>
    </AppSidebarInset>
  );
}
