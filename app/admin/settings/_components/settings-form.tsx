"use client";

import { useRef, useState } from "react";
import { type Settings } from "@prisma/client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { updateSettings } from "../actions";

interface SettingsFormProps {
  settings: Settings | null;
}

export function SettingsForm({ settings }: SettingsFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<{ success?: string; error?: string } | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formRef.current) return;

    setPending(true);
    setResult(null);
    const formData = new FormData(formRef.current);
    const result = await updateSettings(formData);
    setPending(false);
    setResult(result);
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      <Accordion type="single" collapsible defaultValue="" className="space-y-4">
        <AccordionItem value="general" className="rounded-2xl border bg-card p-5 shadow-sm">
          <AccordionTrigger className="text-lg font-semibold">General Settings</AccordionTrigger>
          <AccordionContent className="pt-4 space-y-4">
            <label className="flex flex-col gap-2 text-sm font-medium">
              Website Name
              <input type="text" name="websiteName" defaultValue={settings?.websiteName ?? ""} className="rounded-md border bg-background px-3 py-2 text-base outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/40" />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium">
              Website Logo URL
              <input type="text" name="websiteLogoUrl" defaultValue={settings?.websiteLogoUrl ?? ""} className="rounded-md border bg-background px-3 py-2 text-base outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/40" />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium">
              Website Favicon URL
              <input type="text" name="websiteFaviconUrl" defaultValue={settings?.websiteFaviconUrl ?? ""} className="rounded-md border bg-background px-3 py-2 text-base outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/40" />
            </label>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="contact" className="rounded-2xl border bg-card p-5 shadow-sm">
          <AccordionTrigger className="text-lg font-semibold">Contact Information</AccordionTrigger>
          <AccordionContent className="pt-4 space-y-4">
            <label className="flex flex-col gap-2 text-sm font-medium">
              Phone Number
              <input type="text" name="contactPhone" defaultValue={settings?.contactPhone ?? ""} className="rounded-md border bg-background px-3 py-2 text-base outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/40" />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium">
              Email Address
              <input type="email" name="contactEmail" defaultValue={settings?.contactEmail ?? ""} className="rounded-md border bg-background px-3 py-2 text-base outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/40" />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium">
              Address
              <textarea name="contactAddress" defaultValue={settings?.contactAddress ?? ""} rows={3} className="rounded-md border bg-background px-3 py-2 text-base outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/40" />
            </label>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="smtp" className="rounded-2xl border bg-card p-5 shadow-sm">
          <AccordionTrigger className="text-lg font-semibold">SMTP Settings</AccordionTrigger>
          <AccordionContent className="pt-4 space-y-4">
            <label className="flex flex-col gap-2 text-sm font-medium">
              SMTP Host
              <input type="text" name="smtpHost" defaultValue={settings?.smtpHost ?? ""} className="rounded-md border bg-background px-3 py-2 text-base outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/40" />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium">
              SMTP Port
              <input type="number" name="smtpPort" defaultValue={settings?.smtpPort ?? ""} className="rounded-md border bg-background px-3 py-2 text-base outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/40" />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium">
              SMTP User
              <input type="text" name="smtpUser" defaultValue={settings?.smtpUser ?? ""} className="rounded-md border bg-background px-3 py-2 text-base outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/40" />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium">
              SMTP Password
              <input type="password" name="smtpPass" placeholder="••••••••" className="rounded-md border bg-background px-3 py-2 text-base outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/40" />
            </label>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="stripe" className="rounded-2xl border bg-card p-5 shadow-sm">
          <AccordionTrigger className="text-lg font-semibold">Stripe Keys</AccordionTrigger>
          <AccordionContent className="pt-4 space-y-4">
            <label className="flex flex-col gap-2 text-sm font-medium">
              Stripe Public Key
              <input type="text" name="stripePublicKey" defaultValue={settings?.stripePublicKey ?? ""} className="rounded-md border bg-background px-3 py-2 text-base outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/40" />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium">
              Stripe Secret Key
              <input type="password" name="stripeSecretKey" placeholder="••••••••" className="rounded-md border bg-background px-3 py-2 text-base outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/40" />
            </label>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="social" className="rounded-2xl border bg-card p-5 shadow-sm">
          <AccordionTrigger className="text-lg font-semibold">Social Links</AccordionTrigger>
          <AccordionContent className="pt-4 space-y-4">
            <label className="flex flex-col gap-2 text-sm font-medium">
              Social Links (JSON format)
              <textarea name="socialLinks" defaultValue={settings?.socialLinks ? JSON.stringify(settings.socialLinks, null, 2) : ""} rows={5} className="rounded-md border bg-background px-3 py-2 text-base font-mono outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/40" placeholder={`{\n  "twitter": "https://twitter.com/your-handle",\n  "facebook": "https://facebook.com/your-page"\n}`} />
            </label>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {result && (
        <p className={`rounded-md px-3 py-2 text-sm ${result.error ? "border border-destructive/30 bg-destructive/10 text-destructive" : "border border-primary/30 bg-primary/10 text-primary"}`}>
          {result.error || result.success}
        </p>
      )}

      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : "Save Settings"}
      </Button>
    </form>
  );
}
