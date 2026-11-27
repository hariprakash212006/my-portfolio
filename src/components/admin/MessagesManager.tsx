"use client";

import React, { useState } from "react";
import {
  Mail,
  MailOpen,
  Archive,
  Trash2,
  CheckCircle,
  Inbox,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import {
  toggleMessageReadAction,
  toggleMessageArchiveAction,
  deleteMessageAction,
} from "@/actions/messages";
import { formatFullDate } from "@/lib/utils";
import { toast } from "sonner";

interface MessageItem {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  isArchived: boolean;
  createdAt: Date;
}

interface MessagesManagerProps {
  initialMessages: MessageItem[];
}

export function MessagesManager({ initialMessages }: MessagesManagerProps) {
  const [messages, setMessages] = useState<MessageItem[]>(initialMessages);
  const [selectedMessage, setSelectedMessage] = useState<MessageItem | null>(
    initialMessages[0] || null
  );
  const [tab, setTab] = useState<"INBOX" | "ARCHIVED">("INBOX");

  const [itemToDelete, setItemToDelete] = useState<MessageItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const displayedMessages = messages.filter((m) =>
    tab === "INBOX" ? !m.isArchived : m.isArchived
  );

  const handleToggleRead = async (msg: MessageItem) => {
    const next = !msg.isRead;
    setMessages(messages.map((m) => (m.id === msg.id ? { ...m, isRead: next } : m)));
    if (selectedMessage?.id === msg.id) {
      setSelectedMessage({ ...selectedMessage, isRead: next });
    }
    await toggleMessageReadAction(msg.id, next);
  };

  const handleToggleArchive = async (msg: MessageItem) => {
    const next = !msg.isArchived;
    setMessages(messages.map((m) => (m.id === msg.id ? { ...m, isArchived: next } : m)));
    if (selectedMessage?.id === msg.id) {
      setSelectedMessage(null);
    }
    await toggleMessageArchiveAction(msg.id, next);
    toast.success(next ? "Message archived" : "Moved to inbox");
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    const res = await deleteMessageAction(itemToDelete.id);
    setIsDeleting(false);

    if (res.success) {
      toast.success("Message deleted");
      setMessages(messages.filter((m) => m.id !== itemToDelete.id));
      if (selectedMessage?.id === itemToDelete.id) {
        setSelectedMessage(null);
      }
      setItemToDelete(null);
    } else {
      toast.error(res.error || "Failed to delete message");
    }
  };

  const selectAndMarkRead = async (msg: MessageItem) => {
    setSelectedMessage(msg);
    if (!msg.isRead) {
      setMessages(messages.map((m) => (m.id === msg.id ? { ...m, isRead: true } : m)));
      await toggleMessageReadAction(msg.id, true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Contact Inquiries</h2>
          <p className="text-xs text-muted-foreground">
            Messages and project proposals submitted through the contact form
          </p>
        </div>

        <div className="flex items-center space-x-1 bg-muted p-1 rounded-xl">
          <Button
            size="sm"
            variant={tab === "INBOX" ? "secondary" : "ghost"}
            className="text-xs h-7"
            onClick={() => setTab("INBOX")}
          >
            <Inbox className="h-3.5 w-3.5 mr-1.5" />
            Inbox ({messages.filter((m) => !m.isArchived && !m.isRead).length})
          </Button>
          <Button
            size="sm"
            variant={tab === "ARCHIVED" ? "secondary" : "ghost"}
            className="text-xs h-7"
            onClick={() => setTab("ARCHIVED")}
          >
            <Archive className="h-3.5 w-3.5 mr-1.5" />
            Archived ({messages.filter((m) => m.isArchived).length})
          </Button>
        </div>
      </div>

      {displayedMessages.length === 0 ? (
        <div className="py-20 text-center border rounded-xl border-dashed border-border p-8 bg-card/40">
          <Mail className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-50" />
          <p className="text-sm font-medium">No messages in this folder.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Message List Sidebar */}
          <div className="space-y-2 max-h-[650px] overflow-y-auto pr-1">
            {displayedMessages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => selectAndMarkRead(msg)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedMessage?.id === msg.id
                    ? "border-primary bg-primary/5 shadow-sm"
                    : msg.isRead
                    ? "border-border bg-card hover:border-border/80"
                    : "border-primary/40 bg-card font-medium"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold truncate text-foreground">{msg.name}</span>
                  {!msg.isRead && (
                    <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
                  )}
                </div>
                <h5 className="text-xs text-foreground truncate mt-0.5">{msg.subject}</h5>
                <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">{msg.message}</p>
              </div>
            ))}
          </div>

          {/* Message Reader Pane */}
          <div className="md:col-span-2 border border-border bg-card rounded-2xl p-6 flex flex-col justify-between shadow-sm min-h-[400px]">
            {selectedMessage ? (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-2">
                  <div>
                    <h3 className="text-base font-bold text-foreground">{selectedMessage.subject}</h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-1">
                      <span>From: <strong className="text-foreground">{selectedMessage.name}</strong></span>
                      <span>·</span>
                      <a href={`mailto:${selectedMessage.email}`} className="text-primary hover:underline">
                        {selectedMessage.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1.5 self-start sm:self-center">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-8"
                      onClick={() => handleToggleRead(selectedMessage)}
                    >
                      {selectedMessage.isRead ? <Mail className="h-3.5 w-3.5 mr-1" /> : <MailOpen className="h-3.5 w-3.5 mr-1" />}
                      {selectedMessage.isRead ? "Mark Unread" : "Mark Read"}
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-8"
                      onClick={() => handleToggleArchive(selectedMessage)}
                    >
                      <Archive className="h-3.5 w-3.5 mr-1" />
                      {selectedMessage.isArchived ? "Unarchive" : "Archive"}
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => setItemToDelete(selectedMessage)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground flex items-center space-x-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Received on {formatFullDate(selectedMessage.createdAt)}</span>
                </div>

                <div className="text-sm leading-relaxed whitespace-pre-wrap bg-muted/20 p-4 rounded-xl border border-border">
                  {selectedMessage.message}
                </div>

                <div className="pt-4">
                  <a href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`}>
                    <Button size="sm">
                      <Mail className="h-4 w-4 mr-2" />
                      Reply via Email Client
                    </Button>
                  </a>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground py-20">
                <Mail className="h-8 w-8 mb-2 opacity-40" />
                <p className="text-xs">Select a message from the list to view its full contents</p>
              </div>
            )}
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!itemToDelete}
        onOpenChange={(open) => !open && setItemToDelete(null)}
        title="Delete Message?"
        description={`Are you sure you want to delete the message from "${itemToDelete?.name}"?`}
        confirmLabel="Delete"
        isLoading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
