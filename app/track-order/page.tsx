'use client';


import { useState } from "react"
import Link from "next/link"
import { Search, Package, Truck, CheckCircle, XCircle, Clock } from "lucide-react"

type OrderStatus = "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED"

type OrderData = {
  id: string
  orderNumber: string
  status: OrderStatus
  customerName: string
  customerEmail: string
  shippingAddress: string
  total: number
  createdAt: string
  updatedAt: string
  items: {
    productName: string
    quantity: number
    price: number
  }[]
}

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [orderData, setOrderData] = useState<OrderData | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setOrderData(null)
    setLoading(true)

    try {
      const response = await fetch("/api/orders/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNumber, email }),
      })

      const data = (await response.json()) as any

      if (!response.ok) {
        throw new Error(data.error || "Order not found")
      }

      setOrderData(data.order)
    } catch (err: any) {
      setError(err.message || "Failed to track order. Please check your details and try again.")
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return <Clock className="w-8 h-8 text-yellow-600" />
      case "PROCESSING":
        return <Package className="w-8 h-8 text-blue-600" />
      case "SHIPPED":
        return <Truck className="w-8 h-8 text-purple-600" />
      case "DELIVERED":
        return <CheckCircle className="w-8 h-8 text-green-600" />
      case "CANCELLED":
        return <XCircle className="w-8 h-8 text-red-600" />
    }
  }

  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return { label: "Pending", description: "Your order has been received and is awaiting processing." }
      case "PROCESSING":
        return { label: "Processing", description: "Your order is being prepared for shipment." }
      case "SHIPPED":
        return { label: "Shipped", description: "Your order is on its way!" }
      case "DELIVERED":
        return { label: "Delivered", description: "Your order has been delivered successfully." }
      case "CANCELLED":
        return { label: "Cancelled", description: "This order has been cancelled." }
    }
  }

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "PROCESSING":
        return "bg-blue-100 text-blue-800 border-blue-300"
      case "SHIPPED":
        return "bg-purple-100 text-purple-800 border-purple-300"
      case "DELIVERED":
        return "bg-green-100 text-green-800 border-green-300"
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-300"
    }
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <div className="mb-8">
        <Link href="/" className="text-sm text-amber-700 hover:text-amber-800 transition">
          â† Back to Home
        </Link>
      </div>

      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Track Your Order</h1>
        <p className="text-lg text-gray-600">
          Enter your order number and email to check your order status
        </p>
      </div>

      {/* Tracking Form */}
      <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700 mb-2">
              Order Number
            </label>
            <input
              type="text"
              id="orderNumber"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="e.g., ORDER-123456"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
            />
            <p className="mt-2 text-sm text-gray-500">
              You can find your order number in the confirmation email
            </p>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
            />
            <p className="mt-2 text-sm text-gray-500">
              Enter the email used when placing the order
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-700 text-white py-3 px-6 rounded-lg font-semibold hover:bg-amber-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Tracking...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                Track Order
              </>
            )}
          </button>
        </form>
      </div>

      {/* Order Details */}
      {orderData && (
        <div className="space-y-6">
          {/* Status Card */}
          <div className={`border-2 rounded-lg p-8 ${getStatusColor(orderData.status)}`}>
            <div className="flex items-center gap-4 mb-4">
              {getStatusIcon(orderData.status)}
              <div>
                <h2 className="text-2xl font-bold">{getStatusText(orderData.status).label}</h2>
                <p className="text-sm mt-1">{getStatusText(orderData.status).description}</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-current/20">
              <p className="text-sm">
                <strong>Order Number:</strong> {orderData.orderNumber}
              </p>
              <p className="text-sm">
                <strong>Placed on:</strong> {new Date(orderData.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="text-sm">
                <strong>Last Updated:</strong> {new Date(orderData.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Order Information */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Order Information</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Customer Details</h4>
                <p className="text-sm text-gray-600">{orderData.customerName}</p>
                <p className="text-sm text-gray-600">{orderData.customerEmail}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Shipping Address</h4>
                <p className="text-sm text-gray-600 whitespace-pre-line">{orderData.shippingAddress}</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Order Items</h3>
            <div className="space-y-3">
              {orderData.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-3 border-b last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">{item.productName}</p>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-gray-900">Rs {(item.price * item.quantity).toFixed(0)}</p>
                </div>
              ))}
              <div className="flex justify-between items-center pt-4 border-t-2 border-gray-300">
                <p className="text-lg font-bold text-gray-900">Total</p>
                <p className="text-lg font-bold text-gray-900">Rs {orderData.total.toFixed(0)}</p>
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
            <p className="text-gray-700 mb-4">
              Need help with your order?
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/contact"
                className="inline-block bg-amber-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-amber-800 transition"
              >
                Contact Support
              </Link>
              <Link
                href="/faq"
                className="inline-block bg-white text-amber-700 border-2 border-amber-700 px-6 py-2 rounded-lg font-semibold hover:bg-amber-50 transition"
              >
                View FAQ
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Information Cards */}
      {!orderData && (
        <div className="grid md:grid-cols-2 gap-6 mt-12">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Delivery Information</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Major cities: 2-4 business days</li>
              <li>• Other areas: 4-7 business days</li>
              <li>• International: 10-15 business days</li>
            </ul>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Need Help?</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Email: orders@khybershawls.com</li>
              <li>• Phone: +92 300 1234567</li>
              <li>• Hours: Mon-Sat, 9 AM - 6 PM</li>
            </ul>
          </div>
        </div>
      )}
    </main>
  )
}
