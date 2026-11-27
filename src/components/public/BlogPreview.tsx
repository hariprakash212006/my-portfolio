import React from "react";
import Link from "next/link";
import { BookOpen, ArrowRight, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface BlogPostItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  publishedDate?: Date | null;
  coverImage?: string | null;
  tags: {
    tag: {
      name: string;
    };
  }[];
}

interface BlogPreviewProps {
  posts: BlogPostItem[];
}

export function BlogPreview({ posts }: BlogPreviewProps) {
  if (posts.length === 0) return null;

  return (
    <section id="blog" className="py-20 md:py-28 border-t border-border/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs font-mono uppercase tracking-widest text-primary font-semibold">
              Writing & Research
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Recent Articles</h2>
            <p className="text-sm text-muted-foreground">
              Deep dives into architecture, database optimization, and modern web frameworks
            </p>
          </div>
          <Link href="/blog">
            <Button variant="outline" size="sm" className="rounded-xl text-xs h-9">
              All Articles <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
            </Button>
          </Link>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group rounded-2xl border border-border bg-card p-6 shadow-sm hover:border-primary/40 hover:shadow-lg transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{formatDate(post.publishedDate)}</span>
                  {post.tags.slice(0, 2).map((t, i) => (
                    <span
                      key={i}
                      className="bg-muted px-2 py-0.5 rounded text-[11px] font-mono text-muted-foreground"
                    >
                      {t.tag.name}
                    </span>
                  ))}
                </div>

                <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors tracking-tight">
                  {post.title}
                </h3>

                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
              </div>

              <div className="text-xs font-semibold text-primary inline-flex items-center pt-2">
                Read Article
                <ArrowRight className="h-3.5 w-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
