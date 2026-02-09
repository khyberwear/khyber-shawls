// // // // export const runtime = 'edge';
import { prisma } from "@/lib/prisma";
import { SettingsForm } from "./_components/settings-form";
import { Settings, Globe, Palette, Bell } from "lucide-react";

export default async function SettingsPage() {
  const settings = await prisma.settings.findFirst();

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4 md:p-8">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-500/10 via-background to-slate-600/5 p-6 md:p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-slate-500/20 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />

        <div className="relative flex items-start gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-slate-500/20 text-slate-400">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-foreground">Settings</h1>
            <p className="text-muted-foreground mt-1">
              Configure your website and integration settings
            </p>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-white/10 bg-background/50 p-4 hover:border-[#B3702B]/30 transition-colors">
          <Globe className="w-5 h-5 text-blue-500 mb-2" />
          <p className="text-sm font-medium text-foreground">Website</p>
          <p className="text-xs text-muted-foreground">Name, logo, branding</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-background/50 p-4 hover:border-[#B3702B]/30 transition-colors">
          <Palette className="w-5 h-5 text-purple-500 mb-2" />
          <p className="text-sm font-medium text-foreground">Appearance</p>
          <p className="text-xs text-muted-foreground">Colors, fonts, theme</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-background/50 p-4 hover:border-[#B3702B]/30 transition-colors">
          <Bell className="w-5 h-5 text-orange-500 mb-2" />
          <p className="text-sm font-medium text-foreground">Notifications</p>
          <p className="text-xs text-muted-foreground">Email, alerts</p>
        </div>
      </div>

      {/* Settings Form */}
      <div className="rounded-2xl border border-white/10 bg-background/80 backdrop-blur-sm p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-foreground mb-6">
          General Settings
        </h2>
        <SettingsForm settings={settings} />
      </div>
    </div>
  );
}
