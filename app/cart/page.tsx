'use client';


import Image from "next/image"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import { useCart } from "@/components/providers/cart-provider"
import { formatCurrency } from "@/lib/currency"
import type { SerializedProduct } from "@/lib/products"

type CartProduct = SerializedProduct & {
  quantity: number
  subtotal: number
}

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart } = useCart()
  const [productMap, setProductMap] = useState<Record<string, SerializedProduct>>({})
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    let active = true

    const ids = items.map((item) => item.id)
    if (ids.length === 0) {
      setProductMap({})
      setIsLoading(false)

      return () => {
        active = false
      }
    }

    const loadProducts = async () => {
      setIsLoading(true)
      try {
        const response = await fetch("/api/products/bulk", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids }),
        })
        if (!response.ok) {
          throw new Error("Failed to load cart products")
        }
        const data: { products: SerializedProduct[] } = await response.json()
        if (!active) return
        const nextMap: Record<string, SerializedProduct> = {}
        data.products.forEach((product) => {
          nextMap[product.id] = product
        })
        setProductMap(nextMap)
      } catch (error) {
        if (!active) return

        console.error("Unable to fetch cart products", error)
        setProductMap({})
      } finally {
        if (active) {
          setIsLoading(false)
        }
      }
    }

    loadProducts()

    return () => {
      active = false
    }
  }, [items])

  const cartProducts: CartProduct[] = useMemo(() => {
    return items
      .map((item) => {
        const product = productMap[item.id]
        if (!product) return null
        return {
          ...product,
          quantity: item.quantity,
          subtotal: product.price * item.quantity,
        }
      })
      .filter(Boolean) as CartProduct[]
  }, [items, productMap])

  const removedItems = items.length > 0 && cartProducts.length < items.length

  const cartTotal = cartProducts.reduce((total, product) => total + product.subtotal, 0)

  if (items.length === 0) {
    return (
      <div className="space-y-6 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Your cart is empty</h1>
        <p className="text-muted-foreground">
          Explore our collections and add your favourite shawls to the cart before checking out.
        </p>
        <Button asChild>
          <Link href="/">Browse the shop</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Your cart</h1>
          <p className="text-muted-foreground">
            Review your selection before continuing to checkout.
          </p>
        </div>
        <Button variant="ghost" type="button" onClick={clearCart}>
          Clear cart
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-6">
          {removedItems && (
            <p className="text-sm text-destructive">
              Some items are no longer available and were removed from your cart.
            </p>
          )}
          {isLoading && (
            <p className="text-sm text-muted-foreground">Loading cart details…</p>
          )}
          {cartProducts.map((product) => (
            <div
              key={product.id}
              className="flex flex-col gap-5 rounded-2xl border bg-card p-5 shadow-sm sm:flex-row"
            >
              <div className="relative h-40 w-full overflow-hidden rounded-xl sm:w-48">
                <Image
                  src={
                    product.featuredImageUrl ??
                    product.gallery[0]?.url ??
                    "/hero-shawl.svg"
                  }
                  alt={
                    product.featuredImageAlt ??
                    product.gallery[0]?.alt ??
                    `${product.title} featured`
                  }
                  fill
                  sizes="192px"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col gap-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold">{product.title}</h2>

                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    type="button"
                    onClick={() => removeItem(product.id)}
                  >
                    Remove
                  </Button>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground">Qty</span>
                    <div className="inline-flex items-center rounded-full border">
                      <button
                        type="button"
                        className="px-3 py-1 text-sm"
                        onClick={() => updateQuantity(product.id, product.quantity - 1)}
                        aria-label={`Decrease quantity of ${product.title}`}
                      >
                        &minus;
                      </button>
                      <span className="min-w-[3ch] text-center text-sm font-medium">
                        {product.quantity}
                      </span>
                      <button
                        type="button"
                        className="px-3 py-1 text-sm"
                        onClick={() => updateQuantity(product.id, product.quantity + 1)}
                        aria-label={`Increase quantity of ${product.title}`}
                      >
                        &#43;
                      </button>
                    </div>
                  </div>
                  <span className="text-sm font-semibold">
                    {formatCurrency(product.subtotal)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="space-y-6 rounded-2xl border bg-card p-6 shadow-sm">
          <div>
            <h2 className="text-xl font-semibold">Order summary</h2>
            <p className="text-sm text-muted-foreground">
              Delivery charges will be calculated at checkout.
            </p>
          </div>
          <dl className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd className="font-medium">{formatCurrency(cartTotal)}</dd>
            </div>
            <div className="flex items-center justify-between border-t pt-3 text-base font-semibold">
              <dt>Total</dt>
              <dd>{formatCurrency(cartTotal)}</dd>
            </div>
          </dl>
          <Button className="w-full" asChild>
            <Link href="/checkout">Proceed to checkout</Link>
          </Button>
        </aside>
      </div>
    </div>
  )
}
