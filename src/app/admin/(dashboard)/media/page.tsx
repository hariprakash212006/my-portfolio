import React from "react";
import { prisma } from "@/lib/db";
import { MediaLibrary } from "@/components/admin/MediaLibrary";

export default async function AdminMediaPage() {
  const media = await prisma.media.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <MediaLibrary initialMedia={media} />;
}
