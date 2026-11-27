import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { BlogPostForm } from "@/components/admin/BlogPostForm";

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { id },
    include: {
      tags: {
        include: { tag: true },
      },
    },
  });

  if (!post) notFound();

  const formatted = {
    ...post,
    tags: post.tags.map((t) => t.tag.name),
    publishedDate: post.publishedDate ? post.publishedDate.toISOString().split("T")[0] : null,
  };

  return <BlogPostForm initialData={formatted} />;
}
