import React from "react";
import { prisma } from "@/lib/db";
import { MessagesManager } from "@/components/admin/MessagesManager";

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <MessagesManager initialMessages={messages} />;
}
