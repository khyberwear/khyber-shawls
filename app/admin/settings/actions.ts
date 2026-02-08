"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const settingsSchema = z.object({
  websiteName: z.string().optional(),
  websiteLogoUrl: z.string().optional(),
  websiteFaviconUrl: z.string().optional(),
  contactPhone: z.string().optional(),
  contactEmail: z.string().email().optional().or(z.literal("")),
  contactAddress: z.string().optional(),
  smtpHost: z.string().optional(),
  smtpPort: z.coerce.number().optional(),
  smtpUser: z.string().optional(),
  smtpPass: z.string().optional(),
  stripePublicKey: z.string().optional(),
  stripeSecretKey: z.string().optional(),
  socialLinks: z.string().optional(), // Will be parsed as JSON
});

export async function updateSettings(formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const parsed = settingsSchema.safeParse(data);

  if (!parsed.success) {
    return { error: "Invalid data" };
  }

  const settingsData = {
    ...parsed.data,
    socialLinks: parsed.data.socialLinks ? JSON.parse(parsed.data.socialLinks) : undefined,
  };

  try {
    const currentSettings = await prisma.settings.findFirst();
    if (currentSettings) {
      await prisma.settings.update({
        where: { id: currentSettings.id },
        data: settingsData,
      });
    } else {
      await prisma.settings.create({
        data: settingsData,
      });
    }
    revalidatePath("/admin/settings");
    return { success: "Settings updated successfully." };
  } catch (error) {
    console.error(error);
    return { error: "Failed to update settings." };
  }
}
