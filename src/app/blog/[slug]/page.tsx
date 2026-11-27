import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { formatDate, calculateReadingTime } from "@/lib/utils";
import { ArrowLeft, Calendar, Clock, User, Share2 } from "lucide-react";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateStaticParams() {
  const posts = await prisma.blogPost.findMany({
    where: { isPublished: true },
    select: { slug: true },
  });
  return posts.map((p) => ({ slug: p.slug }));
}

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug },
  });

  if (!post) return { title: "Article Not Found" };

  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  const [post, profile, settings, socialLinks] = await Promise.all([
    prisma.blogPost.findUnique({
      where: { slug },
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

  if (!post || !post.isPublished) {
    notFound();
  }

  const readingTime = calculateReadingTime(post.content);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar
        siteName={settings?.siteName || profile?.name || "Portfolio"}
        resumeUrl={profile?.resumeUrl || null}
      />

      <main className="flex-1 pt-32 pb-20">
        <article className="max-w-3xl mx-auto px-4 sm:px-6 space-y-8">
          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-1.5" /> Back to Articles
          </Link>

          {/* Article Header */}
          <header className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((t) => (
                <span
                  key={t.tag.name}
                  className="text-xs font-mono bg-primary/10 text-primary border border-primary/20 px-2.5 py-0.5 rounded-full"
                >
                  #{t.tag.name}
                </span>
              ))}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
              {post.title}
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              {post.excerpt}
            </p>

            <div className="flex items-center justify-between border-y border-border py-4 text-xs text-muted-foreground">
              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                  <User className="h-3.5 w-3.5 mr-1.5" />
                  {profile?.name || "Hariharan"}
                </span>
                <span className="flex items-center">
                  <Calendar className="h-3.5 w-3.5 mr-1.5" />
                  {formatDate(post.publishedDate)}
                </span>
                <span className="flex items-center">
                  <Clock className="h-3.5 w-3.5 mr-1.5" />
                  {readingTime}
                </span>
              </div>
            </div>
          </header>

          {/* Cover image if available */}
          {post.coverImage && (
            <div className="relative h-64 sm:h-96 w-full rounded-2xl overflow-hidden border border-border bg-muted">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Article Content */}
          <div
            className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-img:rounded-xl leading-relaxed text-sm sm:text-base"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
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