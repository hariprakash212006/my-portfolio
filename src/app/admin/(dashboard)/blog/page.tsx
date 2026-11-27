import React from "react";
import { prisma } from "@/lib/db";
import { BlogManager } from "@/components/admin/BlogManager";

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      tags: {
        include: {
          tag: {
            select: { name: true },
          },
        },
      },
    },
  });

  return <BlogManager initialPosts={posts} />;
}
