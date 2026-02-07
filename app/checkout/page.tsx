'use client';


import Link from "next/link"
import { FormEvent, useEffect, useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import { useCart } from "@/components/providers/cart-provider"
import type { SerializedProduct } from "@/lib/products"

export default function CheckoutPage() {
  const { items, clearCart } = useCart()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [productMap, setProductMap] = useState<Record<string, SerializedProduct>>({})
  const [deliveryType, setDeliveryType] = useState<'normal' | 'express'>('normal')
  const [paymentMethod, setPaymentMethod] = useState<'bank-transfer' | 'cash-on-delivery'>('cash-on-delivery')

  const DELIVERY_FEES = {
    normal: 250,
    express: 400,
  }

  useEffect(() => {
    let isMounted = true
    const ids = items.map((item) => item.id)

    if (ids.length === 0) {
      setProductMap({})
      return
    }

    fetch("/api/products/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    })
      .then((response) => response.json())
      .then((data: { products: SerializedProduct[] }) => {
        if (!isMounted) return
        const nextMap: Record<string, SerializedProduct> = {}
        data.products.forEach((product) => {
          nextMap[product.id] = product
        })
        setProductMap(nextMap)
      })
      .catch((error) => {
        if (!isMounted) return
        // Silently handle other errors
      })

    return () => {
      isMounted = false
    }
  }, [items])

  const summary = useMemo(() => {
    const detailed = items
      .map((item) => {
        const product = productMap[item.id]
        if (!product) return null
        return {
          id: product.id,
          title: product.title,
          quantity: item.quantity,
          price: product.price,
          subtotal: product.price * item.quantity,
        }
      })
      .filter(Boolean) as Array<{
      id: string
      title: string
      quantity: number
      price: number
      subtotal: number
    }>

    const subtotal = detailed.reduce((totalValue, product) => totalValue + product.subtotal, 0)
    const deliveryFee = DELIVERY_FEES[deliveryType]
    const total = subtotal + deliveryFee

    return { detailed, subtotal, deliveryFee, total }
  }, [items, productMap, deliveryType])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (summary.detailed.length === 0) {
      return
    }

    const formData = new FormData(event.currentTarget)
    const payload = {
      customerName: formData.get("fullname") as string,
      customerEmail: formData.get("email") as string,
      customerPhone: (formData.get("phone") as string) || undefined,
      shippingAddress: [
        formData.get("street"),
        formData.get("city"),
        formData.get("postal"),
        formData.get("country"),
      ]
        .filter(Boolean)
        .join(", "),
      notes: [
        formData.get("notes") as string,
        `Payment Method: ${paymentMethod === 'bank-transfer' ? 'Bank Transfer' : 'Cash on Delivery'}`,
        `Delivery: ${deliveryType === 'express' ? 'Express (Rs 400)' : 'Normal (Rs 250)'}`,
      ]
        .filter(Boolean)
        .join("\n\n"),
      items: summary.detailed.map((item) => ({
        id: item.id,
        quantity: item.quantity,
      })),
      total: summary.total,
    }

    try {
      setIsSubmitting(true)
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        let errorMsg = "Failed to place order"
        try {
          const data = await response.json()
          if (data?.error) errorMsg = data.error
        } catch {}
        throw new Error(errorMsg)
      }

      setSubmitted(true)
      clearCart()
    } catch (error: any) {
      console.error(error)
      alert(
        error?.message || "We could not process your order. Please review your details and try again."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl space-y-6 rounded-3xl border bg-card p-10 text-center shadow-sm">
        <h1 className="text-3xl font-semibold tracking-tight">
          Thank you for your order
        </h1>
        <p className="text-muted-foreground">
          We have received your details. A stylist will reach out shortly to confirm shipping and payment.
        </p>
        <Button variant="outline" asChild>
          <Link href="/">Return to shop</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1.4fr,1fr]">
      <form
        className="space-y-6 rounded-3xl border bg-card p-8 shadow-sm"
        onSubmit={handleSubmit}
      >
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Checkout</h1>
          <p className="text-muted-foreground">
            Provide your contact and delivery details. No payment is captured yet.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm font-medium">
            Full name
            <input
              type="text"
              name="fullname"
              required
              placeholder="Amina Khan"
              className="rounded-md border bg-background px-3 py-2 text-base outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/40"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium">
            Phone number
            <input
              type="tel"
              name="phone"
              required
              placeholder="+92 300 1234567"
              className="rounded-md border bg-background px-3 py-2 text-base outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/40"
            />
          </label>
          <label className="md:col-span-2 flex flex-col gap-2 text-sm font-medium">
            Email address
            <input
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              className="rounded-md border bg-background px-3 py-2 text-base outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/40"
            />
          </label>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Shipping address</h2>
          <label className="flex flex-col gap-2 text-sm font-medium">
            Street address
            <input
              type="text"
              name="street"
              required
              placeholder="House 12, Lane 3"
              className="rounded-md border bg-background px-3 py-2 text-base outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/40"
            />
          </label>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm font-medium">
              City
              <input
                type="text"
                name="city"
                required
                placeholder="Peshawar"
                className="rounded-md border bg-background px-3 py-2 text-base outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/40"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium">
              Postal code
              <input
                type="text"
                name="postal"
                required
                placeholder="25000"
                className="rounded-md border bg-background px-3 py-2 text-base outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/40"
              />
            </label>
          </div>
          <label className="flex flex-col gap-2 text-sm font-medium">
            Country
            <input
              type="text"
              name="country"
              required
              defaultValue="Pakistan"
              className="rounded-md border bg-background px-3 py-2 text-base outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/40"
            />
          </label>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Delivery options</h2>
          <div className="space-y-3">
            <label className="flex items-center gap-3 rounded-lg border p-4 cursor-pointer hover:bg-muted/50 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
              <input
                type="radio"
                name="delivery"
                value="normal"
                checked={deliveryType === 'normal'}
                onChange={() => setDeliveryType('normal')}
                className="h-4 w-4 text-primary"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Normal Delivery</span>
                  <span className="font-semibold">Rs 250</span>
                </div>
                <p className="text-sm text-muted-foreground">Delivery within 5-7 business days</p>
              </div>
            </label>
            
            <label className="flex items-center gap-3 rounded-lg border p-4 cursor-pointer hover:bg-muted/50 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
              <input
                type="radio"
                name="delivery"
                value="express"
                checked={deliveryType === 'express'}
                onChange={() => setDeliveryType('express')}
                className="h-4 w-4 text-primary"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Express Delivery</span>
                  <span className="font-semibold">Rs 400</span>
                </div>
                <p className="text-sm text-muted-foreground">Delivery within 2-3 business days</p>
              </div>
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Payment details</h2>
          <div className="space-y-3">
            <label className="flex items-start gap-3 rounded-lg border p-4 cursor-pointer hover:bg-muted/50 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
              <input
                type="radio"
                name="payment"
                value="cash-on-delivery"
                checked={paymentMethod === 'cash-on-delivery'}
                onChange={() => setPaymentMethod('cash-on-delivery')}
                className="mt-0.5 h-4 w-4 text-primary"
              />
              <div className="flex-1">
                <span className="font-medium">Cash on Delivery</span>
                <p className="text-sm text-muted-foreground">Pay when your order arrives</p>
              </div>
            </label>
            
            <label className="flex items-start gap-3 rounded-lg border p-4 cursor-pointer hover:bg-muted/50 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
              <input
                type="radio"
                name="payment"
                value="bank-transfer"
                checked={paymentMethod === 'bank-transfer'}
                onChange={() => setPaymentMethod('bank-transfer')}
                className="mt-0.5 h-4 w-4 text-primary"
              />
              <div className="flex-1">
                <span className="font-medium">Bank Transfer</span>
                <p className="text-sm text-muted-foreground">Direct bank transfer</p>
              </div>
            </label>

            {paymentMethod === 'bank-transfer' && (
              <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
                <h3 className="text-sm font-semibold">Bank Transfer Details</h3>
                <div className="text-sm space-y-1">
                  <p><span className="text-muted-foreground">Bank Name:</span> <span className="font-medium">Allied Bank Limited</span></p>
                  <p><span className="text-muted-foreground">Account Title:</span> <span className="font-medium">Khyber Shawls</span></p>
                  <p><span className="text-muted-foreground">Account Number:</span> <span className="font-medium">1234567890</span></p>
                  <p><span className="text-muted-foreground">IBAN:</span> <span className="font-medium">PK12ABCD1234567890123456</span></p>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  Please use your order number as reference when making the transfer. We will confirm your order once payment is received.
                </p>
              </div>
            )}
          </div>

          <label className="flex flex-col gap-2 text-sm font-medium">
            Order notes
            <textarea
              name="notes"
              rows={3}
              placeholder="Share colour preferences, gifting notes, or delivery instructions."
              className="rounded-md border bg-background px-3 py-2 text-base outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/40"
            />
          </label>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting || summary.detailed.length === 0}
        >
          {isSubmitting ? "Processing..." : "Place order"}
        </Button>
      </form>

      <aside className="space-y-6 rounded-3xl border bg-card p-8 shadow-sm">
        <div>
          <h2 className="text-xl font-semibold">Order summary</h2>
          <p className="text-sm text-muted-foreground">
            Review your items before placing the order.
          </p>
        </div>

        {summary.detailed.length === 0 ? (
          <p className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
            Your cart is empty. Add items from the shop to proceed with checkout.
          </p>
        ) : (
          <>
            <ul className="space-y-4 text-sm">
              {summary.detailed.map((product) => (
                <li key={product.id} className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium">{product.title}</p>
                    <p className="text-muted-foreground">
                      Qty {product.quantity} &times; Rs {product.price.toFixed(0)}
                    </p>
                  </div>
                  <span className="font-semibold">Rs {product.subtotal.toFixed(0)}</span>
                </li>
              ))}
            </ul>

            <div className="space-y-2 border-t pt-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>Rs {summary.subtotal.toFixed(0)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  Delivery ({deliveryType === 'express' ? 'Express' : 'Normal'})
                </span>
                <span>Rs {summary.deliveryFee.toFixed(0)}</span>
              </div>
            </div>
          </>
        )}

        <div className="flex items-center justify-between border-t pt-4 text-base font-semibold">
          <span>Total</span>
          <span>Rs {summary.total.toFixed(0)}</span>
        </div>
      </aside>
    </div>
  )
}
