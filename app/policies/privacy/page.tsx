// // export const runtime = 'edge';
import Link from "next/link"

export const metadata = {
  title: "Privacy Policy | Khyber Shawls",
  description: "Learn how Khyber Shawls collects, uses, and protects your personal information.",
}

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <div className="mb-8">
        <Link href="/" className="text-sm text-amber-700 hover:text-amber-800 transition">
          ← Back to Home
        </Link>
      </div>

      <h1 className="text-4xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
      <p className="text-gray-600 mb-8">Last updated: October 31, 2025</p>

      <div className="prose prose-lg max-w-none space-y-8">
        <section>
          <p className="text-gray-700 leading-relaxed">
            At Khyber Shawls, we are committed to protecting your privacy and ensuring the security of your 
            personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard 
            your information when you visit our website or make a purchase.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information We Collect</h2>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Personal Information</h3>
          <p className="text-gray-700 mb-3">We collect information that you provide directly to us when you:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Create an account or place an order</li>
            <li>Subscribe to our newsletter</li>
            <li>Contact customer support</li>
            <li>Participate in surveys or promotions</li>
          </ul>
          
          <p className="text-gray-700 mt-4 mb-3">This information may include:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Name and contact information (email, phone number, address)</li>
            <li>Payment information (processed securely through our payment partners)</li>
            <li>Order history and preferences</li>
            <li>Communication history with our team</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Automatically Collected Information</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Browser type and version</li>
            <li>Device information and IP address</li>
            <li>Pages visited and time spent on site</li>
            <li>Referring website and exit pages</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Use Your Information</h2>
          <p className="text-gray-700 mb-4">We use the information we collect to:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Process Orders:</strong> Fulfill and deliver your purchases</li>
            <li><strong>Customer Service:</strong> Respond to inquiries and provide support</li>
            <li><strong>Improve Services:</strong> Enhance our website and product offerings</li>
            <li><strong>Marketing:</strong> Send promotional emails (with your consent)</li>
            <li><strong>Security:</strong> Prevent fraud and protect our customers</li>
            <li><strong>Legal Compliance:</strong> Meet regulatory requirements</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information Sharing</h2>
          <p className="text-gray-700 mb-4">We do not sell your personal information. We may share information with:</p>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Service Providers</h3>
              <p className="text-gray-700">
                Third-party companies that help us operate our business (payment processors, shipping companies, 
                email service providers). They only access information necessary to perform their services.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Legal Requirements</h3>
              <p className="text-gray-700">
                When required by law or to protect our rights, property, or safety of our customers.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Business Transfers</h3>
              <p className="text-gray-700">
                In connection with a merger, acquisition, or sale of assets, your information may be transferred 
                to the acquiring entity.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Cookies and Tracking Technologies</h2>
          <p className="text-gray-700 mb-4">
            We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, 
            and personalize content. You can control cookie preferences through your browser settings.
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-gray-700">
              <strong>Types of cookies we use:</strong> Essential cookies (required for site functionality), 
              Analytics cookies (understand how visitors use our site), Marketing cookies (deliver relevant advertisements).
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Security</h2>
          <p className="text-gray-700 mb-4">
            We implement appropriate technical and organizational measures to protect your personal information:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>SSL encryption for data transmission</li>
            <li>Secure payment processing through PCI-compliant partners</li>
            <li>Regular security audits and updates</li>
            <li>Limited access to personal data by authorized personnel only</li>
            <li>Data backup and disaster recovery procedures</li>
          </ul>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
            <p className="text-gray-700">
              <strong>Note:</strong> While we strive to protect your information, no method of transmission 
              over the Internet is 100% secure. We cannot guarantee absolute security.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Rights</h2>
          <p className="text-gray-700 mb-4">You have the right to:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Access:</strong> Request a copy of your personal information</li>
            <li><strong>Correction:</strong> Update or correct inaccurate information</li>
            <li><strong>Deletion:</strong> Request deletion of your personal data</li>
            <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications</li>
            <li><strong>Portability:</strong> Receive your data in a structured format</li>
            <li><strong>Objection:</strong> Object to processing of your information</li>
          </ul>
          <p className="text-gray-700 mt-4">
            To exercise these rights, contact us at privacy@khybershawls.com
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Children's Privacy</h2>
          <p className="text-gray-700">
            Our website is not intended for children under 13 years of age. We do not knowingly collect 
            personal information from children. If you believe we have collected information from a child, 
            please contact us immediately.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Third-Party Links</h2>
          <p className="text-gray-700">
            Our website may contain links to third-party websites. We are not responsible for the privacy 
            practices of these external sites. We encourage you to read their privacy policies.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">International Data Transfers</h2>
          <p className="text-gray-700">
            Your information may be transferred to and processed in countries other than Pakistan. We ensure 
            appropriate safeguards are in place to protect your information in accordance with this privacy policy.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to This Policy</h2>
          <p className="text-gray-700">
            We may update this Privacy Policy periodically. Changes will be posted on this page with an updated 
            revision date. Significant changes will be communicated via email or prominent notice on our website.
          </p>
        </section>

        <section className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
          <p className="text-gray-700 mb-4">
            If you have questions or concerns about this Privacy Policy or our data practices:
          </p>
          <div className="space-y-2 text-gray-700">
            <p><strong>Email:</strong> privacy@khybershawls.com</p>
            <p><strong>Phone:</strong> +92 300 1234567</p>
            <p><strong>Address:</strong> Khyber Shawls, Peshawar, Pakistan</p>
          </div>
        </section>
      </div>
    </main>
  )
}
