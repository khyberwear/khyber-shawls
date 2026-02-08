// // // // export const runtime = 'edge';
import Link from "next/link"

export const metadata = {
  title: "Terms & Conditions | Khyber Shawls",
  description: "Read the terms and conditions for using Khyber Shawls website and purchasing our products.",
}

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <div className="mb-8">
        <Link href="/" className="text-sm text-amber-700 hover:text-amber-800 transition">
          â† Back to Home
        </Link>
      </div>

      <h1 className="text-4xl font-bold text-gray-900 mb-6">Terms & Conditions</h1>
      <p className="text-gray-600 mb-8">Last updated: October 31, 2025</p>

      <div className="prose prose-lg max-w-none space-y-8">
        <section>
          <p className="text-gray-700 leading-relaxed">
            Welcome to Khyber Shawls. By accessing our website and purchasing our products, you agree to be bound 
            by these Terms and Conditions. Please read them carefully before using our services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
          <p className="text-gray-700 leading-relaxed">
            By using our website (khybershawls.com), you acknowledge that you have read, understood, and agree 
            to be bound by these Terms and Conditions, as well as our Privacy Policy. If you do not agree, 
            please discontinue use of our website.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Use of Website</h2>
          <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-4">Eligibility</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
            <li>You must be at least 18 years old to make purchases</li>
            <li>You must provide accurate and complete information</li>
            <li>You are responsible for maintaining account security</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-4">Prohibited Activities</h3>
          <p className="text-gray-700 mb-3">You may not:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Use the website for any illegal purpose</li>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Reproduce, distribute, or modify website content without permission</li>
            <li>Use automated systems to access the website</li>
            <li>Interfere with the proper functioning of the website</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Products and Pricing</h2>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-4">Product Information</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>We strive for accuracy in product descriptions and images</li>
            <li>Colors may vary slightly due to screen settings</li>
            <li>All shawls are handcrafted; slight variations are natural</li>
            <li>We reserve the right to discontinue products without notice</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-4">Pricing</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>All prices are in Pakistani Rupees (PKR) unless stated otherwise</li>
            <li>Prices are subject to change without notice</li>
            <li>We reserve the right to correct pricing errors</li>
            <li>The price at checkout is the final price you'll pay</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Orders and Payment</h2>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-4">Placing Orders</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>All orders are subject to acceptance and availability</li>
            <li>We reserve the right to refuse or cancel any order</li>
            <li>Order confirmation does not guarantee acceptance</li>
            <li>Bulk orders may require additional processing time</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-4">Payment Methods</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>We accept credit/debit cards, bank transfers, and cash on delivery</li>
            <li>Payment must be received before order processing</li>
            <li>All transactions are processed securely</li>
            <li>Additional fees may apply for certain payment methods</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Shipping and Delivery</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            Delivery timeframes are estimates and not guaranteed. See our <Link href="/policies/shipping" 
            className="text-amber-700 hover:text-amber-800 underline">Shipping Policy</Link> for detailed information.
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Risk of loss passes to you upon delivery</li>
            <li>We are not liable for delays caused by courier partners</li>
            <li>Incorrect addresses provided by customers are not our responsibility</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Returns and Refunds</h2>
          <p className="text-gray-700 leading-relaxed">
            Please refer to our <Link href="/policies/returns" className="text-amber-700 hover:text-amber-800 underline">
            Return & Refund Policy</Link> for complete information. Returns must comply with our policy to be accepted.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Intellectual Property</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>All content on this website is owned by Khyber Shawls</li>
            <li>Trademarks, logos, and designs are protected by law</li>
            <li>You may not use our intellectual property without written permission</li>
            <li>Product images and descriptions are copyrighted</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Limitation of Liability</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            To the fullest extent permitted by law:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>We are not liable for indirect, incidental, or consequential damages</li>
            <li>Our total liability shall not exceed the amount paid for the product</li>
            <li>We are not responsible for website downtime or technical issues</li>
            <li>We do not warrant uninterrupted or error-free service</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Warranties</h2>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-4">Product Warranties</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>All products are guaranteed to be authentic and handcrafted</li>
            <li>We warrant products against manufacturing defects</li>
            <li>Proper care must be followed (see care instructions)</li>
            <li>Warranty is void if product is damaged through misuse</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-4">Disclaimer</h3>
          <p className="text-gray-700">
            Except as expressly stated, products are provided "as is" without warranties of any kind.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Indemnification</h2>
          <p className="text-gray-700 leading-relaxed">
            You agree to indemnify and hold harmless Khyber Shawls from any claims, damages, or expenses 
            arising from your use of our website or violation of these terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Governing Law</h2>
          <p className="text-gray-700 leading-relaxed">
            These Terms and Conditions are governed by the laws of Pakistan. Any disputes shall be subject 
            to the exclusive jurisdiction of the courts in Peshawar, Pakistan.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Modifications</h2>
          <p className="text-gray-700 leading-relaxed">
            We reserve the right to modify these Terms and Conditions at any time. Changes will be posted 
            on this page with an updated date. Continued use of the website constitutes acceptance of 
            modified terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Severability</h2>
          <p className="text-gray-700 leading-relaxed">
            If any provision of these terms is found to be unenforceable, the remaining provisions will 
            continue in full force and effect.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Contact Information</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            For questions about these Terms and Conditions:
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
            <div className="space-y-2 text-gray-700">
              <p><strong>Khyber Shawls</strong></p>
              <p><strong>Email:</strong> legal@khybershawls.com</p>
              <p><strong>Phone:</strong> +92 300 1234567</p>
              <p><strong>Address:</strong> Peshawar, Pakistan</p>
            </div>
          </div>
        </section>

        <div className="bg-gray-50 border border-gray-300 rounded-lg p-6 mt-8">
          <p className="text-sm text-gray-600">
            By placing an order or using our website, you acknowledge that you have read and agree to these 
            Terms and Conditions. Thank you for choosing Khyber Shawls.
          </p>
        </div>
      </div>
    </main>
  )
}


