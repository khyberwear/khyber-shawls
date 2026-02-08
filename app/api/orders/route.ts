// export const runtime = 'edge';
import { NextResponse } from "next/server"
import { z } from "zod"

import { sendEmail } from "@/lib/email"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

type ProductItem = {
  id: string;
  price: number | string | bigint;
  inventory: number;
};



const orderSchema = z.object({
  customerName: z.string().min(1),
  customerEmail: z.string().email(),
  customerPhone: z.string().optional(),
  shippingAddress: z.string().min(1),
  notes: z.string().optional(),
  items: z
    .array(
      z.object({
        id: z.string().min(1),
        quantity: z.number().int().positive(),
      })
    )
    .min(1),
})

export async function POST(request: Request) {

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = orderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid order payload", details: parsed.error.format() },
      { status: 400 }
    );
  }

  const {
    customerName,
    customerEmail,
    customerPhone,
    shippingAddress,
    notes,
    items,
  } = parsed.data;

  if (!prisma) {
    return NextResponse.json(
      { error: "Database is not configured. Set DATABASE_URL to enable orders." },
      { status: 500 }
    );
  }

  try {
    const order = await prisma.$transaction(async (tx: any) => {
      // Get products and check inventory
      const products = await tx.product.findMany({
        where: {
          id: { in: items.map((item: any) => item.id) },
          published: true,
        },
        select: {
          id: true,
          price: true,
        },
      });

      if (products.length === 0) {
        throw new Error("No products in stock for this order.");
      }

      // Create a map for quick product lookup
      const productMap = new Map(
        products.map((p: ProductItem) => [p.id, p])
      );

      // Validate inventory and create order items
      const orderItems = items
        .map((item: any) => {
          const product = productMap.get(item.id) as ProductItem | undefined;
          if (!product) {
            return null;
          }
          return {
            productId: product.id,
            quantity: item.quantity,
            price: product.price,
          };
        })
        .filter((item: any): item is { productId: string; quantity: number; price: number | string | bigint } => item !== null);

      if (orderItems.length === 0) {
        throw new Error("Products were removed from the catalogue.");
      }

      // Calculate total
      const totalValue = orderItems.reduce((sum: number, item: any) => {
        return sum + Number(item.price) * item.quantity;
      }, 0);

      const user = await getCurrentUser();

      // Create order
      const order = await tx.order.create({
        data: {
          userId: user?.id,
          customerName,
          customerEmail,
          customerPhone: customerPhone ?? null,
          shippingAddress,
          notes: notes ?? null,
          status: "PENDING",
          total: totalValue,
          items: {
            create: orderItems,
          },
        },
      });


      // No inventory decrement, allow unlimited sales

      return order;
    });

    // Send email notifications
    try {
      // Email to admin
      await sendEmail({
        to: process.env.ADMIN_EMAILS || "atifjan2019@gmail.com",
        subject: "New Order Received",
        html: `
          <h1>New Order Received</h1>
          <p><strong>Order ID:</strong> ${order.id}</p>
          <p><strong>Customer Name:</strong> ${customerName}</p>
          <p><strong>Customer Email:</strong> ${customerEmail}</p>
          <p><strong>Total:</strong> ${order.total}</p>
        `,
      });

      // Email to customer
      await sendEmail({
        to: customerEmail,
        subject: "Your Khybershawls Order Confirmation",
        html: `
          <h1>Thank you for your order!</h1>
          <p>Hi ${customerName},</p>
          <p>We've received your order and will process it shortly.</p>
          <p><strong>Order ID:</strong> ${order.id}</p>
          <p><strong>Total:</strong> ${order.total}</p>
          <p>We will notify you again once your order has shipped.</p>
        `,
      });
    } catch (error) {
      console.error("Failed to send order confirmation email:", error);
      // Do not block the response for email errors
    }

    return NextResponse.json({ orderId: order.id });
  } catch (error) {
    console.error("[orders]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create order" },
      { status: 500 }
    );
  }
}
