import type { Metadata } from "next";
import { cache } from "react";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { prisma } from "@/lib/db";
import "@/styles/globals.css";

// Cached getter to avoid duplicate queries across metadata generation
const getCachedSiteSettings = cache(async () => {
  return prisma.siteSettings.findFirst();
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getCachedSiteSettings();

  return {
    title: {
      default: settings?.seoTitle || "Hariharan | Senior Full-Stack Engineer",
      template: `%s | ${settings?.siteName || "Hariharan"}`,
    },
    description:
      settings?.seoDescription ||
      "Personal portfolio, engineering case studies, certifications, and technical writing.",
    keywords: settings?.seoKeywords?.split(",").map((k) => k.trim()) || [
      "Software Engineer",
      "Full-Stack Developer",
      "Next.js",
      "TypeScript",
      "PostgreSQL",
      "Portfolio",
    ],
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
    openGraph: {
      title: settings?.seoTitle || "Hariharan | Senior Software Engineer",
      description: settings?.seoDescription || "Senior Full-Stack Engineer Portfolio",
      images: settings?.ogImage ? [{ url: settings.ogImage }] : [],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
