"use client";

import * as React from "react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { useTheme } from "next-themes";

export function TeamSwitcher() {
  const { isMobile } = useSidebar();
  const { theme } = useTheme();

  const logo = "/TENSW_icon.png";
  let nameImage = "/TENSW_text_dark.png";
  if (theme === "dark") {
    nameImage = "/TENSW_text_light.png";
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            <Image src={logo} alt={nameImage} width={32} height={32} />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <Image src={nameImage} alt={nameImage} width={100} height={100} />
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
