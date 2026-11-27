import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 text-center space-y-6">
      <div className="h-16 w-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-mono text-2xl font-bold">
        404
      </div>

      <div className="space-y-2 max-w-md">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Page Not Found</h1>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          The requested engineering case study, blog article, or route does not exist or may have been moved.
        </p>
      </div>

      <div className="flex items-center space-x-3">
        <Link href="/">
          <Button size="sm">
            <Home className="h-4 w-4 mr-1.5" /> Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
