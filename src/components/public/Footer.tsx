import React from "react";
import Link from "next/link";
import { Github, Linkedin, Twitter, Mail, Globe, ArrowUp } from "lucide-react";

interface SocialLinkItem {
  id: string;
  platform: string;
  url: string;
}

interface FooterProps {
  name: string;
  tagline: string;
  location?: string | null;
  socialLinks: SocialLinkItem[];
}

export function Footer({ name, tagline, location, socialLinks }: FooterProps) {
  const getSocialIcon = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes("github")) return <Github className="h-4 w-4" />;
    if (p.includes("linkedin")) return <Linkedin className="h-4 w-4" />;
    if (p.includes("twitter") || p.includes("x")) return <Twitter className="h-4 w-4" />;
    if (p.includes("mail") || p.includes("email")) return <Mail className="h-4 w-4" />;
    return <Globe className="h-4 w-4" />;
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card/60 py-12 text-xs text-muted-foreground">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="text-center sm:text-left space-y-1">
          <p className="font-semibold text-sm text-foreground">{name}</p>
          <p className="text-xs text-muted-foreground">{tagline}</p>
          {location && <p className="text-[11px] text-muted-foreground">{location}</p>}
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium">
          <Link href="#about" className="hover:text-foreground transition-colors">
            About
          </Link>
          <Link href="#skills" className="hover:text-foreground transition-colors">
            Skills
          </Link>
          <Link href="#experience" className="hover:text-foreground transition-colors">
            Experience
          </Link>
          <Link href="#projects" className="hover:text-foreground transition-colors">
            Projects
          </Link>
          <Link href="/blog" className="hover:text-foreground transition-colors">
            Blog
          </Link>
          <Link href="/resume" target="_blank" className="hover:text-foreground transition-colors">
            Resume
          </Link>
          <Link href="/admin/login" className="hover:text-primary transition-colors font-mono">
            Admin
          </Link>
        </div>

        {/* Social and Copyright */}
        <div className="flex flex-col items-center sm:items-end space-y-2">
          <div className="flex items-center space-x-2">
            {socialLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-md hover:text-foreground hover:bg-muted transition-colors"
                title={link.platform}
              >
                {getSocialIcon(link.platform)}
              </a>
            ))}
          </div>
          <p className="text-[11px] text-muted-foreground">
            © {currentYear} {name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
