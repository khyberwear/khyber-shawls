// // // export const runtime = 'edge';
import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"
import { z } from "zod"

import { sendEmail } from "@/lib/email"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"




const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(5),
})

export async function POST(request: Request) {
  if (!prisma) {
    return NextResponse.json(
      { error: "Database is not configured. Set DATABASE_URL to enable contact form." },
      { status: 500 }
    )
  }

  const body = await request.json().catch(() => null)
  const parsed = contactSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  const user = await getCurrentUser()

  try {
    await prisma.contactEntry.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        message: parsed.data.message,
        userId: user?.id,
      },
    })
  } catch (error) {
    console.error("Failed to create contact entry:", error)
    return NextResponse.json(
      { error: "Could not save message." },
      { status: 500 }
    )
  }

  revalidatePath("/admin/messages")

  try {
    await sendEmail({
      to: process.env.ADMIN_EMAILS || "atifjan2019@gmail.com",
      subject: "New Contact Form Submission",
      html: `
        <h1>New Contact Form Submission</h1>
        <p><strong>Name:</strong> ${parsed.data.name}</p>
        <p><strong>Email:</strong> ${parsed.data.email}</p>
        <p><strong>Message:</strong></p>
        <p>${parsed.data.message}</p>
      `,
    })
  } catch (error) {
    console.error("Failed to send email:", error)
    return NextResponse.json(
      { error: "Could not send email." },
      { status: 500 }
    )
  }

  return NextResponse.json({ ok: true })
}

