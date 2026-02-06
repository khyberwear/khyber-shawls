export const runtime = 'edge';
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { orderNumber, email } = body

    if (!orderNumber || !email) {
      return NextResponse.json(
        { error: "Order number and email are required" },
        { status: 400 }
      )
    }

    // Find order by ID (orderNumber is the order ID) and verify email
    const order = await prisma.order.findFirst({
      where: {
        id: orderNumber,
        customerEmail: email.toLowerCase().trim(),
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    })

    if (!order) {
      return NextResponse.json(
        { error: "Order not found. Please check your order number and email." },
        { status: 404 }
      )
    }

    // Format the response
    const formattedOrder = {
      id: order.id,
      orderNumber: order.id,
      status: order.status,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      shippingAddress: order.shippingAddress,
      total: order.total,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
      items: order.items.map((item) => ({
        productName: item.product.name,
        quantity: item.quantity,
        price: item.price,
      })),
    }

    return NextResponse.json({ order: formattedOrder })
  } catch (error) {
    console.error("Order tracking error:", error)
    return NextResponse.json(
      { error: "Failed to track order. Please try again later." },
      { status: 500 }
    )
  }
}
