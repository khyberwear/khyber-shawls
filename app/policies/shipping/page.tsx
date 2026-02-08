// // // export const runtime = 'edge';
import Link from "next/link"

export const metadata = {
  title: "Shipping & Delivery Policy | Khyber Shawls",
  description: "Learn about our shipping and delivery policies for handcrafted Kashmiri shawls across Pakistan and worldwide.",
}

export default function ShippingPolicyPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <div className="mb-8">
        <Link href="/" className="text-sm text-amber-700 hover:text-amber-800 transition">
          ← Back to Home
        </Link>
      </div>

      <h1 className="text-4xl font-bold text-gray-900 mb-6">Shipping & Delivery Policy</h1>
      <p className="text-gray-600 mb-8">Last updated: October 31, 2025</p>

      <div className="prose prose-lg max-w-none space-y-8">
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Delivery Locations</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            We deliver our handcrafted Kashmiri shawls across Pakistan and to select international destinations. 
            All orders are carefully packaged to ensure your shawl arrives in perfect condition.
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Nationwide delivery across Pakistan</li>
            <li>International shipping to USA, UK, UAE, Canada, and Australia</li>
            <li>Remote areas may require additional delivery time</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Delivery Timeframes</h2>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-4">
            <h3 className="font-semibold text-gray-900 mb-3">Within Pakistan:</h3>
            <ul className="space-y-2 text-gray-700">
              <li><strong>Major Cities (Karachi, Lahore, Islamabad, Peshawar):</strong> 2-4 business days</li>
              <li><strong>Other Cities:</strong> 3-5 business days</li>
              <li><strong>Remote Areas:</strong> 5-7 business days</li>
            </ul>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-3">International Shipping:</h3>
            <ul className="space-y-2 text-gray-700">
              <li><strong>Express Shipping:</strong> 5-7 business days</li>
              <li><strong>Standard Shipping:</strong> 10-15 business days</li>
              <li>Customs clearance may add 2-5 additional days</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Shipping Charges</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Within Pakistan:</strong> Rs 200 flat rate (FREE on orders over Rs 5,000)</li>
            <li><strong>International:</strong> Calculated at checkout based on destination and weight</li>
            <li>Cash on Delivery available in Pakistan (Rs 100 additional fee)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Order Processing</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Orders are processed within 24-48 hours of confirmation. You will receive:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Order confirmation email immediately after purchase</li>
            <li>Shipping confirmation with tracking number when dispatched</li>
            <li>SMS updates on delivery status (Pakistan only)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Tracking Your Order</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Once your order is shipped, you will receive a tracking number via email and SMS. 
            You can track your order on our <Link href="/track-order" className="text-amber-700 hover:text-amber-800 underline">Order Tracking</Link> page 
            or directly with our courier partner.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Packaging</h2>
          <p className="text-gray-700 leading-relaxed">
            Each shawl is carefully folded and wrapped in premium tissue paper, placed in our signature box, 
            and secured for shipping. We include a certificate of authenticity and care instructions with every order.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Delivery Issues</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            If you experience any issues with your delivery:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Contact our support team within 48 hours of expected delivery</li>
            <li>Provide your order number and tracking details</li>
            <li>We will investigate and resolve the issue promptly</li>
          </ul>
        </section>

        <section className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Need Help?</h2>
          <p className="text-gray-700 mb-4">
            For any shipping-related queries, please contact us:
          </p>
          <div className="space-y-2 text-gray-700">
            <p><strong>Email:</strong> support@khybershawls.com</p>
            <p><strong>Phone:</strong> +92 300 1234567</p>
            <p><strong>WhatsApp:</strong> +92 300 1234567</p>
          </div>
        </section>
      </div>
    </main>
  )
}

