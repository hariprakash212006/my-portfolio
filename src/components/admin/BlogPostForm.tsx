"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { blogPostSchema, type BlogPostInput } from "@/lib/validations";
import { createBlogPostAction, updateBlogPostAction } from "@/actions/blogs";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { slugify } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Eye, Plus, X } from "lucide-react";
import Link from "next/link";

interface BlogPostFormProps {
  initialData?: (BlogPostInput & { id: string }) | null;
}

export function BlogPostForm({ initialData }: BlogPostFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isEditing = !!initialData?.id;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BlogPostInput>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      coverImage: initialData?.coverImage || "",
      excerpt: initialData?.excerpt || "",
      content: initialData?.content || "<p>Start writing your technical article...</p>",
      author: initialData?.author || "Hariharan",
      tags: initialData?.tags || [],
      publishedDate: initialData?.publishedDate || "",
      isPublished: initialData?.isPublished ?? false,
      seoTitle: initialData?.seoTitle || "",
      seoDescription: initialData?.seoDescription || "",
    },
  });

  const title = watch("title");
  const slug = watch("slug");
  const coverImage = watch("coverImage");
  const content = watch("content");
  const tags = watch("tags") || [];
  const isPublished = watch("isPublished");

  const [tagInput, setTagInput] = useState("");

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setValue("title", newTitle);
    if (!isEditing || !slug) {
      setValue("slug", slugify(newTitle));
    }
  };

  const addTag = () => {
    if (!tagInput.trim()) return;
    setValue("tags", [...tags, tagInput.trim()]);
    setTagInput("");
  };

  const removeTag = (idx: number) => {
    setValue(
      "tags",
      tags.filter((_, i) => i !== idx)
    );
  };

  const onSubmit = (data: BlogPostInput) => {
    startTransition(async () => {
      const res = isEditing
        ? await updateBlogPostAction(initialData.id, data)
        : await createBlogPostAction(data);

      if (res.success) {
        toast.success(isEditing ? "Article updated" : "Article saved");
        router.push("/admin/blog");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to save article");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link href="/admin/blog">
            <Button type="button" variant="ghost" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h2 className="text-xl font-bold tracking-tight">
              {isEditing ? `Edit: ${initialData.title}` : "Write New Article"}
            </h2>
            <p className="text-xs text-muted-foreground">Draft or publish rich technical blogs with Tiptap</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {isEditing && (
            <Link href={`/blog/${slug}`} target="_blank">
              <Button type="button" variant="outline" size="sm" className="h-9">
                <Eye className="h-4 w-4 mr-1.5" />
                Live Preview
              </Button>
            </Link>
          )}
          <Button type="submit" disabled={isPending} className="h-9">
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : isEditing ? (
              "Update Article"
            ) : isPublished ? (
              "Publish Article"
            ) : (
              "Save Draft"
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Article Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label className="text-xs font-medium">Article Title</Label>
                <Input
                  {...register("title")}
                  onChange={handleTitleChange}
                  placeholder="e.g. Architecting Ultra-Low Latency Next.js 15 Apps"
                />
                {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs font-medium">URL Slug</Label>
                  <Input {...register("slug")} placeholder="architecting-low-latency-nextjs" />
                  {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-medium">Author Name</Label>
                  <Input {...register("author")} placeholder="Hariharan" />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-medium">Excerpt (Preview snippet)</Label>
                <Textarea
                  {...register("excerpt")}
                  rows={2}
                  placeholder="A compelling overview of the article shown in listings and social cards..."
                />
                {errors.excerpt && <p className="text-xs text-destructive">{errors.excerpt.message}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Tiptap Rich Text Editor */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Rich Article Content</CardTitle>
              <CardDescription className="text-xs">
                Supports headings, code formatting, bullet lists, blockquotes, and links
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RichTextEditor
                value={content}
                onChange={(html) => setValue("content", html)}
              />
              {errors.content && <p className="text-xs text-destructive mt-1.5">{errors.content.message}</p>}
            </CardContent>
          </Card>

          {/* Article SEO Metadata */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Search Engine Optimization (SEO)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <Label className="text-xs font-medium">Custom SEO Title (Optional)</Label>
                <Input {...register("seoTitle")} placeholder="Defaults to Article Title" />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-medium">Custom Meta Description (Optional)</Label>
                <Textarea {...register("seoDescription")} rows={2} placeholder="Defaults to Excerpt" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Cover Image</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload
                value={coverImage}
                onChange={(url) => setValue("coverImage", url)}
                onRemove={() => setValue("coverImage", "")}
                folder="portfolio/blog"
                label="Upload Cover Image"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Publish Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-xs font-medium">Published Status</Label>
                  <p className="text-[11px] text-muted-foreground">
                    {isPublished ? "Visible to public visitors" : "Saved as private draft"}
                  </p>
                </div>
                <Switch
                  checked={isPublished}
                  onCheckedChange={(val) => setValue("isPublished", val)}
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-medium">Publication Date</Label>
                <Input type="date" {...register("publishedDate")} />
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Tags & Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex space-x-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="e.g. Next.js, Architecture"
                  className="text-xs"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                />
                <Button type="button" variant="outline" size="sm" onClick={addTag}>
                  Add
                </Button>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {tags.map((t, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center space-x-1 text-xs bg-muted px-2.5 py-1 rounded-lg"
                  >
                    <span>{t}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(i)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
