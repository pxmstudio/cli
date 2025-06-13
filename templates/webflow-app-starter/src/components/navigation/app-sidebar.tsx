"use client";

import * as React from "react";
import { ComponentIcon, LifeBuoy } from "lucide-react";

import { NavMain } from "./nav-main";
import { Sidebar, SidebarContent } from "@/components/ui/sidebar";

const data = {
  navMain: [
    {
      name: "Index",
      url: "/",
      icon: ComponentIcon,
    },
    {
      name: "Support",
      url: "https://pixelmakers.com/support",
      icon: LifeBuoy,
      target: "_blank",
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarContent>
        <NavMain links={data.navMain} />
      </SidebarContent>
    </Sidebar>
  );
}
