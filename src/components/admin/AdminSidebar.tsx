"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Briefcase,
  FolderGit2,
  Cpu,
  GraduationCap,
  Award,
  Trophy,
  BookOpen,
  Image as ImageIcon,
  Mail,
  FileText,
  Sliders,
  History,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/actions/auth";

interface AdminSidebarProps {
  unreadMessagesCount?: number;
}

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/profile", label: "Profile", icon: User },
  { href: "/admin/projects", label: "Projects", icon: FolderGit2 },
  { href: "/admin/skills", label: "Skills", icon: Cpu },
  { href: "/admin/experience", label: "Experience", icon: Briefcase },
  { href: "/admin/education", label: "Education", icon: GraduationCap },
  { href: "/admin/certificates", label: "Certifications", icon: Award },
  { href: "/admin/achievements", label: "Achievements", icon: Trophy },
  { href: "/admin/blog", label: "Articles & Blog", icon: BookOpen },
  { href: "/admin/media", label: "Media Library", icon: ImageIcon },
  { href: "/admin/messages", label: "Messages", icon: Mail, badgeKey: "messages" },
  { href: "/admin/resume", label: "Resume", icon: FileText },
  { href: "/admin/settings", label: "Site & SEO Settings", icon: Sliders },
  { href: "/admin/activity", label: "Activity Log", icon: History },
];

export function AdminSidebar({ unreadMessagesCount = 0 }: AdminSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "h-screen sticky top-0 flex flex-col border-r border-border bg-card/60 backdrop-blur-xl transition-all duration-300 z-30 select-none",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border">
        {!collapsed && (
          <Link href="/admin" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary text-sm">
              CMS
            </div>
            <div className="leading-tight">
              <span className="font-semibold text-sm tracking-tight block">Portfolio Admin</span>
              <span className="text-[10px] text-muted-foreground block font-mono">Control Center</span>
            </div>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors ml-auto"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-medium transition-all group relative",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className={cn("h-4 w-4 shrink-0 transition-transform group-hover:scale-105", isActive ? "text-primary-foreground" : "")} />
              {!collapsed && <span className="truncate">{item.label}</span>}

              {/* Unread Messages badge */}
              {item.badgeKey === "messages" && unreadMessagesCount > 0 && (
                <span
                  className={cn(
                    "ml-auto text-xs px-1.5 py-0.5 rounded-full font-bold",
                    isActive
                      ? "bg-primary-foreground text-primary"
                      : "bg-destructive text-destructive-foreground",
                    collapsed && "absolute top-1 right-1 h-2 w-2 p-0 rounded-full"
                  )}
                >
                  {!collapsed && unreadMessagesCount}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Footer Actions */}
      <div className="p-2 border-t border-border space-y-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          title="View Public Portfolio"
        >
          <ExternalLink className="h-4 w-4 shrink-0" />
          {!collapsed && <span>View Public Site</span>}
        </Link>

        <button
          onClick={() => logoutAction()}
          className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors"
          title="Logout"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
