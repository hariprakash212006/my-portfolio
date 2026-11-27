"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { blogPostSchema, type BlogPostInput } from "@/lib/validations";
import { slugify } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function createBlogPostAction(data: BlogPostInput) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const validated = blogPostSchema.safeParse(data);
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0].message };
    }

    const { tags, publishedDate, ...postData } = validated.data;

    const existingSlug = await prisma.blogPost.findUnique({
      where: { slug: postData.slug },
    });
    if (existingSlug) {
      return { success: false, error: "An article with this URL slug already exists." };
    }

    const post = await prisma.blogPost.create({
      data: {
        ...postData,
        publishedDate: postData.isPublished ? (publishedDate ? new Date(publishedDate) : new Date()) : null,
      },
    });

    if (tags && tags.length > 0) {
      for (const tagName of tags) {
        const cleanName = tagName.trim();
        if (!cleanName) continue;
        const tagSlug = slugify(cleanName);

        const tag = await prisma.blogTag.upsert({
          where: { slug: tagSlug },
          update: {},
          create: { name: cleanName, slug: tagSlug },
        });

        await prisma.blogPostTag.create({
          data: {
            postId: post.id,
            tagId: tag.id,
          },
        });
      }
    }

    await prisma.activityLog.create({
      data: {
        action: "BLOG_POST_CREATED",
        entityType: "BLOG_POST",
        entityId: post.id,
        details: `Created blog post: ${post.title}`,
        userId: session.user.id,
      },
    });

    revalidatePath("/blog");
    revalidatePath(`/blog/${post.slug}`);
    revalidatePath("/admin/blog");

    return { success: true, post };
  } catch (error: unknown) {
    console.error("createBlogPostAction error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to create blog post" };
  }
}

export async function updateBlogPostAction(id: string, data: BlogPostInput) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const validated = blogPostSchema.safeParse(data);
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0].message };
    }

    const { tags, publishedDate, ...postData } = validated.data;

    const existingSlug = await prisma.blogPost.findFirst({
      where: { slug: postData.slug, NOT: { id } },
    });
    if (existingSlug) {
      return { success: false, error: "A different article with this slug already exists." };
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        ...postData,
        publishedDate: postData.isPublished ? (publishedDate ? new Date(publishedDate) : new Date()) : null,
      },
    });

    // Re-link tags
    await prisma.blogPostTag.deleteMany({
      where: { postId: id },
    });

    if (tags && tags.length > 0) {
      for (const tagName of tags) {
        const cleanName = tagName.trim();
        if (!cleanName) continue;
        const tagSlug = slugify(cleanName);

        const tag = await prisma.blogTag.upsert({
          where: { slug: tagSlug },
          update: {},
          create: { name: cleanName, slug: tagSlug },
        });

        await prisma.blogPostTag.create({
          data: {
            postId: post.id,
            tagId: tag.id,
          },
        });
      }
    }

    await prisma.activityLog.create({
      data: {
        action: "BLOG_POST_UPDATED",
        entityType: "BLOG_POST",
        entityId: post.id,
        details: `Updated blog post: ${post.title}`,
        userId: session.user.id,
      },
    });

    revalidatePath("/blog");
    revalidatePath(`/blog/${post.slug}`);
    revalidatePath("/admin/blog");

    return { success: true, post };
  } catch (error: unknown) {
    console.error("updateBlogPostAction error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to update blog post" };
  }
}

export async function deleteBlogPostAction(id: string) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const post = await prisma.blogPost.delete({
      where: { id },
    });

    await prisma.activityLog.create({
      data: {
        action: "BLOG_POST_DELETED",
        entityType: "BLOG_POST",
        entityId: id,
        details: `Deleted blog post: ${post.title}`,
        userId: session.user.id,
      },
    });

    revalidatePath("/blog");
    revalidatePath("/admin/blog");

    return { success: true };
  } catch (error: unknown) {
    console.error("deleteBlogPostAction error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to delete blog post" };
  }
}

export async function toggleBlogPublishAction(id: string, isPublished: boolean) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        isPublished,
        publishedDate: isPublished ? new Date() : null,
      },
    });

    revalidatePath("/blog");
    revalidatePath(`/blog/${post.slug}`);
    revalidatePath("/admin/blog");

    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to update status" };
  }
}
