"use client";

import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactMessageSchema, type ContactMessageInput } from "@/lib/validations";
import { sendContactMessageAction } from "@/actions/messages";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Mail, Send, CheckCircle2, Loader2, MapPin, MessageSquare } from "lucide-react";
import { toast } from "sonner";

interface ContactProps {
  ownerEmail?: string | null;
  location?: string | null;
  availability?: string | null;
}

export function Contact({ ownerEmail, location, availability }: ContactProps) {
  const [isPending, startTransition] = useTransition();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactMessageInput>({
    resolver: zodResolver(contactMessageSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = (data: ContactMessageInput) => {
    startTransition(async () => {
      const res = await sendContactMessageAction(data);
      if (res.success) {
        setIsSubmitted(true);
        reset();
        toast.success("Thank you! Your message has been sent successfully.");
      } else {
        toast.error(res.error || "Failed to send message. Please try again.");
      }
    });
  };

  return (
    <section id="contact" className="py-20 md:py-28 border-t border-border/60 bg-muted/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <p className="text-xs font-mono uppercase tracking-widest text-primary font-semibold">
            Get In Touch
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Let&apos;s Build Together</h2>
          <p className="text-sm text-muted-foreground">
            Have an open high-impact role, consulting inquiry, or technical collaboration? Send a message directly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Info Side (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl border border-border bg-card space-y-6">
              <h3 className="text-lg font-bold text-foreground">Contact Channels</h3>

              <div className="space-y-4 text-xs sm:text-sm">
                {ownerEmail && (
                  <div className="flex items-start space-x-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Direct Email</p>
                      <a href={`mailto:${ownerEmail}`} className="text-muted-foreground hover:text-primary transition-colors">
                        {ownerEmail}
                      </a>
                    </div>
                  </div>
                )}

                {location && (
                  <div className="flex items-start space-x-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Base Location</p>
                      <p className="text-muted-foreground">{location}</p>
                    </div>
                  </div>
                )}

                {availability && (
                  <div className="flex items-start space-x-3">
                    <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0 mt-0.5">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Status</p>
                      <p className="text-muted-foreground">{availability}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-border/80 text-xs text-muted-foreground leading-relaxed">
                I typically respond to serious technical opportunities, advisory inquiries, and project discussions within 24 to 48 hours.
              </div>
            </div>
          </div>

          {/* Form Side (7 cols) */}
          <div className="lg:col-span-7">
            <Card className="border-border bg-card shadow-sm">
              <CardContent className="p-6 sm:p-8">
                {isSubmitted ? (
                  <div className="py-12 text-center space-y-4">
                    <div className="h-14 w-14 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="h-8 w-8" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-lg font-bold text-foreground">Message Dispatched!</h4>
                      <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                        Thank you for reaching out. Your inquiry was securely recorded and delivered to my inbox.
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setIsSubmitted(false)}
                      className="mt-4"
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="contact-name" className="text-xs font-medium">Your Name</Label>
                        <Input
                          id="contact-name"
                          {...register("name")}
                          placeholder="e.g. Alex Rivera"
                          className="text-sm"
                        />
                        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="contact-email" className="text-xs font-medium">Email Address</Label>
                        <Input
                          id="contact-email"
                          type="email"
                          {...register("email")}
                          placeholder="alex@company.com"
                          className="text-sm"
                        />
                        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="contact-subject" className="text-xs font-medium">Subject</Label>
                      <Input
                        id="contact-subject"
                        {...register("subject")}
                        placeholder="e.g. Senior Staff Engineering Opportunity / Architecture Consulting"
                        className="text-sm"
                      />
                      {errors.subject && <p className="text-xs text-destructive">{errors.subject.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="contact-message" className="text-xs font-medium">Message</Label>
                      <Textarea
                        id="contact-message"
                        {...register("message")}
                        rows={5}
                        placeholder="Describe your project, team requirements, timeline, or question in detail..."
                        className="text-sm"
                      />
                      {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
                    </div>

                    <Button type="submit" disabled={isPending} className="w-full h-10 text-sm font-semibold">
                      {isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending Message...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
