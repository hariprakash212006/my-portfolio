"use client";

import React, { useState } from "react";
import { GripVertical, ArrowUp, ArrowDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { reorderItemsAction, type ReorderableEntity } from "@/actions/reorder";
import { toast } from "sonner";

interface ReorderableListProps<T extends { id: string }> {
  entity: ReorderableEntity;
  items: T[];
  onOrderChanged?: (newItems: T[]) => void;
  renderItem: (item: T, index: number) => React.ReactNode;
}

export function ReorderableList<T extends { id: string }>({
  entity,
  items: initialItems,
  onOrderChanged,
  renderItem,
}: ReorderableListProps<T>) {
  const [items, setItems] = useState<T[]>(initialItems);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [isPersisting, setIsPersisting] = useState(false);

  // Sync if props update
  React.useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const persistOrder = async (newItems: T[]) => {
    setItems(newItems);
    if (onOrderChanged) onOrderChanged(newItems);

    setIsPersisting(true);
    const orderedIds = newItems.map((it) => it.id);
    const res = await reorderItemsAction(entity, orderedIds);
    setIsPersisting(false);

    if (res.success) {
      toast.success("Order updated successfully");
    } else {
      toast.error(res.error || "Failed to update order");
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const updated = [...items];
    const [draggedItem] = updated.splice(draggedIndex, 1);
    updated.splice(index, 0, draggedItem);
    setDraggedIndex(index);
    setItems(updated);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    persistOrder(items);
  };

  const moveItem = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const updated = [...items];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    persistOrder(updated);
  };

  return (
    <div className="relative space-y-2">
      {isPersisting && (
        <div className="absolute top-2 right-2 z-10 flex items-center space-x-1.5 bg-background/80 backdrop-blur px-2.5 py-1 rounded-md border border-border text-xs text-muted-foreground shadow-sm">
          <Loader2 className="h-3 w-3 animate-spin text-primary" />
          <span>Saving order...</span>
        </div>
      )}

      {items.map((item, index) => (
        <div
          key={item.id}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragEnd={handleDragEnd}
          className={`flex items-center space-x-2 rounded-xl border border-border bg-card p-3 transition-all ${
            draggedIndex === index
              ? "opacity-50 ring-2 ring-primary scale-[0.99] shadow-lg"
              : "hover:border-primary/40 hover:shadow-sm"
          }`}
        >
          <div className="flex items-center space-x-1 text-muted-foreground cursor-grab active:cursor-grabbing px-1">
            <GripVertical className="h-4 w-4" />
          </div>

          <div className="flex-1 min-w-0">{renderItem(item, index)}</div>

          <div className="flex items-center space-x-0.5">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
              disabled={index === 0 || isPersisting}
              onClick={() => moveItem(index, "up")}
              title="Move Up"
            >
              <ArrowUp className="h-3.5 w-3.5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
              disabled={index === items.length - 1 || isPersisting}
              onClick={() => moveItem(index, "down")}
              title="Move Down"
            >
              <ArrowDown className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
