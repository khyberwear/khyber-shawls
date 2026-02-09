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
  socialLinks: z.string().optional(), // Expected as a JSON string from the client
});

export async function updateSettings(formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const parsed = settingsSchema.safeParse(data);

  if (!parsed.success) {
    console.error("Settings validation failed:", parsed.error.issues);
    return { error: "Invalid data: " + parsed.error.issues.map(i => i.message).join(", ") };
  }

  // We store socialLinks as a JSON string in the database String field
  const settingsData = {
    websiteName: parsed.data.websiteName,
    websiteLogoUrl: parsed.data.websiteLogoUrl,
    websiteFaviconUrl: parsed.data.websiteFaviconUrl,
    contactPhone: parsed.data.contactPhone,
    contactEmail: parsed.data.contactEmail,
    contactAddress: parsed.data.contactAddress,
    socialLinks: parsed.data.socialLinks,
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
    revalidatePath("/", "layout");
    return { success: "Settings updated successfully." };
  } catch (error) {
    console.error("Error updating settings:", error);
    return { error: "Failed to update settings." };
  }
}
