// // // // export const runtime = 'edge';
import Link from "next/link"

export const metadata = {
  title: "Return & Refund Policy | Khyber Shawls",
  description: "Our return and refund policy for handcrafted Kashmiri shawls. Easy returns within 30 days.",
}

export default function ReturnPolicyPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <div className="mb-8">
        <Link href="/" className="text-sm text-amber-700 hover:text-amber-800 transition">
          â† Back to Home
        </Link>
      </div>

      <h1 className="text-4xl font-bold text-gray-900 mb-6">Return & Refund Policy</h1>
      <p className="text-gray-600 mb-8">Last updated: October 31, 2025</p>

      <div className="prose prose-lg max-w-none space-y-8">
        <div className="bg-amber-50 border-l-4 border-amber-600 p-6 rounded">
          <p className="text-lg font-semibold text-gray-900 mb-2">30-Day Easy Returns</p>
          <p className="text-gray-700">
            We want you to be completely satisfied with your purchase. If you're not happy with your shawl, 
            you can return it within 30 days of delivery for a full refund or exchange.
          </p>
        </div>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Return Eligibility</h2>
          <p className="text-gray-700 leading-relaxed mb-4">To be eligible for a return:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Item must be unused and in the same condition you received it</li>
            <li>Item must be in original packaging with all tags attached</li>
            <li>Certificate of authenticity must be included</li>
            <li>Return must be initiated within 30 days of delivery</li>
            <li>Product must not show signs of wear, washing, or alterations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Non-Returnable Items</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Custom-made or personalized shawls</li>
            <li>Items on final sale or clearance</li>
            <li>Items damaged due to misuse or improper care</li>
            <li>Items without proof of purchase</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">How to Return</h2>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <ol className="list-decimal list-inside space-y-3 text-gray-700">
              <li>
                <strong>Contact Us:</strong> Email support@khybershawls.com or WhatsApp +92 300 1234567 
                with your order number and reason for return
              </li>
              <li>
                <strong>Get Return Authorization:</strong> We'll provide a return authorization number 
                and return shipping instructions
              </li>
              <li>
                <strong>Pack the Item:</strong> Securely pack the shawl in its original packaging with 
                all tags and certificates
              </li>
              <li>
                <strong>Ship it Back:</strong> Send the package to the address provided (return shipping 
                label included for Pakistan orders)
              </li>
              <li>
                <strong>Refund Processing:</strong> Once we receive and inspect your return, we'll process 
                your refund within 5-7 business days
              </li>
            </ol>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Return Shipping Costs</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Defective/Damaged Items:</strong> We cover all return shipping costs</li>
            <li><strong>Change of Mind:</strong> Customer is responsible for return shipping (Rs 200 within Pakistan)</li>
            <li><strong>Wrong Item Sent:</strong> We cover all costs and send correct item at no charge</li>
            <li>Free return shipping labels provided for orders within Pakistan</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Refund Process</h2>
          <div className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              Once your return is received and inspected, we will send you an email notification. 
              If approved, your refund will be processed as follows:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li><strong>Credit/Debit Card:</strong> 7-10 business days to reflect in your account</li>
              <li><strong>Bank Transfer:</strong> 5-7 business days</li>
              <li><strong>Cash on Delivery:</strong> Bank transfer within 7 business days (provide bank details)</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Exchanges</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            We accept exchanges for different sizes, colors, or styles within 30 days of delivery, 
            subject to availability. The exchange process is the same as returns, but please specify 
            your preferred replacement item when contacting us.
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-gray-700">
              <strong>Note:</strong> If the replacement item has a different price, you'll either 
              receive a refund for the difference or need to pay the additional amount.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Damaged or Defective Items</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            If you receive a damaged or defective item:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Contact us within 48 hours of delivery</li>
            <li>Provide photos of the damage or defect</li>
            <li>We'll arrange immediate replacement or full refund</li>
            <li>No need to return the damaged item in most cases</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Late or Missing Refunds</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            If you haven't received your refund after the specified timeframe:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Check your bank account or credit card statement again</li>
            <li>Contact your bank - there may be processing delays</li>
            <li>Contact us at support@khybershawls.com with your order details</li>
          </ol>
        </section>

        <section className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Questions?</h2>
          <p className="text-gray-700 mb-4">
            If you have any questions about our return and refund policy:
          </p>
          <div className="space-y-2 text-gray-700">
            <p><strong>Email:</strong> support@khybershawls.com</p>
            <p><strong>Phone:</strong> +92 300 1234567</p>
            <p><strong>WhatsApp:</strong> +92 300 1234567</p>
            <p><strong>Business Hours:</strong> Monday - Saturday, 10 AM - 7 PM PKT</p>
          </div>
        </section>
      </div>
    </main>
  )
}


