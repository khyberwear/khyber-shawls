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
import {
  Globe,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  MessageCircle
} from "lucide-react";

interface SettingsFormProps {
  settings: Settings | null;
}

// Helper to parse socialLinks safely
function parseSocialLinks(socialLinks: any): Record<string, string> {
  if (!socialLinks) return {};
  if (typeof socialLinks === 'string') {
    try {
      return JSON.parse(socialLinks);
    } catch {
      return {};
    }
  }
  return socialLinks as Record<string, string>;
}

export function SettingsForm({ settings }: SettingsFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<{ success?: string; error?: string } | null>(null);

  const socialLinks = parseSocialLinks(settings?.socialLinks);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formRef.current) return;

    setPending(true);
    setResult(null);
    const formData = new FormData(formRef.current);

    // Collect social links into JSON
    const socialData: Record<string, string> = {};
    const socialFields = ['facebook', 'instagram', 'twitter', 'youtube', 'linkedin', 'whatsapp', 'tiktok', 'pinterest'];
    socialFields.forEach(field => {
      const value = formData.get(`social_${field}`) as string;
      if (value?.trim()) {
        socialData[field] = value.trim();
      }
      formData.delete(`social_${field}`);
    });
    formData.set('socialLinks', JSON.stringify(socialData));

    const result = await updateSettings(formData);
    setPending(false);
    setResult(result);
  };

  const inputClasses = "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-[#B3702B] focus:ring-2 focus:ring-[#B3702B]/20 transition-all placeholder:text-muted-foreground/50";

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      <Accordion type="multiple" defaultValue={["general"]} className="space-y-4">
        {/* General Settings */}
        <AccordionItem value="general" className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
          <AccordionTrigger className="px-6 py-4 hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-blue-500" />
              <span className="text-base font-semibold">General Settings</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6 pt-2 space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-muted-foreground mb-2 block">Website Name</span>
              <input
                type="text"
                name="websiteName"
                defaultValue={settings?.websiteName ?? ""}
                className={inputClasses}
                placeholder="Your Website Name"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-muted-foreground mb-2 block">Website Logo URL</span>
              <input
                type="text"
                name="websiteLogoUrl"
                defaultValue={settings?.websiteLogoUrl ?? ""}
                className={inputClasses}
                placeholder="https://example.com/logo.png"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-muted-foreground mb-2 block">Website Favicon URL</span>
              <input
                type="text"
                name="websiteFaviconUrl"
                defaultValue={settings?.websiteFaviconUrl ?? ""}
                className={inputClasses}
                placeholder="https://example.com/favicon.ico"
              />
            </label>
          </AccordionContent>
        </AccordionItem>

        {/* Contact Information */}
        <AccordionItem value="contact" className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
          <AccordionTrigger className="px-6 py-4 hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-green-500" />
              <span className="text-base font-semibold">Contact Information</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6 pt-2 space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-muted-foreground mb-2 block flex items-center gap-2">
                <Phone className="w-4 h-4" /> Phone Number
              </span>
              <input
                type="text"
                name="contactPhone"
                defaultValue={settings?.contactPhone ?? ""}
                className={inputClasses}
                placeholder="+1 234 567 8900"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-muted-foreground mb-2 block flex items-center gap-2">
                <Mail className="w-4 h-4" /> Email Address
              </span>
              <input
                type="email"
                name="contactEmail"
                defaultValue={settings?.contactEmail ?? ""}
                className={inputClasses}
                placeholder="contact@example.com"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-muted-foreground mb-2 block flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Address
              </span>
              <textarea
                name="contactAddress"
                defaultValue={settings?.contactAddress ?? ""}
                rows={3}
                className={inputClasses}
                placeholder="123 Main Street, City, Country"
              />
            </label>
          </AccordionContent>
        </AccordionItem>

        {/* Social Links */}
        <AccordionItem value="social" className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
          <AccordionTrigger className="px-6 py-4 hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-3">
              <Instagram className="w-5 h-5 text-pink-500" />
              <span className="text-base font-semibold">Social Media Links</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6 pt-2 space-y-4">
            <p className="text-sm text-muted-foreground mb-4">
              Add your social media profile URLs. Leave empty to hide from the website.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Facebook */}
              <label className="block">
                <span className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                  <Facebook className="w-4 h-4 text-blue-600" /> Facebook
                </span>
                <input
                  type="url"
                  name="social_facebook"
                  defaultValue={socialLinks.facebook ?? ""}
                  className={inputClasses}
                  placeholder="https://facebook.com/yourpage"
                />
              </label>

              {/* Instagram */}
              <label className="block">
                <span className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                  <Instagram className="w-4 h-4 text-pink-500" /> Instagram
                </span>
                <input
                  type="url"
                  name="social_instagram"
                  defaultValue={socialLinks.instagram ?? ""}
                  className={inputClasses}
                  placeholder="https://instagram.com/yourprofile"
                />
              </label>

              {/* Twitter/X */}
              <label className="block">
                <span className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                  <Twitter className="w-4 h-4 text-sky-500" /> Twitter / X
                </span>
                <input
                  type="url"
                  name="social_twitter"
                  defaultValue={socialLinks.twitter ?? ""}
                  className={inputClasses}
                  placeholder="https://twitter.com/yourhandle"
                />
              </label>

              {/* YouTube */}
              <label className="block">
                <span className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                  <Youtube className="w-4 h-4 text-red-500" /> YouTube
                </span>
                <input
                  type="url"
                  name="social_youtube"
                  defaultValue={socialLinks.youtube ?? ""}
                  className={inputClasses}
                  placeholder="https://youtube.com/@yourchannel"
                />
              </label>

              {/* LinkedIn */}
              <label className="block">
                <span className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                  <Linkedin className="w-4 h-4 text-blue-700" /> LinkedIn
                </span>
                <input
                  type="url"
                  name="social_linkedin"
                  defaultValue={socialLinks.linkedin ?? ""}
                  className={inputClasses}
                  placeholder="https://linkedin.com/company/yourcompany"
                />
              </label>

              {/* WhatsApp */}
              <label className="block">
                <span className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-green-500" /> WhatsApp
                </span>
                <input
                  type="url"
                  name="social_whatsapp"
                  defaultValue={socialLinks.whatsapp ?? ""}
                  className={inputClasses}
                  placeholder="https://wa.me/1234567890"
                />
              </label>

              {/* TikTok */}
              <label className="block">
                <span className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                  </svg>
                  TikTok
                </span>
                <input
                  type="url"
                  name="social_tiktok"
                  defaultValue={socialLinks.tiktok ?? ""}
                  className={inputClasses}
                  placeholder="https://tiktok.com/@yourprofile"
                />
              </label>

              {/* Pinterest */}
              <label className="block">
                <span className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0a12 12 0 0 0-4.37 23.17c-.1-.94-.2-2.4.04-3.43l1.4-5.88s-.36-.72-.36-1.78c0-1.66.96-2.9 2.16-2.9 1.02 0 1.52.77 1.52 1.68 0 1.02-.65 2.55-.99 3.97-.28 1.18.6 2.14 1.77 2.14 2.13 0 3.77-2.25 3.77-5.5 0-2.87-2.06-4.88-5.02-4.88-3.42 0-5.43 2.57-5.43 5.22 0 1.03.4 2.14.9 2.74.1.12.11.22.08.34l-.34 1.36c-.05.22-.17.27-.4.16-1.5-.7-2.43-2.89-2.43-4.65 0-3.78 2.75-7.26 7.93-7.26 4.16 0 7.4 2.97 7.4 6.93 0 4.14-2.6 7.46-6.22 7.46-1.22 0-2.36-.63-2.75-1.38l-.75 2.85c-.27 1.04-1 2.35-1.49 3.14A12 12 0 1 0 12 0z" />
                  </svg>
                  Pinterest
                </span>
                <input
                  type="url"
                  name="social_pinterest"
                  defaultValue={socialLinks.pinterest ?? ""}
                  className={inputClasses}
                  placeholder="https://pinterest.com/yourprofile"
                />
              </label>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Result Message */}
      {result && (
        <div className={`rounded-xl px-4 py-3 text-sm flex items-center gap-2 ${result.error
            ? "border border-red-500/30 bg-red-500/10 text-red-500"
            : "border border-green-500/30 bg-green-500/10 text-green-500"
          }`}>
          {result.error ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
          {result.error || result.success}
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={pending}
        className="w-full sm:w-auto bg-gradient-to-r from-[#B3702B] to-[#8B5A2B] hover:shadow-lg hover:shadow-[#B3702B]/25 text-white border-0"
      >
        {pending ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Saving...
          </>
        ) : (
          "Save Settings"
        )}
      </Button>
    </form>
  );
}
