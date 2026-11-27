import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { formatDate } from "@/lib/utils";
import { Calendar, ArrowRight, BookOpen } from "lucide-react";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Engineering Articles & Insights",
  description: "Technical writings on architecture, Next.js, distributed databases, and high-scale systems.",
};

export default async function BlogListingPage() {
  const [posts, profile, settings, socialLinks] = await Promise.all([
    prisma.blogPost.findMany({
      where: { isPublished: true },
      orderBy: { publishedDate: "desc" },
      include: {
        tags: {
          include: { tag: true },
        },
      },
    }),
    prisma.profile.findFirst(),
    prisma.siteSettings.findFirst(),
    prisma.socialLink.findMany({
      where: { isEnabled: true },
      orderBy: { displayOrder: "asc" },
    }),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar
        siteName={settings?.siteName || profile?.name || "Portfolio"}
        resumeUrl={profile?.resumeUrl || null}
      />

      <main className="flex-1 pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-12">
          {/* Header */}
          <div className="space-y-4 text-center max-w-2xl mx-auto">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mx-auto">
              <BookOpen className="h-6 w-6" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Engineering Articles & Thoughts</h1>
            <p className="text-sm text-muted-foreground">
              Deep dives, case study breakdowns, and best practices from shipping distributed systems, Next.js applications, and database optimizations.
            </p>
          </div>

          {/* Posts List */}
          <div className="space-y-6">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group block p-6 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-lg transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{formatDate(post.publishedDate)}</span>
                  </div>

                  <h2 className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>

                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex flex-wrap gap-1.5">
                      {post.tags.map((t) => (
                        <span
                          key={t.tag.name}
                          className="text-[11px] font-mono bg-muted/80 text-muted-foreground px-2 py-0.5 rounded"
                        >
                          #{t.tag.name}
                        </span>
                      ))}
                    </div>

                    <span className="text-xs font-semibold text-primary inline-flex items-center group-hover:translate-x-1 transition-transform">
                      Read article <ArrowRight className="h-3.5 w-3.5 ml-1" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}

            {posts.length === 0 && (
              <div className="text-center py-16 text-muted-foreground">
                <p>No articles published yet. Check back soon!</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer
        name={profile?.name || settings?.ownerName || "Hariharan"}
        tagline={
          settings?.siteDescription ||
          "Architecting scalable systems & user-focused digital experiences"
        }
        location={settings?.location || profile?.location}
        socialLinks={socialLinks}
      />
    </div>
  );
}