"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { hashPassword } from "@/lib/passwords";

const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  password: z.string().min(6),
  role: z.enum(["USER", "ADMIN"]),
});

const UpdateUserSchema = z.object({
  role: z.enum(["USER", "ADMIN"]),
});

export async function updateUserRole(userId: string, formData: FormData) {
  await requireAdmin();

  const parsed = UpdateUserSchema.safeParse({
    role: formData.get("role"),
  });
  if (!parsed.success) {
    throw new Error("Invalid role");
  }

  // Check if this would remove the last admin
  if (parsed.data.role === "USER") {
    const adminCount = await prisma.user.count({
      where: { role: "ADMIN" },
    });
    if (adminCount <= 1) {
      throw new Error("Cannot remove the last admin");
    }
  }

  await prisma.user.update({
    where: { id: userId },
    data: { role: parsed.data.role },
  });

  revalidatePath("/admin/users");
}

export async function deleteUser(userId: string) {
  await requireAdmin();

  // Check if this would delete the last admin
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (user?.role === "ADMIN") {
    const adminCount = await prisma.user.count({
      where: { role: "ADMIN" },
    });
    if (adminCount <= 1) {
      throw new Error("Cannot delete the last admin");
    }
  }

  await prisma.user.delete({
    where: { id: userId },
  });

  revalidatePath("/admin/users");
}

export async function createUser(formData: FormData) {
  await requireAdmin();

  const parsed = CreateUserSchema.safeParse({
    email: formData.get("email"),
    name: formData.get("name"),
    password: formData.get("password"),
    role: formData.get("role"),
  });

  if (!parsed.success) {
    return { error: "Invalid input data" };
  }

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: parsed.data.email },
    });

    if (existingUser) {
      return { error: "User with this email already exists" };
    }

    // Create new user
    const hashedPassword = await hashPassword(parsed.data.password);
    await prisma.user.create({
      data: {
        email: parsed.data.email,
        name: parsed.data.name,
        password: hashedPassword,
        role: parsed.data.role,
      },
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Error creating user:", error);
    return { error: "Failed to create user" };
  }
}
