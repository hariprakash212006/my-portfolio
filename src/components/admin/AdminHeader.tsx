"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, User, LogOut, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/actions/auth";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

interface AdminHeaderProps {
  user?: {
    name?: string | null;
    email?: string | null;
    role?: string | null;
  } | null;
}

export function AdminHeader({ user }: AdminHeaderProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  // Generate readable title from path
  const getPageTitle = () => {
    if (pathname === "/admin") return "Overview Dashboard";
    const segment = pathname.split("/admin/")[1]?.split("/")[0] || "";
    return segment.charAt(0).toUpperCase() + segment.slice(1);
  };

  return (
    <header className="h-16 border-b border-border bg-card/40 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20">
      <div>
        <h1 className="text-base font-semibold tracking-tight">{getPageTitle()}</h1>
        <p className="text-xs text-muted-foreground">Manage your dynamic portfolio content</p>
      </div>

      <div className="flex items-center space-x-3">
        {/* Public Site Quick Link */}
        <Link href="/" target="_blank">
          <Button variant="outline" size="sm" className="hidden sm:inline-flex text-xs h-8">
            <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
            Live Site
          </Button>
        </Link>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-lg"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          title="Toggle Theme"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 px-2 flex items-center space-x-2 rounded-lg">
              <div className="h-6 w-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                {user?.name?.charAt(0) || "A"}
              </div>
              <span className="text-xs font-medium hidden md:inline-block">
                {user?.name || "Admin"}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="font-semibold text-xs">{user?.name || "Administrator"}</div>
              <div className="text-[11px] text-muted-foreground truncate">{user?.email}</div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/admin/profile" className="cursor-pointer">
                <User className="h-3.5 w-3.5 mr-2" />
                Profile Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => logoutAction()}
              className="text-destructive focus:bg-destructive/10 cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
