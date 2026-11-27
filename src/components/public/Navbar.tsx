"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, FileDown, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/public/ThemeToggle";

interface NavbarProps {
  siteName: string;
  navSections?: Record<string, boolean>;
  resumeUrl?: string | null;
}

export function Navbar({ siteName, navSections = {}, resumeUrl }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#about", label: "About", enabled: navSections.about ?? true },
    { href: "#skills", label: "Skills", enabled: navSections.skills ?? true },
    { href: "#experience", label: "Experience", enabled: navSections.experience ?? true },
    { href: "#projects", label: "Projects", enabled: navSections.projects ?? true },
    { href: "#certifications", label: "Certifications", enabled: navSections.certifications ?? true },
    { href: "#education", label: "Education", enabled: navSections.education ?? true },
    { href: "/blog", label: "Articles", enabled: navSections.blog ?? true, isRoute: true },
    { href: "#contact", label: "Contact", enabled: navSections.contact ?? true },
  ].filter((item) => item.enabled);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "glass border-b border-border shadow-sm py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          className="text-base font-bold tracking-tight text-foreground hover:opacity-80 transition-opacity flex items-center space-x-2"
        >
          <span className="h-8 w-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-mono text-sm">
            {siteName.charAt(0) || "H"}
          </span>
          <span className="font-semibold text-sm sm:text-base">{siteName.split("|")[0].trim()}</span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs lg:text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 px-3 py-1.5 rounded-lg transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions: Theme Toggle & Resume */}
        <div className="hidden sm:flex items-center space-x-2">
          <ThemeToggle />
          <Link href="/resume" target="_blank">
            <Button size="sm" variant="outline" className="text-xs h-9 rounded-xl font-medium">
              <FileDown className="h-3.5 w-3.5 mr-1.5" />
              Resume
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex sm:hidden items-center space-x-1">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="h-9 w-9 text-muted-foreground hover:text-foreground"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden glass border-b border-border px-4 py-4 space-y-2 animate-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-muted-foreground hover:text-foreground px-3 py-2 rounded-lg hover:bg-muted/60 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-border">
            <Link href="/resume" target="_blank" onClick={() => setMobileMenuOpen(false)}>
              <Button size="sm" className="w-full text-xs rounded-xl">
                <FileDown className="h-3.5 w-3.5 mr-1.5" />
                Download Resume
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
