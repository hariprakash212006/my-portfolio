"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 text-center space-y-6">
      <div className="h-16 w-16 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center text-destructive">
        <AlertCircle className="h-8 w-8" />
      </div>

      <div className="space-y-2 max-w-md">
        <h1 className="text-xl font-bold tracking-tight text-foreground">Something went wrong</h1>
        <p className="text-xs text-muted-foreground leading-relaxed">
          An unexpected error occurred while rendering this page. Our telemetry has logged the issue.
        </p>
      </div>

      <Button size="sm" onClick={() => reset()}>
        <RefreshCw className="h-4 w-4 mr-1.5" /> Try Again
      </Button>
    </div>
  );
}
