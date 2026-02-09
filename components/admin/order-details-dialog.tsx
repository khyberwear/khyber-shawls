'use client'

import { Eye, Phone, Mail, ExternalLink, MapPin, ClipboardList, CreditCard, Clock, Truck } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/currency"

type OrderItem = {
  id: string
  quantity: number
  price: number
  product: {
    id: string
    name: string
    image: string | null
    slug?: string
  } | null
}

type OrderDetailsDialogProps = {
  orderId: string
  customerName: string
  customerEmail: string
  customerPhone: string | null
  shippingAddress: string
  notes: string | null
  createdAt: Date
  total: number
  items: OrderItem[]
}

const DELIVERY_FEE = 250

export function OrderDetailsDialog({
  orderId,
  customerName,
  customerEmail,
  customerPhone,
  shippingAddress,
  notes,
  createdAt,
  total,
  items,
}: OrderDetailsDialogProps) {
  // Extract delivery type from notes if present
  const deliveryInfo = notes?.match(/Delivery: (Express|Normal) \(Rs (\d+)\)/i)
  const deliveryType = deliveryInfo ? deliveryInfo[1] : 'Normal'
  const deliveryFee = deliveryInfo ? parseInt(deliveryInfo[2]) : DELIVERY_FEE

  // Extract payment method from notes if present
  const paymentInfo = notes?.match(/Payment Method: (Bank Transfer|Cash on Delivery)/i)
  const paymentMethod = paymentInfo ? paymentInfo[1] : 'Not specified'

  const subtotal = total - deliveryFee

  // Remove delivery info and payment method from notes display
  const displayNotes = notes
    ?.replace(/\n*Delivery: (Express|Normal) \(Rs \d+\)\n*/i, '')
    .replace(/\n*Payment Method: (Bank Transfer|Cash on Delivery)\n*/i, '')
    .trim()

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="inline-flex items-center gap-2 rounded-xl border-white/10 hover:bg-[#B3702B]/10 hover:text-[#B3702B] hover:border-[#B3702B]/30 transition-all font-medium"
        >
          <Eye className="h-4 w-4" />
          <span>View Details</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur-xl border-white/10 shadow-2xl rounded-[2rem] p-0 overflow-hidden">
        <div className="bg-gradient-to-br from-[#B3702B]/20 via-transparent to-transparent p-6 md:p-8 border-b border-white/10">
          <DialogHeader className="text-left">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#B3702B]/20 text-[#B3702B]">
                <ClipboardList className="h-5 w-5" />
              </div>
              <DialogTitle className="text-2xl font-bold tracking-tight">Order Details</DialogTitle>
            </div>
            <DialogDescription className="text-muted-foreground">
              Complete invoice and shipping details for order <span className="text-foreground font-mono">#{orderId.slice(0, 8)}</span>
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6 md:p-8 space-y-8">
          {/* Main Info Grid */}
          <div className="grid gap-8 md:grid-cols-2">
            {/* Customer Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#B3702B] flex items-center gap-2">
                <Truck className="h-4 w-4" /> Customer Info
              </h3>
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                  <p className="text-lg font-semibold text-foreground">{customerName}</p>
                  <div className="flex flex-col gap-1.5 pt-2 border-t border-white/5 mt-2">
                    <a href={`mailto:${customerEmail}`} className="text-sm text-muted-foreground hover:text-[#B3702B] flex items-center gap-2 transition-colors">
                      <Mail className="h-3.5 w-3.5" /> {customerEmail}
                    </a>
                    {customerPhone && (
                      <a href={`tel:${customerPhone}`} className="text-sm text-muted-foreground hover:text-[#B3702B] flex items-center gap-2 transition-colors">
                        <Phone className="h-3.5 w-3.5" /> {customerPhone}
                      </a>
                    )}
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5" />
                      {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(createdAt)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment & Shipping Summary */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#B3702B] flex items-center gap-2">
                <CreditCard className="h-4 w-4" /> Logistics
              </h3>
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Payment:</span>
                    <span className="font-semibold text-foreground">{paymentMethod}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Delivery:</span>
                    <span className="font-semibold text-foreground">{deliveryType}</span>
                  </div>
                  <div className="pt-2 border-t border-white/5 flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-[#B3702B] mt-0.5" />
                    <p className="text-sm text-muted-foreground leading-relaxed">{shippingAddress}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#B3702B]">Items Ordered</h3>
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="group flex items-center gap-4 rounded-2xl border border-white/5 bg-white/5 p-4 hover:bg-[#B3702B]/5 hover:border-[#B3702B]/20 transition-all"
                >
                  {item.product?.image && (
                    <div className="relative h-16 w-16 flex-shrink-0 rounded-xl overflow-hidden border border-white/10 shadow-lg">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    {item.product ? (
                      <Link
                        href={`/products/${item.product.slug || item.product.id}`}
                        className="font-semibold text-foreground hover:text-[#B3702B] flex items-center gap-1.5 transition-colors"
                        target="_blank"
                      >
                        {item.product.name}
                        <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    ) : (
                      <span className="font-medium text-muted-foreground italic">Removed Product</span>
                    )}
                    <div className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-lg bg-white/10 text-xs font-bold text-foreground">Qty: {item.quantity}</span>
                      <span>× {formatCurrency(item.price)}</span>
                    </div>
                  </div>
                  <div className="text-base font-bold text-foreground">
                    {formatCurrency(item.quantity * item.price)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Financials Summary */}
          <div className="rounded-[2rem] bg-gradient-to-br from-white/5 to-transparent border border-white/10 p-6 md:p-8">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium text-foreground">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{deliveryType} Shipping</span>
                <span className="font-medium text-foreground">{formatCurrency(deliveryFee)}</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-white/10 mt-4">
                <span className="text-lg font-bold text-foreground">Order Total</span>
                <span className="text-2xl font-black text-[#B3702B]">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#B3702B]">Order Notes</h3>
            <div className="rounded-2xl bg-white/5 border border-white/5 p-4 text-sm text-muted-foreground leading-relaxed">
              {displayNotes || <span className="italic opacity-50">No additional notes provided by the customer.</span>}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
