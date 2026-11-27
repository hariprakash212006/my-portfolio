import React from "react";
import { prisma } from "@/lib/db";
import { Clock, Shield, History } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatFullDate } from "@/lib/utils";

export default async function AdminActivityPage() {
  const logs = await prisma.activityLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      user: {
        select: { name: true, email: true },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Audit Activity Trail</h2>
        <p className="text-xs text-muted-foreground">
          Historical log of administrative actions, content updates, and file modifications
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center space-x-2">
            <History className="h-4 w-4 text-primary" />
            <span>Recorded System Events ({logs.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted-foreground">
              No audit logs recorded yet.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {logs.map((log) => (
                <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-[10px] font-mono">
                        {log.action}
                      </Badge>
                      <span className="text-[11px] text-muted-foreground font-mono">
                        [{log.entityType}]
                      </span>
                    </div>
                    <p className="text-foreground text-xs mt-1">{log.details}</p>
                  </div>

                  <div className="flex items-center space-x-3 text-muted-foreground text-[11px] shrink-0 self-end sm:self-center">
                    <span>By {log.user?.name || "System Admin"}</span>
                    <span>·</span>
                    <span className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{formatFullDate(log.createdAt)}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
