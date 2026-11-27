import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import {
  FolderGit2,
  Award,
  Cpu,
  Briefcase,
  BookOpen,
  Mail,
  Plus,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  FileEdit,
  ExternalLink,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export default async function AdminDashboardPage() {
  // Aggregate statistics in parallel
  const [
    totalProjects,
    publishedProjects,
    totalCertificates,
    totalSkills,
    totalExperience,
    totalBlogPosts,
    totalMessages,
    unreadMessages,
    recentProjects,
    recentCertificates,
    recentMessages,
    recentActivities,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.project.count({ where: { isPublished: true } }),
    prisma.certificate.count(),
    prisma.skill.count(),
    prisma.experience.count(),
    prisma.blogPost.count(),
    prisma.contactMessage.count(),
    prisma.contactMessage.count({ where: { isRead: false } }),
    prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
    prisma.certificate.findMany({
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
    prisma.activityLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      include: { user: { select: { name: true } } },
    }),
  ]);

  const stats = [
    {
      title: "Total Projects",
      value: totalProjects,
      description: `${publishedProjects} published · ${totalProjects - publishedProjects} draft`,
      icon: FolderGit2,
      href: "/admin/projects",
    },
    {
      title: "Certifications",
      value: totalCertificates,
      description: "Verified credentials",
      icon: Award,
      href: "/admin/certificates",
    },
    {
      title: "Technical Skills",
      value: totalSkills,
      description: "Across all categories",
      icon: Cpu,
      href: "/admin/skills",
    },
    {
      title: "Experience Entries",
      value: totalExperience,
      description: "Career timeline records",
      icon: Briefcase,
      href: "/admin/experience",
    },
    {
      title: "Articles & Blog",
      value: totalBlogPosts,
      description: "Technical publications",
      icon: BookOpen,
      href: "/admin/blog",
    },
    {
      title: "Contact Inquiries",
      value: totalMessages,
      description: `${unreadMessages} unread messages`,
      icon: Mail,
      href: "/admin/messages",
      highlight: unreadMessages > 0,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner & Quick Action Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/60 backdrop-blur-md p-6 rounded-2xl border border-border shadow-sm">
        <div className="space-y-1">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">Overview Dashboard</h2>
          <p className="text-sm text-muted-foreground">
            Manage your personal brand, projects, technical skills, credentials, and settings.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link href="/admin/projects/new">
            <Button size="sm" className="h-9">
              <Plus className="h-4 w-4 mr-1.5" />
              Add Project
            </Button>
          </Link>
          <Link href="/admin/certificates/new">
            <Button variant="outline" size="sm" className="h-9">
              <Plus className="h-4 w-4 mr-1.5" />
              Add Certificate
            </Button>
          </Link>
          <Link href="/admin/blog/new">
            <Button variant="outline" size="sm" className="h-9">
              <Plus className="h-4 w-4 mr-1.5" />
              Write Article
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.title} href={stat.href}>
              <Card className="h-full hover:border-primary/40 transition-all hover:shadow-md cursor-pointer group">
                <CardContent className="p-4 flex flex-col justify-between h-full space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">{stat.title}</span>
                    <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
                    <p className={`text-[11px] truncate mt-0.5 ${stat.highlight ? "text-destructive font-medium" : "text-muted-foreground"}`}>
                      {stat.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* 2-Column Split: Recent Projects & Inbound Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base font-semibold">Recent Projects</CardTitle>
              <CardDescription className="text-xs">Latest engineering portfolio showcases</CardDescription>
            </div>
            <Link href="/admin/projects">
              <Button variant="ghost" size="sm" className="text-xs h-8">
                View All <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentProjects.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/20 hover:bg-muted/40 transition-colors"
              >
                <div className="min-w-0 pr-3">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-medium truncate">{p.title}</h4>
                    {p.isFeatured && (
                      <Badge variant="warning" className="text-[10px] px-1.5 py-0">
                        Featured
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">{p.shortDescription}</p>
                </div>
                <div className="flex items-center space-x-2 shrink-0">
                  <Badge variant={p.isPublished ? "success" : "secondary"} className="text-[10px]">
                    {p.isPublished ? "Published" : "Draft"}
                  </Badge>
                  <Link href={`/admin/projects/${p.id}/edit`}>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground">
                      <FileEdit className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Inbound Messages */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base font-semibold">Recent Messages</CardTitle>
              <CardDescription className="text-xs">Direct contact form inquiries</CardDescription>
            </div>
            <Link href="/admin/messages">
              <Button variant="ghost" size="sm" className="text-xs h-8">
                Inbox <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentMessages.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground">
                No inquiries received yet.
              </div>
            ) : (
              recentMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3 rounded-xl border transition-colors ${
                    msg.isRead
                      ? "border-border bg-card"
                      : "border-primary/30 bg-primary/5"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold">{msg.name}</span>
                    <span className="text-[10px] text-muted-foreground">{formatDate(msg.createdAt)}</span>
                  </div>
                  <p className="text-xs font-medium text-foreground mt-0.5">{msg.subject}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{msg.message}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* 2-Column Split: Certificates & Audit Activity Log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Certifications */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base font-semibold">Certifications</CardTitle>
              <CardDescription className="text-xs">Verified professional credentials</CardDescription>
            </div>
            <Link href="/admin/certificates">
              <Button variant="ghost" size="sm" className="text-xs h-8">
                Manage <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentCertificates.map((cert) => (
              <div
                key={cert.id}
                className="flex items-center justify-between p-3 rounded-xl border border-border bg-card"
              >
                <div>
                  <h4 className="text-sm font-medium">{cert.title}</h4>
                  <p className="text-xs text-muted-foreground">
                    {cert.issuingOrg} · Issued {formatDate(cert.issueDate)}
                  </p>
                </div>
                <Badge variant={cert.isPublished ? "success" : "secondary"} className="text-[10px]">
                  {cert.isPublished ? "Published" : "Draft"}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Audit Activity Log */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base font-semibold">Audit Activity Trail</CardTitle>
              <CardDescription className="text-xs">Recorded administration events</CardDescription>
            </div>
            <Link href="/admin/activity">
              <Button variant="ghost" size="sm" className="text-xs h-8">
                Full Log <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivities.map((log) => (
              <div key={log.id} className="flex items-start space-x-3 text-xs">
                <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground">{log.action}</p>
                  <p className="text-muted-foreground line-clamp-1">{log.details}</p>
                </div>
                <span className="text-[10px] text-muted-foreground shrink-0">{formatDate(log.createdAt)}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
