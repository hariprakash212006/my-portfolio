"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, FileText, ArrowRight, Github, Linkedin, Twitter, Mail, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SocialLinkItem {
  id: string;
  platform: string;
  url: string;
  icon?: string | null;
}

interface HeroProps {
  greeting: string;
  name: string;
  title: string;
  subtitle: string;
  primaryCtaText: string;
  primaryCtaUrl: string;
  secondaryCtaText: string;
  secondaryCtaUrl: string;
  avatarUrl?: string | null;
  socialLinks: SocialLinkItem[];
  availability?: string;
}

export function Hero({
  greeting,
  name,
  title,
  subtitle,
  primaryCtaText,
  primaryCtaUrl,
  secondaryCtaText,
  secondaryCtaUrl,
  avatarUrl,
  socialLinks,
  availability,
}: HeroProps) {
  const getSocialIcon = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes("github")) return <Github className="h-4 w-4" />;
    if (p.includes("linkedin")) return <Linkedin className="h-4 w-4" />;
    if (p.includes("twitter") || p.includes("x")) return <Twitter className="h-4 w-4" />;
    if (p.includes("mail") || p.includes("email")) return <Mail className="h-4 w-4" />;
    return <Globe className="h-4 w-4" />;
  };

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12 lg:gap-16">
          {/* Left Text Column */}
          <div className="flex-1 text-center lg:text-left space-y-6">
            {/* Status Pill */}
            {availability && (
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-medium backdrop-blur-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{availability}</span>
              </div>
            )}

            <div className="space-y-2">
              <p className="text-sm md:text-base font-mono text-muted-foreground tracking-wide uppercase">
                {greeting}
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground">
                {name}
              </h1>
              <p className="text-xl sm:text-2xl font-semibold text-foreground/90 tracking-tight">
                {title}
              </p>
            </div>

            <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              {subtitle}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <Link href={primaryCtaUrl}>
                <Button size="lg" className="rounded-xl px-6 h-11 text-sm font-semibold shadow-md">
                  {primaryCtaText}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href={secondaryCtaUrl} target="_blank">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-xl px-6 h-11 text-sm font-medium border-border"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  {secondaryCtaText}
                </Button>
              </Link>
            </div>

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="pt-4 flex items-center justify-center lg:justify-start space-x-2">
                <span className="text-xs text-muted-foreground mr-1">Connect:</span>
                {socialLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    title={link.platform}
                  >
                    {getSocialIcon(link.platform)}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Right Avatar Column */}
          <div className="shrink-0 relative">
            <div className="relative h-56 w-56 sm:h-72 sm:w-72 lg:h-80 lg:w-80 rounded-3xl overflow-hidden border-2 border-border shadow-2xl bg-card">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={name}
                  fill
                  sizes="(max-width: 640px) 224px, (max-width: 1024px) 288px, 320px"
                  priority
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center text-3xl font-bold text-muted-foreground">
                  {name.charAt(0)}
                </div>
              )}
            </div>

            {/* Subtle decorative framing */}
            <div className="absolute -inset-2 rounded-3xl border border-primary/20 pointer-events-none -z-10 transform rotate-3" />
          </div>
        </div>
      </div>
    </section>
  );
}
