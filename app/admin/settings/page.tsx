// // // export const runtime = 'edge';
import { prisma } from "@/lib/prisma";
import { SettingsForm } from "./_components/settings-form";

export default async function SettingsPage() {
  const settings = await prisma.settings.findFirst();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your website and integration settings.
        </p>
      </div>
      <SettingsForm settings={settings} />
    </div>
  );
}

