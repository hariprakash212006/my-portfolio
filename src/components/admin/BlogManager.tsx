"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, BookOpen, FileEdit, Trash2, Eye, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { deleteBlogPostAction, toggleBlogPublishAction } from "@/actions/blogs";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

interface BlogPostItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage?: string | null;
  author: string;
  publishedDate?: Date | null;
  isPublished: boolean;
  createdAt: Date;
  tags: {
    tag: {
      name: string;
    };
  }[];
}

interface BlogManagerProps {
  initialPosts: BlogPostItem[];
}

export function BlogManager({ initialPosts }: BlogManagerProps) {
  const [posts, setPosts] = useState<BlogPostItem[]>(initialPosts);
  const [searchQuery, setSearchQuery] = useState("");
  const [itemToDelete, setItemToDelete] = useState<BlogPostItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filtered = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTogglePublish = async (id: string, current: boolean) => {
    const next = !current;
    setPosts(posts.map((p) => (p.id === id ? { ...p, isPublished: next } : p)));
    const res = await toggleBlogPublishAction(id, next);
    if (res.success) {
      toast.success(next ? "Article published" : "Article unpublished");
    } else {
      toast.error("Failed to update status");
      setPosts(posts.map((p) => (p.id === id ? { ...p, isPublished: current } : p)));
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    const res = await deleteBlogPostAction(itemToDelete.id);
    setIsDeleting(false);

    if (res.success) {
      toast.success("Article deleted");
      setPosts(posts.filter((p) => p.id !== itemToDelete.id));
      setItemToDelete(null);
    } else {
      toast.error(res.error || "Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Articles & Blog Posts</h2>
          <p className="text-xs text-muted-foreground">Manage your technical writing, insights, and publications</p>
        </div>
        <Link href="/admin/blog/new">
          <Button size="sm" className="h-9">
            <Plus className="h-4 w-4 mr-1.5" />
            Write Article
          </Button>
        </Link>
      </div>

      <div className="relative w-full sm:w-72">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 h-9 text-xs"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="py-16 text-center border rounded-xl border-dashed border-border p-8 bg-card/40">
          <p className="text-sm font-medium">No blog posts found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((post) => (
            <div
              key={post.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-border bg-card hover:border-primary/40 transition-colors gap-3"
            >
              <div className="flex items-center space-x-3 min-w-0">
                <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-semibold text-foreground truncate">{post.title}</h4>
                    <Badge variant={post.isPublished ? "success" : "secondary"} className="text-[10px]">
                      {post.isPublished ? "Published" : "Draft"}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-0.5">
                    <span>By {post.author}</span>
                    <span>·</span>
                    <span>{post.publishedDate ? formatDate(post.publishedDate) : `Draft created ${formatDate(post.createdAt)}`}</span>
                    {post.tags.slice(0, 3).map((t, i) => (
                      <span key={i} className="bg-muted px-1.5 py-0.2 rounded text-[10px]">
                        {t.tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 self-end sm:self-center shrink-0">
                <div className="flex items-center space-x-2 mr-2">
                  <span className="text-[11px] text-muted-foreground">
                    {post.isPublished ? "Published" : "Draft"}
                  </span>
                  <Switch
                    checked={post.isPublished}
                    onCheckedChange={() => handleTogglePublish(post.id, post.isPublished)}
                  />
                </div>

                <Link href={`/blog/${post.slug}`} target="_blank">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" title="Preview Article">
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href={`/admin/blog/${post.id}/edit`}>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                    <FileEdit className="h-4 w-4" />
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => setItemToDelete(post)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!itemToDelete}
        onOpenChange={(open) => !open && setItemToDelete(null)}
        title="Delete Article?"
        description={`Are you sure you want to delete "${itemToDelete?.title}"?`}
        confirmLabel="Delete"
        isLoading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
