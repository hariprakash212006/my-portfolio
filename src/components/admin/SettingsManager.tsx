"use client";

import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { siteSettingsSchema, type SiteSettingsInput, type SocialLinkInput } from "@/lib/validations";
import { updateSiteSettingsAction } from "@/actions/settings";
import {
  createSocialLinkAction,
  updateSocialLinkAction,
  deleteSocialLinkAction,
} from "@/actions/social";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { ReorderableList } from "@/components/admin/ReorderableList";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, Plus, FileEdit, Trash2, Globe, Save } from "lucide-react";

interface SocialLinkItem {
  id: string;
  platform: string;
  url: string;
  icon?: string | null;
  isEnabled: boolean;
  displayOrder: number;
}

interface SettingsManagerProps {
  initialSettings: SiteSettingsInput | null;
  initialSocialLinks: SocialLinkItem[];
}

export function SettingsManager({ initialSettings, initialSocialLinks }: SettingsManagerProps) {
  const [isPending, startTransition] = useTransition();
  const [socialLinks, setSocialLinks] = useState<SocialLinkItem[]>(initialSocialLinks);

  // Social link modal
  const [socialModalOpen, setSocialModalOpen] = useState(false);
  const [editingSocial, setEditingSocial] = useState<SocialLinkItem | null>(null);
  const [socialFormData, setSocialFormData] = useState<SocialLinkInput>({
    platform: "",
    url: "",
    icon: "Globe",
    isEnabled: true,
    displayOrder: 0,
  });
  const [socialToDelete, setSocialToDelete] = useState<SocialLinkItem | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SiteSettingsInput>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: {
      siteName: initialSettings?.siteName || "Hariharan Portfolio",
      siteDescription:
        initialSettings?.siteDescription || "Senior Full-Stack Engineer & Cloud Architect Portfolio",
      ownerName: initialSettings?.ownerName || "Hariharan",
      ownerEmail: initialSettings?.ownerEmail || "contact@example.com",
      location: initialSettings?.location || "San Francisco, CA",
      timezone: initialSettings?.timezone || "UTC",
      heroGreeting: initialSettings?.heroGreeting || "Hello, I'm",
      heroTitle: initialSettings?.heroTitle || "Senior Full-Stack Engineer & Cloud Architect",
      heroSubtitle:
        initialSettings?.heroSubtitle ||
        "Architecting scalable distributed backends, ultra-performant Next.js applications, and resilient cloud infrastructure.",
      primaryCtaText: initialSettings?.primaryCtaText || "View My Work",
      primaryCtaUrl: initialSettings?.primaryCtaUrl || "#projects",
      secondaryCtaText: initialSettings?.secondaryCtaText || "Download Resume",
      secondaryCtaUrl: initialSettings?.secondaryCtaUrl || "/resume",
      primaryColor: initialSettings?.primaryColor || "emerald",
      appearanceMode: initialSettings?.appearanceMode || "system",
      navSections: initialSettings?.navSections || {
        about: true,
        skills: true,
        experience: true,
        education: true,
        projects: true,
        certifications: true,
        achievements: true,
        blog: true,
        contact: true,
      },
      enableBlog: initialSettings?.enableBlog ?? true,
      enableContactForm: initialSettings?.enableContactForm ?? true,
      seoTitle: initialSettings?.seoTitle || "Hariharan | Senior Software Engineer",
      seoDescription: initialSettings?.seoDescription || "Explore my engineering portfolio...",
      seoKeywords: initialSettings?.seoKeywords || "software engineer, full-stack developer",
      ogImage: initialSettings?.ogImage || "",
    },
  });

  const navSections = watch("navSections") || {};
  const ogImage = watch("ogImage");
  const enableBlog = watch("enableBlog");
  const enableContactForm = watch("enableContactForm");

  const toggleNavSection = (key: string, val: boolean) => {
    setValue("navSections", {
      ...navSections,
      [key]: val,
    });
  };

  const onSubmit = (data: SiteSettingsInput) => {
    startTransition(async () => {
      const res = await updateSiteSettingsAction(data);
      if (res.success) {
        toast.success("Settings updated successfully");
      } else {
        toast.error(res.error || "Failed to update settings");
      }
    });
  };

  // Social link helpers
  const openAddSocial = () => {
    setEditingSocial(null);
    setSocialFormData({
      platform: "",
      url: "",
      icon: "Globe",
      isEnabled: true,
      displayOrder: 0,
    });
    setSocialModalOpen(true);
  };

  const openEditSocial = (link: SocialLinkItem) => {
    setEditingSocial(link);
    setSocialFormData({
      platform: link.platform,
      url: link.url,
      icon: link.icon || "Globe",
      isEnabled: link.isEnabled,
      displayOrder: link.displayOrder,
    });
    setSocialModalOpen(true);
  };

  const handleSaveSocial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!socialFormData.platform.trim() || !socialFormData.url.trim()) {
      toast.error("Platform and URL are required");
      return;
    }

    const res = editingSocial
      ? await updateSocialLinkAction(editingSocial.id, socialFormData)
      : await createSocialLinkAction(socialFormData);

    if (res.success) {
      toast.success(editingSocial ? "Social link updated" : "Social link added");
      if (editingSocial) {
        setSocialLinks(socialLinks.map((s) => (s.id === editingSocial.id ? (res.link as SocialLinkItem) : s)));
      } else {
        setSocialLinks([...socialLinks, res.link as SocialLinkItem]);
      }
      setSocialModalOpen(false);
    } else {
      toast.error(res.error || "Failed to save social link");
    }
  };

  const handleDeleteSocial = async () => {
    if (!socialToDelete) return;
    const res = await deleteSocialLinkAction(socialToDelete.id);
    if (res.success) {
      toast.success("Social link deleted");
      setSocialLinks(socialLinks.filter((s) => s.id !== socialToDelete.id));
      setSocialToDelete(null);
    } else {
      toast.error(res.error || "Failed to delete social link");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Website & SEO Settings</h2>
          <p className="text-xs text-muted-foreground">
            Configure site metadata, visible sections, social handles, and SEO tags
          </p>
        </div>

        <Button type="submit" disabled={isPending} className="h-9">
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save All Settings
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="navigation">Section Visibility</TabsTrigger>
          <TabsTrigger value="social">Social Links</TabsTrigger>
          <TabsTrigger value="seo">SEO & Metadata</TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">General Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs font-medium">Website Name</Label>
                  <Input {...register("siteName")} />
                  {errors.siteName && <p className="text-xs text-destructive">{errors.siteName.message}</p>}
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-medium">Owner Name</Label>
                  <Input {...register("ownerName")} />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-medium">Website Tagline / Description</Label>
                <Input {...register("siteDescription")} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs font-medium">Contact / Owner Email</Label>
                  <Input {...register("ownerEmail")} />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-medium">Location</Label>
                  <Input {...register("location")} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hero Content Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Hero Section Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs font-medium">Greeting</Label>
                  <Input {...register("heroGreeting")} placeholder="Hello, I'm" />
                </div>

                <div className="md:col-span-2 space-y-1">
                  <Label className="text-xs font-medium">Hero Headline Title</Label>
                  <Input {...register("heroTitle")} placeholder="Senior Full-Stack Engineer" />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-medium">Hero Subtitle</Label>
                <Textarea {...register("heroSubtitle")} rows={2} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 border p-3 rounded-xl border-border">
                  <Label className="text-xs font-semibold">Primary CTA Button</Label>
                  <Input {...register("primaryCtaText")} placeholder="Button Text (e.g. View My Work)" />
                  <Input {...register("primaryCtaUrl")} placeholder="Target URL (e.g. #projects)" />
                </div>

                <div className="space-y-2 border p-3 rounded-xl border-border">
                  <Label className="text-xs font-semibold">Secondary CTA Button</Label>
                  <Input {...register("secondaryCtaText")} placeholder="Button Text (e.g. Download Resume)" />
                  <Input {...register("secondaryCtaUrl")} placeholder="Target URL (e.g. /resume)" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Navigation & Section Visibility Tab */}
        <TabsContent value="navigation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Section Visibility & Navigation</CardTitle>
              <CardDescription className="text-xs">
                Toggle which sections appear on the public portfolio navbar and homepage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: "about", label: "About Section", desc: "Bio, career metrics, and highlights" },
                { key: "skills", label: "Skills Section", desc: "Technical proficiency cards and categories" },
                { key: "experience", label: "Experience Section", desc: "Interactive career timeline" },
                { key: "education", label: "Education Section", desc: "Degrees, academic honors, and institutions" },
                { key: "projects", label: "Projects Section", desc: "Featured case studies and showcase" },
                { key: "certifications", label: "Certifications Section", desc: "Licenses, credentials, and digital badges" },
                { key: "achievements", label: "Achievements Section", desc: "Awards, hackathons, and publications" },
                { key: "blog", label: "Articles & Blog", desc: "Technical writing and articles preview" },
                { key: "contact", label: "Contact Form", desc: "Public inquiry form with email notifications" },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-3 rounded-xl border border-border bg-card"
                >
                  <div>
                    <h5 className="text-xs font-semibold text-foreground">{item.label}</h5>
                    <p className="text-[11px] text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch
                    checked={navSections[item.key] ?? true}
                    onCheckedChange={(val) => toggleNavSection(item.key, val)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Links Tab */}
        <TabsContent value="social" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-semibold">Public Social Media Profiles</CardTitle>
                <CardDescription className="text-xs">
                  Reorder and manage external profile links (GitHub, LinkedIn, Twitter, Email)
                </CardDescription>
              </div>
              <Button type="button" size="sm" onClick={openAddSocial} className="h-8 text-xs">
                <Plus className="h-3.5 w-3.5 mr-1" />
                Add Link
              </Button>
            </CardHeader>
            <CardContent>
              {socialLinks.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  No social profiles configured yet.
                </div>
              ) : (
                <ReorderableList
                  entity="socialLink"
                  items={socialLinks}
                  onOrderChanged={(updated) => setSocialLinks(updated)}
                  renderItem={(link) => (
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center space-x-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <span className="text-xs font-semibold text-foreground">{link.platform}</span>
                          <p className="text-[11px] text-muted-foreground font-mono truncate max-w-xs">
                            {link.url}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1.5">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground"
                          onClick={() => openEditSocial(link)}
                        >
                          <FileEdit className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          onClick={() => setSocialToDelete(link)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  )}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO Tab */}
        <TabsContent value="seo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Search Engine Optimization (SEO)</CardTitle>
              <CardDescription className="text-xs">
                Default Open Graph metadata, title tags, and search preview
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label className="text-xs font-medium">Meta Title Tag</Label>
                <Input {...register("seoTitle")} placeholder="Hariharan | Senior Software Engineer" />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-medium">Meta Description</Label>
                <Textarea
                  {...register("seoDescription")}
                  rows={3}
                  placeholder="Explore my portfolio, featured engineering projects, certifications, technical skills..."
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-medium">Keywords (comma-separated)</Label>
                <Input
                  {...register("seoKeywords")}
                  placeholder="software engineer, full-stack developer, nextjs, react, typescript"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-medium">Open Graph Image (1200x630)</Label>
                <ImageUpload
                  value={ogImage}
                  onChange={(url) => setValue("ogImage", url)}
                  onRemove={() => setValue("ogImage", "")}
                  folder="portfolio/seo"
                  label="Upload OG Share Banner"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Social Modal */}
      <Dialog open={socialModalOpen} onOpenChange={setSocialModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingSocial ? "Edit Social Link" : "Add Social Link"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 pt-2">
            <div className="space-y-1">
              <Label className="text-xs font-medium">Platform Name</Label>
              <Input
                value={socialFormData.platform}
                onChange={(e) => setSocialFormData({ ...socialFormData, platform: e.target.value })}
                placeholder="GitHub, LinkedIn, Twitter / X, Email..."
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium">Profile URL</Label>
              <Input
                value={socialFormData.url}
                onChange={(e) => setSocialFormData({ ...socialFormData, url: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <DialogFooter className="pt-3">
              <Button type="button" variant="outline" onClick={() => setSocialModalOpen(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={handleSaveSocial}>
                {editingSocial ? "Update Link" : "Add Link"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!socialToDelete}
        onOpenChange={(open) => !open && setSocialToDelete(null)}
        title="Delete Social Link?"
        description={`Are you sure you want to delete ${socialToDelete?.platform}?`}
        confirmLabel="Delete"
        onConfirm={handleDeleteSocial}
      />
    </form>
  );
}
