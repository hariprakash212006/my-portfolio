"use client";

import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write rich content here...",
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert max-w-none min-h-[160px] p-4 focus:outline-none text-sm text-foreground",
      },
    },
  });

  if (!editor) {
    return (
      <div className="border border-input rounded-xl min-h-[160px] p-4 bg-background animate-pulse" />
    );
  }

  return (
    <div className="border border-input rounded-xl overflow-hidden bg-background focus-within:ring-2 focus-within:ring-ring">
      <div className="border-b border-border bg-muted/40 p-1.5 flex flex-wrap items-center gap-1">
        <Button
          type="button"
          size="sm"
          variant={editor.isActive("bold") ? "secondary" : "ghost"}
          className="h-7 w-7 p-0"
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-3.5 w-3.5" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive("italic") ? "secondary" : "ghost"}
          className="h-7 w-7 p-0"
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-3.5 w-3.5" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive("strike") ? "secondary" : "ghost"}
          className="h-7 w-7 p-0"
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough className="h-3.5 w-3.5" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive("code") ? "secondary" : "ghost"}
          className="h-7 w-7 p-0"
          onClick={() => editor.chain().focus().toggleCode().run()}
        >
          <Code className="h-3.5 w-3.5" />
        </Button>

        <div className="h-4 w-px bg-border mx-1" />

        <Button
          type="button"
          size="sm"
          variant={editor.isActive("heading", { level: 2 }) ? "secondary" : "ghost"}
          className="h-7 w-7 p-0"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 className="h-3.5 w-3.5" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive("heading", { level: 3 }) ? "secondary" : "ghost"}
          className="h-7 w-7 p-0"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <Heading3 className="h-3.5 w-3.5" />
        </Button>

        <div className="h-4 w-px bg-border mx-1" />

        <Button
          type="button"
          size="sm"
          variant={editor.isActive("bulletList") ? "secondary" : "ghost"}
          className="h-7 w-7 p-0"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="h-3.5 w-3.5" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive("orderedList") ? "secondary" : "ghost"}
          className="h-7 w-7 p-0"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="h-3.5 w-3.5" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive("blockquote") ? "secondary" : "ghost"}
          className="h-7 w-7 p-0"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote className="h-3.5 w-3.5" />
        </Button>

        <div className="h-4 w-px bg-border mx-1 ml-auto" />

        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="h-7 w-7 p-0"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <Undo className="h-3.5 w-3.5" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="h-7 w-7 p-0"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <Redo className="h-3.5 w-3.5" />
        </Button>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
