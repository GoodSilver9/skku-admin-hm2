"use client";

import * as React from "react";
import {
  BookOpen,
  GalleryVerticalEnd,
  Search,
  SquareTerminal,
  Users,
  School,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

let user = {
  email: "",
  name: "",
  role: "",
};

if (typeof window !== "undefined") {
  const localUser = localStorage.getItem("user");
  if (localUser) {
    const parsedUser = JSON.parse(localUser);
    user.email = parsedUser.email;
    user.name = parsedUser.name;
    user.role = parsedUser.role;
  }
}
// This is sample data.
let data = {
  user: {
    name: user.name,
    email: user.email,
    avatar: "",
  },
  navMain: [
    {
      title: "대시보드",
      url: "/dashboard",
      icon: SquareTerminal,
    },
    {
      title: "질문 관리",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "질문 목록",
          url: "/questions",
        },
        {
          title: "새 질문 등록",
          url: "/questions/add",
        },
      ],
    },
    /*{
      title: "검색 로그",
      url: "/search-logs",
      icon: Search,
    },*/
    {
      title: "시작 질문",
      url: "/suggested-questions",
      icon: BookOpen,
    },
    {
      title: "캠퍼스 관리",
      url: "#",
      icon: School,
      items: [
        {
          title: "캠퍼스 목록",
          url: "/campuses",
        },
        {
          title: "새 캠퍼스 등록",
          url: "/campuses/add",
        },
      ],
    },
  ],
};

if (user.role === "MASTER_ADMIN") {
  data = {
    user: {
      name: user.name,
      email: user.email,
      avatar: "",
    },
    navMain: [
      {
        title: "대시보드",
        url: "/dashboard",
        icon: SquareTerminal,
      },
      {
        title: "사용자 관리",
        url: "#",
        icon: Users,
        items: [
          {
            title: "사용자 목록",
            url: "/members",
          },
          {
            title: "새 사용자 등록",
            url: "/members/add",
          },
        ],
      },
      {
        title: "질문 관리",
        url: "#",
        icon: BookOpen,
        items: [
          {
            title: "질문 목록",
            url: "/questions",
          },
          {
            title: "새 질문 등록",
            url: "/questions/add",
          },
        ],
      },
      /*{
        title: "검색 로그",
        url: "/search-logs",
        icon: Search,
      },*/
      {
        title: "시작 질문",
        url: "/suggested-questions",
        icon: BookOpen,
      },
      {
        title: "캠퍼스 관리",
        url: "#",
        icon: School,
        items: [
          {
            title: "캠퍼스 목록",
            url: "/campuses",
          },
          {
            title: "새 캠퍼스 등록",
            url: "/campuses/add",
          },
        ],
      },
    ],
  };
}

export function AppSidebar({ ...props }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
